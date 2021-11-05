const User = require('../models/user')

module.exports.userRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async(req, res, next) => {
    try {
    const newUser = await User.register(new User({username: req.body.username, email: req.body.email}), req.body.password)
        if (!newUser) {
            console.log('error while user register!', err)
            next(err)
          } else {
          console.log('user registered!')
          req.login(newUser, err => {
            if (err) { 
                return next(err); 
            } else {
            req.flash('success', 'Welcome back to Heng Thai')
            return res.redirect('/properties');
            }
          })
        }      
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
        }
}

module.exports.userLoginForm = (req, res) => {
    if (req.user) {
        res.redirect('/properties')
    } else {
    res.render('users/login')
    }
}

module.exports.loginUser = async(req, res) => {
    req.flash('success', 'Welcome back to Heng Thai')
    res.redirect(req.session.returnToUrl || '/properties')
    delete req.session.returnToUrl
}

module.exports.logoutUser = (req, res) => {
    req.logout()
    req.flash('success', 'Hope to see you again. Goodbye!')
    res.redirect('/login')
}

