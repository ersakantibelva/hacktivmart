'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category)
      Product.belongsToMany(models.Order, {
        through: models.Transaction
      })
    }

    // static option(options, filter, search, session) {
    //   // const options = {
    //   //   include: Category,
    //   //   order: [['name']]
    //   // }

    //   if(filter) {
    //       options.where = { CategoryId: filter }
    //   }
    //   if(search) {
    //       options.where = { name: { [Op.like]: `%${search}%` } }
    //   }
    //   if(session.role && session.role != 'seller') {
    //       options.where = { stock: { [Op.gte]: 1 } }
    //   }

    //   return options
    // }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: {
      type: DataTypes.INTEGER
    },
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};