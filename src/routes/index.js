const { MainController, ProductController, OrderController } = require('../controllers')
const isLoggedin = require('../middlewares')
const router = require('express').Router()

router.get('/', MainController.home)
router.get('/register', MainController.addRegister)
router.post('/register', MainController.createRegister)
router.get('/login', MainController.addLogin)
router.post('/login', MainController.checkLogin)
router.get('/products', ProductController.listProducts)

router.use(isLoggedin)

router.get('/logout', MainController.logout)
router.get('/profile/:ProfileId', MainController.showProfile)
router.get('/cart', OrderController.showCurrentOrder)
router.get('/orders/checkout/:OrderId', OrderController.checkoutCart)
router.get('/orders/receipt/:OrderId', OrderController.showReceipt)
router.get('/orders/:OrderId/products/:ProductId/delete', OrderController.deleteTransaction)
router.get('/products/:ProductId/buy', ProductController.buyProduct)
router.get('/products/:ProductId/restock', ProductController.restockProduct)

module.exports = router