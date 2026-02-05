import Sequelize, { Model } from 'sequelize'

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'category',
      },
    )
    return this
  }

  static associate(models) {
    this.hasMany(models.Items, {
      foreignKey: 'category_id',
      as: 'items',
    })

    this.belongsTo(models.CategorySection, {
      foreignKey: 'category_section_id',
      as: 'section',
    })
  }
}

export default Category
