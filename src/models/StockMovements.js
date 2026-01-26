import Sequelize, { Model } from 'sequelize'

class StockMovements extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        item_id: Sequelize.UUID,
        item_name_snapshot: Sequelize.STRING,
        movement_type: Sequelize.ENUM('IN', 'OUT'),
        quantity: Sequelize.INTEGER,
        client_id: Sequelize.UUID,
        withdrawn_by: Sequelize.STRING,
        authorized_by: Sequelize.STRING,
        note: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'stock_movements',
        timestamps: true,
        underscored: true,
      },
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Items, {
      foreignKey: 'item_id',
      as: 'item',
    })

    this.belongsTo(models.Clients, {
      foreignKey: 'client_id',
      as: 'client',
    })
  }
}

export default StockMovements
