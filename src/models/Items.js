import Sequelize, { Model } from 'sequelize'

class Items extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        category_id: Sequelize.INTEGER,
        control_level: Sequelize.ENUM('FREE', 'RESTRICTED'),
        item_name: Sequelize.STRING,
        unit: Sequelize.STRING,
        quantity: Sequelize.INTEGER,
        min_quantity: Sequelize.INTEGER,
        location: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'items',
      },
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    })
  }
}

export default Items
