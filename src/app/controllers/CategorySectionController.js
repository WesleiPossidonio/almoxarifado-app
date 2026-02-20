import * as Yup from 'yup'
import CategorySection from '../models/CategorySection.js'
import Category from '../models/Category.js'
import Items from '../models/Items.js'
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

    const categoryExists = await CategorySection.findOne({ where: { name } })

    if (categoryExists) {
      return res.status(400).json({ error: 'Category already exists.' })
    }

    const category = await CategorySection.create(req.body)

    return res.json(category)
  }

  async index(req, res) {
    const categoryList = await CategorySection.findAll({
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name'],
          include: [
            {
              model: Items,
              as: 'items',
              attributes: [
                'id',
                'item_name',
                'quantity',
                'min_quantity',
                'unit',
                'code',
              ],
            },
          ],
        },
      ],
    })

    return res.json(categoryList)
  }

  async delete(req, res) {
    const { id } = req.params

    const category = await CategorySection.findByPk(id)

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' })
    }

    await category.destroy()

    return res.status(204).send()
  }
}

export default new CategorySectionController()
