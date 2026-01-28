'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'category', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
      control_level: {
        type: Sequelize.ENUM('FREE', 'RESTRICTED'),
        allowNull: false,
        defaultValue: 'FREE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('items')
  },
}
