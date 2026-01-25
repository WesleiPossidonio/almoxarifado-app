import * as Yup from 'yup'
import Items from '../models/Items'

class ItemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      item_name: Yup.string().required(),
      name: Yup.string().required(),
      unit: Yup.string().required(),
      quantity: Yup.number().required(),
      min_quantity: Yup.number().required(),
      location: Yup.string().nullable(),
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner })
    }

    const { item_name, name, unit, quantity, min_quantity, location } = req.body

    const itemExists = await Items.findOne({ where: { item_name } })

    if (itemExists) {
      return res.status(400).json({ error: 'Item already exists.' })
    }

    const item = await Items.create({
      item_name,
      name,
      unit,
      quantity,
      min_quantity,
      location,
    })

    return res.json(item)
  }

  async index(req, res) {
    const listItems = await Items.findAll()
    return res.json(listItems)
  }

  async update(req, res) {
    const { id } = req.params
    const schema = Yup.object().shape({
      item_name: Yup.string(),
      name: Yup.string(),
      unit: Yup.string(),
      quantity: Yup.number(),
      min_quantity: Yup.number(),
      location: Yup.string().nullable(),
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner })
    }

    const item = await Items.findByPk(id)

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' })
    }

    const { item_name } = req.body

    if (item_name && item_name !== item.item_name) {
      const itemExists = await Items.findOne({ where: { item_name } })

      if (itemExists) {
        return res.status(400).json({ error: 'Item already exists.' })
      }
    }

    const updatedItem = await item.update(req.body)

    return res.json(updatedItem)
  }

  async delete(req, res) {
    const { id } = req.params

    const item = await Items.findByPk(id)

    if (!item) {
      return res.status(404).json({ error: 'item not found.' })
    }

    await item.destroy()

    return res.status(204).send()
  }
}

export default new ItemController()
