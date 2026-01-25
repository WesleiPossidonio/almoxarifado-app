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

  // static associate(models) {
  // há relacionamentos aqui no futuro
  // }
}

export default Category
