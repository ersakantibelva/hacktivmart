'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    const products = JSON.parse(fs.readFileSync('./data/products.json'))
                      .map(el => {
                        delete el.id
                        el.createdAt = new Date()
                        el.updatedAt = new Date()
                        return el
                      })
                
    return queryInterface.bulkInsert('Products', products)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
