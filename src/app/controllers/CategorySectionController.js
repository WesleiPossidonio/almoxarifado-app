import * as Yup from 'yup'
import Category from '../models/Category.js'
class CategorySectionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner })
    }

    const { name } = req.body

    const categoryExists = await Category.findOne({ where: { name } })

    if (categoryExists) {
      return res.status(400).json({ error: 'Category already exists.' })
    }

    const category = await Category.create(req.body)

    return res.json(category)
  }

  async index(req, res) {
    const categoryList = await Category.findAll()
    return res.json(categoryList)
  }

  async delete(req, res) {
    const { id } = req.params

    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' })
    }

    await category.destroy()

    return res.status(204).send()
  }
}

export default new CategorySectionController()
