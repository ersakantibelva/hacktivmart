'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static updateTransactions(order, product) {
      if (order.Products.some(el => el.id == product.id)) {
        return Transaction.increment({
            quantity: 1,
            totalPrice: product.price
        }, {
            where: { OrderId: order.id, ProductId: product.id }
        })
      } else {
          return Transaction.create({
              OrderId: order.id,
              ProductId: product.id,
              totalPrice: product.price
          }) 
      }
    }
  }
  Transaction.init({
    OrderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};