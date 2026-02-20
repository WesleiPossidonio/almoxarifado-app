import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class Users extends Model {
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
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        role: Sequelize.STRING,
        update_number: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: false,
      },
    )

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10)
      }
    })
    return this
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

export default Users
