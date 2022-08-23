const { hashPassword } = require('./../utils')
const { User } = require('./../models')

const registerUser = async (req, res) => {
  try {
    if (req.errors) {
      return res.render('register', { formData: req.body, errorMessage: req.errors })
    }
    const { firstName, lastName, email, phoneNumber, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (user) {
      return res.render('register', { formData: req.body, errorMessage: 'Email already exist' })
    }

    const result = await User.findOne({ where: { phoneNumber } })

    if (result) {
      return res.render('register', { formData: req.body, errorMessage: 'Phone Number already exist' })
    }

    const hashedPassword = await hashPassword.generateHash(password, 10)

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    })

    res.redirect('/login')
  } catch (err) {
    res.render('500error')
  }
}

const login = async (req, res) => {
  try {
    if (req.errors) {
      return res.render('login', { formData: req.body, errorMessage: req.errors })
    }

    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user || !(await hashPassword.comparePassword(password, user.password))) {
      return res.render('login', { formData: req.body, errorMessage: 'Please enter correct email or password' })
    }

    // session will go here

    req.session.user = {
      id: user.id,
    }

    // After login user redirect to shop page
    res.redirect('/product')
  } catch (err) {
    res.render('500error')
  }
}

const logOut = async (req, res) => {
  await req.session.destroy()
  res.redirect('/login')
}

const loginPage = (req, res) => {
  res.render('login')
}

const registerPage = (req, res) => {
  res.render('register')
}

const home = (req, res) => {
  res.redirect('/product')
}

const forgotPassword = (req, res) => {
  res.render('forgotPassword')
}

const resetPassword = (req, res) => {
  res.render('resetPassword')
}

module.exports = {
  registerUser,
  login,
  logOut,
  loginPage,
  registerPage,
  home,
  forgotPassword,
  resetPassword,
}
