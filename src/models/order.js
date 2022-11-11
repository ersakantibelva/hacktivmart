'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsToMany(models.Product, {
        through: models.Transaction
      })
      Order.belongsTo(models.User)
    }
  }
  Order.init({
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    code: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });

  Order.beforeCreate((instance, options) => {
    instance.code = `B${instance.UserId}-${instance.createdAt.getTime()}`
  })

  return Order;
};