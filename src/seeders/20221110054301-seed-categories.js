'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    const categories = JSON.parse(fs.readFileSync('./data/categories.json'))
                      .map(el => {
                        delete el.id
                        el.createdAt = new Date()
                        el.updatedAt = new Date()
                        return el
                      })
                
    return queryInterface.bulkInsert('Categories', categories)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
