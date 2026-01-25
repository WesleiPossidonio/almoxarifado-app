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
        category_id: {
          type: Sequelize.INTEGER,
        },
        item_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        unit: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        min_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 8,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: true,
        },
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
