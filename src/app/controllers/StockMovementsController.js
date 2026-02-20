import * as Yup from 'yup'
import { Op } from 'sequelize'
import database from '../../database/index.js'
import StockMovements from '../models/StockMovements.js'
import Items from '../models/Items.js'

class StockMovementsController {
  async store(request, response) {
    console.log({
      authHeader: request.headers.authorization,
      user: request.user,
      body: request.body,
    })

    const isAuthenticated = Boolean(request.userName)

    const schema = Yup.object({
      item_id: Yup.string().uuid().required(),
      movement_type: Yup.string().oneOf(['IN', 'OUT']).required(),
      quantity: Yup.number().integer().positive().required(),
      client_id: Yup.string().uuid().nullable(),
      withdrawn_by: Yup.string().when(['movement_type', '$isAuthenticated'], {
        is: (movement_type, isAuthenticated) =>
          movement_type === 'OUT' && !isAuthenticated,
        then: (schema) => schema.required('Informe quem retirou'),
        otherwise: (schema) => schema.strip(),
      }),
      note: Yup.string().nullable(),
    })

    try {
      await schema.validate(request.body, {
        abortEarly: false,
        context: { isAuthenticated },
      })
    } catch (err) {
      return response.status(400).json({
        error: 'Validation fails',
        messages: err.inner.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      })
    }

    const {
      item_id,
      movement_type,
      quantity,
      client_id,
      withdrawn_by,
      added_by,
      note,
    } = request.body

    const transaction = await database.connection.transaction()

    try {
      const item = await Items.findByPk(item_id, {
        transaction,
        lock: transaction.LOCK.UPDATE, // 🔒 evita concorrência
      })

      if (!item) {
        throw new Error('ITEM_NOT_FOUND')
      }

      if (movement_type === 'OUT' && item.quantity < quantity) {
        throw new Error('INSUFFICIENT_STOCK')
      }

      let authorized_by = null

      if (movement_type === 'OUT' && item.control_level === 'RESTRICTED') {
        if (!request.user || request.user.role !== 'admin') {
          throw new Error('ADMIN_REQUIRED')
        }
        authorized_by = request.userName
        console.log(request.userName)
      }

      const withdrawn_by_final =
        movement_type === 'OUT' ? request.userName || withdrawn_by : null

      const added_by_final =
        movement_type === 'IN' ? request.userName || added_by : null

      // 🔄 Atualiza estoque
      item.quantity =
        movement_type === 'IN'
          ? item.quantity + quantity
          : item.quantity - quantity

      await item.save({ transaction })

      const stockMovement = await StockMovements.create(
        {
          item_id: item.id,
          item_name_snapshot: item.item_name,
          movement_type,
          quantity,
          client_id: client_id || null,
          withdrawn_by: withdrawn_by_final,
          added_by: added_by_final,
          authorized_by,
          note,
        },
        { transaction },
      )

      await transaction.commit()
      return response.status(201).json(stockMovement)
    } catch (error) {
      await transaction.rollback()

      if (error.message === 'ITEM_NOT_FOUND') {
        return response.status(404).json({ error: 'Item not found' })
      }

      if (error.message === 'INSUFFICIENT_STOCK') {
        return response.status(400).json({ error: 'Insufficient stock' })
      }

      if (error.message === 'ADMIN_REQUIRED') {
        return response.status(401).json({
          error: 'This item requires administrator authorization',
        })
      }

      return response
        .status(500)
        .json({ error: 'Internal server error', erro: error })
    }
  }

  async index(request, response) {
    const { start_date, end_date, item_id, client_id, movement_type } =
      request.query
    const where = {}

    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      }
    } else {
      const last30Days = new Date()
      last30Days.setDate(last30Days.getDate() - 30)

      where.created_at = {
        [Op.gte]: new Date(start_date || last30Days),
      }
    }

    if (item_id) where.item_id = item_id
    if (client_id) where.client_id = client_id
    if (movement_type) where.movement_type = movement_type

    const movements = await StockMovements.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [
        {
          association: 'item',
          attributes: ['id', 'item_name'],
          include: [
            {
              association: 'category',
              attributes: ['id', 'name', 'category_section_id'],
            },
          ],
        },
        {
          association: 'client',
          attributes: ['id', 'name'],
        },
      ],
    })

    return response.json(movements)
  }
}

export default new StockMovementsController()
