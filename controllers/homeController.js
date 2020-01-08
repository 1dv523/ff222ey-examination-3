'use strict'
const github = require('octonode')
const moment = require('moment')
const fetch = require('node-fetch')

let client
const homeController = {}

homeController.index = (req, res, next) => {
  res.render('home/home')
}

homeController.hooks = (req, res, next) => {
  console.log(req.headers)
  console.log(req.body.action)
}

homeController.callback = async (req, res, next) => {
  const code = req.query.code
  const body = {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    code: code
  }
  res.send(body.client_secret)

  // let response = await fetch('https://github.com/login/oauth/access_token', {
  //   method: 'post',
  //   body: JSON.stringify(body),
  //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  // })
  // response = await response.json()

  // response = await response.json()
  // const token = response.access_token
  // response = await fetch('https://api.github.com/user', {
  //   headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `token ${token}` }
  // })
  // console.log(token)
  // response = await response.json()
  // console.log(response)

  const token = response.access_token
  // res.send(token)
  // client = github.client(token)
  // const ghme = client.me()
  // const repos = []
  // ghme.repos(function (err, body, status) {
  //   if (err) {
  //     console.log(err)
  //   }

  //   body.forEach(element => {
  //     repos.push({ name: element.name, url: element.full_name })
  //     // console.log(element)
  //   })
  //   // console.log(repos)
  //   res.render('home/home', { repos })
  // })
}

homeController.repo = async (req, res, next) => {
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
