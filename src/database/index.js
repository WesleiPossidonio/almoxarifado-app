import Sequelize from 'sequelize'
import configDataBase from '../config/database.js'
import Category from '../app/models/Category.js'
import Items from '../app/models/Items.js'
import Clients from '../app/models/Clients.js'
import Users from '../app/models/Users.js'
import StockMovements from '../app/models/StockMovements.js'
import CategorySection from '../app/models/CategorySection.js'

const models = [
  CategorySection,
  Category,
  Items,
  Clients,
  Users,
  StockMovements,
]
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
