import Sequelize, { Model } from 'sequelize'

class Clients extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'clients',
      },
    )
    return this
  }
}

export default Clients
