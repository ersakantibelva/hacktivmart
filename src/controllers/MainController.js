const { User, Profile, Order } = require('../models')

class MainController {
    static home(req, res) {
        res.redirect('/products')
    }

    static addRegister(req, res) {
        let { errors } = req.query

        if(errors) {
            errors = errors.split(';')
        }

        res.render('register', {
            genders: Profile.genders,
            roles: User.roles,
            errors
        })
    }

    static createRegister(req, res) {
        const { firstName, lastName, gender, dateOfBirth, username, email, password, role } = req.body

        User.create({
            username, email, password, role,
            Profile: [{
                firstName, lastName, gender, dateOfBirth
            }]
        }, { include: [ Profile ] })
        .then(user => {
            res.redirect('/login')
        })
        .catch(err => {
            if(err.name == 'SequelizeValidationError') {
                let error = err.errors.map(el => {
                    return el.message
                }).join(';')
                return res.redirect(`/register?errors=${error}`)
            } else {
                res.send(err)
            }
        })
    }

    static addLogin(req, res) {
        const { error } = req.query
        res.render('login', { error })
    }

    static checkLogin(req, res) {
        const { email, password } = req.body

        User.findOne({
            where: {
                email
            }
        })
        .then(user => {
            if(user) return user.checkPassword(password, req, res)

            const errMsg = 'Invalid email, please try again'
            res.redirect(`/login?error=${errMsg}`)
        })
        .catch(err => {
            res.send(err)
        })
    }

    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) return res.send(err)
            res.redirect('/login')
        })
    }

    static showProfile(req, res) {
        let user
        User.findByPk(req.session.userId, {
            include: { model: Profile }
        })
        .then(result => {
            user = result

            return Order.findAll({ where: { UserId: user.id } })
        })
        .then(orders => {
            res.render('profile', { user, orders })
        })
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = MainController