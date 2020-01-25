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
const redis = require('redis')
const redisClient = redis.createClient()
const RedisStore = require('connect-redis')(session)
const moment = require('moment')
const flash = require('connect-flash')
const csrf = require('csurf')

const allClients = []
const app = express()
const server = http.createServer(app)
let csurfToken

const sessionStore = new RedisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 })

dotenv.config({
  path: './.env'
})

require('./config/passport-setup')

var sessionMiddleware = session({
  key: 'express.sid',
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // % 1 day
    sameSite: 'lax', // change to lax maybe
    HttpOnly: true
  },
  store: sessionStore
})
var csrfProtection = csrf({ cookie: true })
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(cookieParser())

const io = socket(server, { pingInterval: 2000, pingTimeout: 5000 })
io
  .use(function (socket, next) {
    // Wrap the express middleware
    sessionMiddleware(socket.request, {}, next)
  })
  .on('connection', function (socket) {
    let userId = socket.request.session.passport
    if (userId) {
      userId = userId.user.username
      if (socket.connected) {
        console.log(socket.connected)
        allClients.push({ socket, id: userId })
      }
      socket.request.session.passport.user.allClients = allClients
      console.log(allClients.length)
      socket.request.session.passport.user.allClients = allClients
      // app.set(userId, allClients)
      socket.on('token', function () {
        console.log('token mate')
        socket.emit('token', socket.request.session.passport.user.csrfToken)
      })
      console.log('Your User ID is', userId)
      socket.on('disconnect', function () {
        console.log('Got disconnect!', allClients.length)
        const i = allClients.indexOf(socket)
        allClients.splice(i, 1)
        console.log(allClients.length)
      })
    }
  })

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/error', (req, res) => {
  console.log('lol')
  res.send('The node envirment is ' + process.env.client_id)
  // process.exit(1)
})

app.use(webhookHandler)

app.use(csrfProtection, (req, res, next) => {
  if (req.user) {
    // if (allClients) {
    //   req.user.allClients = allClients
    // }
    csurfToken = req.csrfToken()
    req.user.csrfToken = csurfToken
    // res.locals.flash = flash
    res.locals.loggedIn = true
    res.locals.navBar = req.user
    res.locals.csrfToken = csurfToken
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

// use our middleware

webhookHandler.on('issue_comment', function (repo, data) {
  console.log('comment')
  const obj = JSON.parse(data.payload)
  obj.token = csurfToken
  console.log(obj)
  const id = obj.issue.user.login
  const created = obj.comment.created_at
  const updated = obj.comment.updated_at
  obj.comment.created_at = moment(created.updated_at).calendar()
  obj.comment.updated_at = moment(updated.updated_at).calendar()
  const arr = allClients.filter(e => e.id === id)
  console.log(arr)
  // const allClients = app.get(id)
  if (arr.length > 0) {
    for (const jo of arr) {
      const socket = jo.socket
      console.log(jo.id)
      socket.emit('issue_comment', obj)
    }
    console.log('I am here lol')
  }
})

webhookHandler.on('issues', function (repo, data) {
  console.log('issues')
  const obj = JSON.parse(data.payload)
  obj.token = csurfToken
  const id = obj.issue.user.login
  const created = obj.issue.created_at
  const updated = obj.issue.updated_at
  obj.issue.created_at = moment(created).format('MMMM Do YYYY, h:mm a')
  obj.issue.updated_at = moment(updated).format('MMMM Do YYYY, h:mm a')
  const arr = allClients.filter(e => e.id === id && arr.socket.connected)
  console.log(arr)
  // const allClients = app.get(id)
  if (arr.length > 0) {
    for (const jo of arr) {
      const socket = jo.socket
      console.log(jo.id)
      socket.emit('issues', obj)
    }
    console.log('I am here lol')
  }
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
