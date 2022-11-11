const { Order, Product, User, Profile, Transaction } = require('../models')
const { formatRupiah, formatReceipt } = require('../helper/formatters')
const { response } = require('express')

class OrderController {
    static showCurrentOrder(req, res) {
        let user

        User.findByPk(req.session.userId, {
            include: { model: Profile }
        })
        .then(result => {
            user = result

            return Order.findOne({
                where: { UserId: user.id , status: false },
                include: [ Product ]
            })
        })
        .then(order => {
            let totalCost = 0

            if (order) {
                order.Products.forEach(el => {
                    totalCost += el.Transaction.totalPrice
                })
            }
            res.render('cart', { user, order, totalCost, formatRupiah })
        })
        .catch(err => {
            res.send(err)
        })
    }

    static checkoutCart(req, res) {
        const { OrderId } = req.params

        Order.update({ status: true }, { where: { id: OrderId, status: false } })
        .then(order => {
            const successMsg = 'Thank you for shopping!'

            res.redirect(`/products?success=${successMsg}`)
        })
        .catch(err => {
            res.send(err)
        })
    }

    static showReceipt(req, res) {
        const { OrderId } = req.params

        Order.findByPk(OrderId, { include: [ Product ] })
        .then(order => {
            const receipt = formatReceipt(order)
            res.render('receipt', { receipt })
        })
        .catch(err => {
            res.send(err)
        })
    }

    static deleteTransaction(req, res) {
        const { OrderId, ProductId } = req.params

        Product.increment({ stock: 1 }, { where: { id: ProductId } })
        .then(_ => {
            return Transaction.destroy({ where: { OrderId, ProductId } })
        })
        .then(_ => {
            res.redirect('/cart')
        })
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = OrderController