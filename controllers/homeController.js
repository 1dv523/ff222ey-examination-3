'use strict'
const github = require('octonode')
const moment = require('moment')
const fetch = require('node-fetch')
const _ = require('lodash')

let client
let token
const homeController = {}
const err = {}

homeController.index = async (req, res, next) => {
  // const client = github.client()
  // console.log(token)

  // client.get(`/applications/:${process.env.client_id}/tokens/:${token}`, {}, function (err, status, body, headers) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   console.log(body) // json object
  // })
  res.render('home/login')
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

    // body.forEach(element => {
    //   if (element.owner.type === 'User') {
    //     img = element.owner.avatar_url
    //     user = element.owner.login
    //     userRepos.push({ name: element.name, url: element.full_name, img: element.owner.avatar_url, user: element.owner.login })
    //   } else {
    //     orgRepos.push({ name: element.name, url: element.full_name })
    //   }
    //   if (element.owner.type === 'User') {
    //     img = element.owner.avatar_url
    //     user = element.owner.login
    //   } else {
    //     temp.img = element.owner.avatar_url
    //     temp.user = element.owner.login
    //   }
    // })
    // if (!img) {
    //   img = temp.img
    // }
    // if (!user) {
    //   user = temp.user
    // }
    // // console.log(body)
    // const repos = {}
    // repos.org = orgRepos
    // repos.user = userRepos
    // req.session.repos = repos
    // req.session.img = img
    // res.redirect('/repos')
    // res.render('home/home', { repos, img })
  })
  console.log('i am herrejjjj')
  ghme.orgs(function (err, body, status) {
    if (err) {
      console.log(err)
    }
    console.log(body)
  })
}

homeController.profile = async (req, res, next) => {
  // const repos = req.session.repos
  // const img = req.session.img
  const token = req.user.accessToken
  client = github.client(token)
  const profile = {}
  const ghme = client.me()
  const userRepos = []
  const orgRepos = []
  let img
  const temp = {}
  ghme.repos(function (err, body, status) {
    if (err) {
      console.log(err)
    }

    body.forEach(element => {
      if (element.owner.type === 'User') {
        img = element.owner.avatar_url
        userRepos.push({ name: element.name, url: element.full_name, img: element.owner.avatar_url, user: element.owner.login })
      }
    })
    profile.user = userRepos
    // // console.log(body)
    // const repos = {}
    // repos.org = orgRepos
    // repos.user = userRepos
    // req.session.repos = repos
    // req.session.img = img
    // res.redirect('/repos')
    // res.render('home/home', { repos, img })
  })

  ghme.orgs(async function (err, body, status) {
    if (err) {
      console.log(err)
    }

    for (const org of body) {
      console.log(org)
      const url = org.repos_url
      const result = await client.getAsync(url)
      const lol = []
      result[1].forEach(element => {
        // console.log(element)
        const filtered = _.pick(element, 'name', 'full_name', 'html_url', 'hooks_url', 'id')
        lol.push(filtered)
      })

      orgRepos.push({ name: org.login, img: org.avatar_url, repos: lol })
    }
    profile.org = orgRepos
    req.user.profile = profile
    // console.log(profile.org)
    // profile.org.forEach(element => {
    //   console.log(element)
    // })
    const info = [{ name: ' User Repos ', count: profile.user.length, user: true, username: req.user.username }, { name: 'Org', count: profile.org.length, username: req.user.username }]
    res.render('profile/profile', { info })

    // console.log(profile.org)
    // client.get('/orgs/1dv525/repos', {}, function (err, status, body, headers) {
    //   if (err) {
    //     console.log(err)
    //   }
    //   console.log(body) // json object
    // })
  })
}

homeController.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) { return next() } else {
    err.status = 403
    next(err)
  }
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
  res.render('home/login')
  // res.redirect('https://github.com/login/oauth/authorize/?client_id=' + process.env.client_id + '&scope=user%20public_repo%20admin:repo_hook%20admin:org%20admin:org_hook%20repo')
}

module.exports = homeController
