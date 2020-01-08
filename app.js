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

const app = express()
const server = http.createServer(app)

const production = process.env.NODE_ENV

if (!production) {
  dotenv.config({
    path: './.env'
  })
}

const io = socket(server)

io.on('connection', function (socket) {
  console.log('Connected')
  app.set('socket', socket)
  // const data = {}
  // data.message = 'lol'
  // socket.emit('message', data)

  // webhookHandler.on('issue_comment', function (repo, data) {
  //   console.log('comment')
  //   socket.emit('message', data)
  // })

  // webhookHandler.on('issues', function (repo, data) {
  //   console.log('issues')
  //   socket.emit('message', data)
  // })

  // webhookHandler.on('error', function (err, req, res) {
  //   if (err) {
  //     throw err
  //   }
  // })
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

app.get('/error', (req, res) => {
  console.log('lol')
  res.send('The node envirment is ' + process.env.NODE_ENV)
  // process.exit(1)
})

app.use('/', require('./routes/homeRouter.js'))

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
