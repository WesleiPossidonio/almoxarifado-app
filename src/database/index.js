import Sequelize from 'sequelize'
import configDataBase from '../config/database.js'
import Category from '../models/Category.js'
import Items from '../models/Items.js'
import Clients from '../models/Clients.js'
import Users from '../models/Users.js'

const models = [Category, Items, Clients, Users]
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
