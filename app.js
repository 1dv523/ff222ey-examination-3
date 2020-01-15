'use strict'
const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const http = require('http')
const session = require('express-session')
const port = process.env.PORT || 4567
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const GithubWebHook = require('express-github-webhook')
const webhookHandler = GithubWebHook({ path: '/hooks', secret: process.env.GITHUB_TOKEN })
const socket = require('socket.io')
const dotenv = require('dotenv')
const passport = require('passport')

const app = express()
const server = http.createServer(app)

dotenv.config({
  path: './.env'
})

require('./config/passport-setup')

const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // % 1 day
    sameSite: 'lax', // change to lax maybe
    HttpOnly: true
  }
}

app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())

const io = socket(server)

io.on('connection', function (socket) {
  console.log('Connected')
  app.set('socket', socket)
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

app.get('/error', (req, res) => {
  console.log('lol')
  res.send('The node envirment is ' + process.env.client_id)
  // process.exit(1)
})

app.use((req, res, next) => {
  if (req.user) {
    res.locals.loggedIn = true
    res.locals.navBar = req.user
    delete req.session.flash
  }
  if (req.session.userId) {
    const lol = {}
    lol.id = req.session.userId
    res.locals.loggedIn = lol
  }

  next()
})

app.use('/', require('./routes/homeRouter.js'))
app.use('/:id', require('./routes/repoRouter.js'))
app.use('/auth', require('./routes/auth-routes.js'))

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(webhookHandler) // use our middleware

webhookHandler.on('issue_comment', function (repo, data) {
  console.log('comment')
  const socket = app.get('socket')
  socket.emit('message', data)
})

webhookHandler.on('issues', function (repo, data) {
  console.log('issues')
  const socket = app.get('socket')
  socket.emit('message', data)
})

webhookHandler.on('error', function (err, req, res) {
  if (err) {
    throw err
  }
})

// Now could handle following events

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')

app.use((req, res, next) => {
  const err = {}
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404)
    return res.sendFile(path.join(__dirname, 'public', '404.html'))
  } else if (err.status === 403) {
    res.status(403)
    return res.sendFile(path.join(__dirname, 'public', '403.html'))
  }
  res.status(err.status || 500)
  res.sendFile(path.join(__dirname, 'public', '500.html'))
})

server.listen(port, () => console.log('Server running at http://localhost:' + port))
