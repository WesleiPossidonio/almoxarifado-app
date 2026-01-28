import * as Yup from 'yup'
import sequelize from '../database/index.js'
import StockMovements from '../models/StockMovements.js'
import Items from '../models/Items.js'

class StockMovementsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      item_id: Yup.string().uuid().required(),
      movement_type: Yup.string().oneOf(['IN', 'OUT']).required(),
      quantity: Yup.number().positive().integer().required(),
      client_id: Yup.string()
        .uuid()
        .when('movement_type', {
          is: 'OUT',
          then: (schema) => schema.required(),
          otherwise: (schema) => schema.nullable(),
        }),
      withdrawn_by: Yup.string().when('movement_type', {
        is: 'OUT',
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.nullable(),
      }),
      note: Yup.string().nullable(),
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({
        error: 'Validation fails',
        messages: err.inner,
      })
    }

    const { item_id, movement_type, quantity, client_id, withdrawn_by, note } =
      req.body

    const transaction = await sequelize.transaction()

    try {
      const item = await Items.findByPk(item_id, { transaction })

      if (!item) {
        await transaction.rollback()
        return res.status(404).json({ error: 'Item not found.' })
      }

      // ❌ não permitir estoque negativo
      if (movement_type === 'OUT' && item.quantity < quantity) {
        await transaction.rollback()
        return res.status(400).json({
          error: 'Insufficient stock.',
        })
      }

      // 🔐 autorização para itens restritos
      let authorizedBy = null

      if (movement_type === 'OUT' && item.control_level === 'RESTRICTED') {
        if (!req.user || req.user.role !== 'admin') {
          await transaction.rollback()
          return res.status(401).json({
            error: 'This item requires administrator authorization.',
          })
        }

        authorizedBy = req.user.name
      }

      // 🔄 atualiza estoque
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
          client_id: movement_type === 'OUT' ? client_id : null,
          withdrawn_by: movement_type === 'OUT' ? withdrawn_by : null,
          authorized_by: authorizedBy,
          note,
        },
        { transaction },
      )

      await transaction.commit()

      return res.status(201).json(stockMovement)
    } catch (error) {
      await transaction.rollback()
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async index(req, res) {
    const movements = await StockMovements.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          association: 'item',
          attributes: ['id', 'item_name'],
        },
      ],
    })

    return res.json(movements)
  }
}

export default new StockMovementsController()
