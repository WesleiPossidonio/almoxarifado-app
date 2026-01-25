import Sequelize from 'sequelize'
import configDataBase from '../config/database.js'
import Category from '../../models/Category.js'
import Items from '../models/Items.js'

const models = [Category, Items]

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
