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
        number_service: Sequelize.STRING,
        notes: Sequelize.TEXT,
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
