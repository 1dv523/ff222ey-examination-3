'use strict'
const github = require('octonode')
const _ = require('lodash')

let client
const homeController = {}
const err = {}

homeController.index = async (req, res, next) => {
  res.render('home/login')
}

homeController.preIndex = async (req, res, next) => {
  if (req.user) {
    res.redirect(`/${req.user.username}/profile`)
  } else {
    next()
  }
}

homeController.preLogout = async (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect(`/${req.user.username}/profile`)
  }
}

homeController.logout = async (req, res, next) => {
  req.logout()
  res.redirect('/')
}

homeController.hooks = (req, res, next) => {
  console.log(req.headers)
  console.log(req.body.action)
}

homeController.profile = async (req, res, next) => {
  const token = req.user.accessToken
  client = github.client(token)
  const profile = {}
  const ghme = client.me()
  const userRepos = []
  const orgRepos = []
  ghme.repos(function (err, body, status) {
    if (err) {
      console.log(err)
    }

    body.forEach(element => {
      if (element.owner.type === 'User') {
        userRepos.push({ name: element.name, url: element.full_name, img: element.owner.avatar_url, user: element.owner.login })
      }
    })
    profile.user = userRepos
  })

  ghme.orgs(async function (err, body, status) {
    if (err) {
      console.log(err)
      err.status = 500
      return next(err)
    }

    for (const org of body) {
      console.log(org)
      const url = org.repos_url
      const result = await client.getAsync(url)
      if (result[0] === 200) {
        const lol = []
        result[1].forEach(element => {
        // console.log(element)
          const filtered = _.pick(element, 'name', 'full_name', 'html_url', 'hooks_url', 'id')
          lol.push(filtered)
        })

        orgRepos.push({ name: org.login, img: org.avatar_url, url: org.repos_url, user: req.user.username, repos: lol })
      } else {
        err.status = 500 //TODO CHECK FOR A BETTER CODE
        next(500)
      }
    }
    profile.org = orgRepos
    req.user.profile = profile
    console.log('the lenght is', profile.user)
    console.log(userRepos)
    const info = [{ name: ' User Repos ', count: profile.user.length, user: true, username: req.user.username }, { name: 'Org', count: profile.org.length, username: req.user.username }]
    res.render('profile/profile', { info })
  })
}

homeController.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) { return next() } else {
    err.status = 403
    next(err)
  }
}

module.exports = homeController
