import Sequelize, { Model } from 'sequelize'

class CategorySection extends Model {
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
    this.hasMany(models.Category, {
      foreignKey: 'category_section_id',
      as: 'category_section',
    })
  }
}

export default CategorySection
