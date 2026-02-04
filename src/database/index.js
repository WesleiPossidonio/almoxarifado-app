import Sequelize from 'sequelize'
import configDataBase from '../config/database.js'
import Category from '../App/models/Category.js'
import Items from '../App/models/Items.js'
import Clients from '../App/models/Clients.js'
import Users from '../App/models/Users.js'
import StockMovements from '../App/models/StockMovements.js'

const models = [Category, Items, Clients, Users, StockMovements]
class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(configDataBase)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      )
  }
}

export default new Database()
