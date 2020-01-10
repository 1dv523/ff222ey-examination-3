'use strict'
const github = require('octonode')
const moment = require('moment')
const fetch = require('node-fetch')

let client
let token
const homeController = {}
const err = {}

homeController.index = async (req, res, next) => {
  const token = req.session.token
  // const client = github.client()
  // console.log(token)

  // client.get(`/applications/:${process.env.client_id}/tokens/:${token}`, {}, function (err, status, body, headers) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   console.log(body) // json object
  // })
  res.render('home/home')
}

homeController.hooks = (req, res, next) => {
  console.log(req.headers)
  console.log(req.body.action)
}

homeController.preCallback = async (req, res, next) => {
  const code = req.query.code
  const body = {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    code: code
  }
  let response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  })
  response = await response.json()
  token = response.access_token
  if (token) {
    req.session.token = token
    next()
  } else {
    err.status = 403
    next(err)
  }
}

homeController.callback = async (req, res, next) => {
  client = github.client(token)
  const ghme = client.me()
  const userRepos = []
  const orgRepos = []
  let img
  let user
  const temp = {}
  ghme.repos(function (err, body, status) {
    if (err) {
      console.log(err)
    }

    body.forEach(element => {
      if (element.owner.type === 'User') {
        img = element.owner.avatar_url
        user = element.owner.login
        userRepos.push({ name: element.name, url: element.full_name, img: element.owner.avatar_url, user: element.owner.login })
      } else {
        orgRepos.push({ name: element.name, url: element.full_name })
      }
      if (element.owner.type === 'User') {
        img = element.owner.avatar_url
        user = element.owner.login
      } else {
        temp.img = element.owner.avatar_url
        temp.user = element.owner.login
      }
    })
    if (!img) {
      img = temp.img
    }
    if (!user) {
      user = temp.user
    }
    // console.log(body)
    const repos = {}
    repos.org = orgRepos
    repos.user = userRepos
    req.session.repos = repos
    req.session.img = img
    res.redirect('/repos')
    // res.render('home/home', { repos, img })
  })
}

homeController.repo = async (req, res, next) => {
  const repos = req.session.repos
  const img = req.session.img
  res.render('home/home', { repos, img })
}

homeController.issues = async (req, res, next) => {
  const org = req.params.id
  const repo = req.params.id2
  const ghrepo = client.repo(`${org}/${repo}`)
  const issues = []

  ghrepo.issues({
    per_page: 100
  }, function (err, status, body, headers) {
    if (err) {
      console.log(err)
    }
    status.forEach(element => {
      issues.push(
        {
          title: element.title,
          url: element.html_url,
          comments: element.comments,
          body: element.body,
          user: element.user.login,
          created: moment(element.created_at).format('MMMM Do YYYY, h:mm a'),
          updated: moment(element.updated_at).format('MMMM Do YYYY, h:mm a')
        }
      )
    })
    console.log(status)
    res.render('home/issues', { issues })
  }) // array of second 100 issues which are closed
}

homeController.login = async (req, res, next) => {
  res.redirect('https://github.com/login/oauth/authorize/?client_id=' + process.env.client_id + '&scope=user%20public_repo%20admin:repo_hook%20admin:org%20admin:org_hook%20repo')
}

module.exports = homeController
