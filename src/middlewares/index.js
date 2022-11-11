const isLoggedin = (req, res, next) => {
    if(!req.session.userId) {
        const errMsg = 'Please login first!'
        return res.redirect(`/login?error=${errMsg}`)
    }
    next()
}

module.exports = isLoggedin