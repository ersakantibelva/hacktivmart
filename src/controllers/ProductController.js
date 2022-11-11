const { Product, Category, Profile, User, Order, Transaction } = require('../models')
const { Op } = require('sequelize')
const { formatRupiah } = require('../helper/formatters')

class ProductController {
    static listProducts(req, res) {
        const { filter, search, success, error } = req.query
        let products, categories

        
        let options = {
            include: Category,
            order: [['name']]
        }

        if(!options.where) options.where = {}
        if(filter) {
            options.where.CategoryId = filter 
        }
        if(search) {
            options.where.name = { [Op.like]: `%${search}%` }
        }
        if(!req.session.role || (req.session.role && req.session.role == 'buyer')) {
            options.where.stock = { [Op.gte]: 1 }
        }
        Category.findAll()
        .then(result => {
            categories = result 

            return Product.findAll(options)
        })
        .then(result => {
            products = result

            if (!req.session.userId) {
                return null
            } else {
                return User.findByPk(req.session.userId, {
                    include: { model: Profile }
                })
            }
        })
        .then(user => {
            res.render('home', { categories, products, user, success, error, formatRupiah })
        })
        .catch(err => {
            res.send(err)
        })
    }

    static buyProduct(req, res) {
        const { ProductId } = req.params
        let product, order

        Product.decrement({ stock: 1 }, { where: { id: ProductId } })
        .then(result => {
            product = result[0][0][0]

            return Order.findOne({
                where: { UserId: req.session.userId, status: false },
                include: [ Product ]
            })
        .then(result => {
            order = result
            
            if(order) {
                Transaction.updateTransactions(order, product)
            } else {
                Order.create({
                    UserId: req.session.userId,
                })
                .then(result => {
                    order = result
                    return Transaction.create({
                        OrderId: order.id,
                        ProductId,
                        totalPrice: product.price
                    })                    
                })
            }
        })
        .then(_ => {
            res.redirect('/products')
        })
        })
        .catch(err => {
            if (err.name == 'SequelizeValidationError') {
                res.redirect(`/products?error=${err.errors.message}`)
            }
            res.send(err)
        })
    }

    static restockProduct(req, res) {
        const { ProductId } = req.params

        Product.increment({ stock: 1 }, { where: { id: ProductId } })
        .then(product => {
            res.redirect('/products')
        })
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = ProductController