import * as Yup from 'yup'
import StockMovements from '../models/StockMovements'
import Items from '../models/Items'

class StockMovementsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      item_id: Yup.string().uuid().required(),
      movement_type: Yup.string().oneOf(['IN', 'OUT']).required(),
      quantity: Yup.number().positive().required(),
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
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({
        error: 'Validation fails',
        messages: err.inner,
      })
    }

    const { item_id, movement_type, quantity, client_id, withdrawn_by } =
      req.body

    const item = await Items.findByPk(item_id)

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' })
    }

    // 🔴 Regra de negócio: não deixar estoque negativo
    if (movement_type === 'OUT' && item.quantity < quantity) {
      return res.status(400).json({
        error: 'Insufficient stock.',
      })
    }

    /**
     * 🔐 Autorização
     * - itens comuns: qualquer um registra
     * - itens restritos: precisa admin logado
     */
    let authorizedBy = 'SYSTEM'

    if (movement_type === 'OUT' && item.control_level === 'RESTRICTED') {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(401).json({
          error: 'This item requires administrator authorization.',
        })
      }

      authorizedBy = req.user.name
    }

    // 🔄 Atualiza estoque
    if (movement_type === 'IN') {
      item.quantity += quantity
    } else {
      item.quantity -= quantity
    }

    await item.save()

    const stockMovement = await StockMovements.create({
      item_id: item.id,
      item_name_snapshot: item.name,
      movement_type,
      quantity,
      client_id: movement_type === 'OUT' ? client_id : null,
      withdrawn_by: movement_type === 'OUT' ? withdrawn_by : null,
      authorized_by: authorizedBy,
    })

    return res.status(201).json(stockMovement)
  }

  async index(req, res) {
    const movements = await StockMovements.findAll({
      order: [['createdAt', 'DESC']],
    })

    return res.json(movements)
  }
}

export default new StockMovementsController()
