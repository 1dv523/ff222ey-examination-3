const moment = require('moment')
const github = require('octonode')

const repoController = {}
const err = {}
let ghrepo
let ghissue
let fullName
let num

repoController.index = async (req, res, next) => {
  const repos = req.user.profile.user
  const img = req.user.avatar_url
  const hooks = req.user.availableHooks
  const hooksOn = req.user.hooks
  console.log('repos', repos)

  repos.forEach(repo => {
    delete repo.hookPossible
    delete repo.hook
  })

  repos.forEach(repo => {
    const lol = hooks.find(o => o.name === repo.name)
    const lol2 = hooksOn.find(o => o.name === repo.name)
    console.log(lol2)
    if (lol) {
      repo.hookPossible = true
      // console.log(repo)
    }
    if (lol2) {
      repo.hook = true
      // console.log(repo)
    }
  })
  let flash = req.flash('info')
  flash = flash[0]
  res.render('home/home', { repos, img, flash })
}

repoController.user = async (req, res, next) => {
  
}

repoController.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}

repoController.orgComments = (req, res, next) => {
  const token = req.user.accessToken
  num = req.params.num
  const org = req.params.id
  const repo = req.params.rep
  const client = github.client(token)
  ghissue = client.issue(`${org}/${repo}`, num)
  fullName = `${org}/${repo}`
  next()
}

repoController.userComments = (req, res, next) => {
  const token = req.user.accessToken
  num = req.params.num
  const repo = req.params.rep
  const client = github.client(token)
  ghissue = client.issue(`${req.user.username}/${repo}`, num)
  fullName = `${req.user.username}/${repo}`
  next()
}

repoController.comments = async (req, res, next) => {
  const comments = []
  ghissue.comments(function (err, status, body, headers) {
    if (err) {
      console.log(err)
      if (err.statusCode === 404) {
        err.status = 404
        return next(err)
      } else {
        err.status = 500
        return next(err)
      }
    }
    if (status) {
      status.forEach(element => {
        let owner
        if (element.user.login === req.user.username) {
          owner = true
        } else {
          owner = false
        }
        comments.push({ body: element.body, created: element.created_at, updated: moment(element.updated_at).calendar(), owner, author: element.user.login, img: element.user.avatar_url, id: element.id })
      })
    }
    let flash = req.flash('info')
    flash = flash[0]
    res.render('home/comments', { comments, flash, fullName, num, csrfToken: req.user.csrfToken })
  })
}

repoController.userIssues = (req, res, next) => {
  const token = req.user.accessToken
  const client = github.client(token)
  const rep = req.params.rep
  ghrepo = client.repo(`${req.user.username}/${rep}`)
  fullName = `${req.user.username}/${rep}`
  next()
}

repoController.orgIssues = (req, res, next) => {
  const token = req.user.accessToken
  const client = github.client(token)
  const org = req.params.id
  const repo = req.params.rep
  ghrepo = client.repo(`${org}/${repo}`)
  fullName = `${org}/${repo}`
  next()
}

repoController.issues = (req, res, next) => {
  const issues = []
  ghrepo.issues({
    per_page: 100
  }, function (err, status, body, headers) {
    if (err) {
      if (err.statusCode === 404) {
        err.status = 404
        return next(err)
      } else {
        err.status = 500
        return next(err)
      }
    }
    if (status) {
      status.forEach(element => {
        issues.push(
          {
            title: element.title,
            url: element.html_url,
            comments: element.comments,
            body: element.body,
            user: element.user.login,
            created: moment(element.created_at).format('MMMM Do YYYY, h:mm a'),
            updated: moment(element.updated_at).format('MMMM Do YYYY, h:mm a'),
            number: element.number,
            id: element.id,
            full_name: fullName
          }
        )
      })
    }
    const org = req.params.id
    const repo = req.params.rep
    req.user.issues = issues
    let flash = req.flash('info')
    flash = flash[0]
    console.log(req.user.csrfToken)
    res.render('home/issues', { issues, org, repo, flash, csrfToken: req.user.csrfToken })
  }) // array of
}

repoController.preRepo = async (req, res, next) => {
  const repo = req.params.id
  const arr = req.user.profile.org
  const org = arr.find(o => o.name === repo)
  const hooks = req.user.availableHooks
  const hooksOn = req.user.hooks
  if (org) {
    const arr = org.repos
    arr.forEach(repo => {
      delete repo.hookPossible
      delete repo.hook
    })
    arr.forEach(repo => {
      const lol = hooks.find(o => o.name === repo.full_name)
      const lol2 = hooksOn.find(o => o.name === repo.full_name)
      if (lol) {
        repo.hookPossible = true
      }
      if (lol2) {
        repo.hook = true
      }
    })
    req.user.org = org
    next()
  } else {
    err.status = 404
    next(err)
  }
}

repoController.orgRepo = async (req, res, next) => {
  const org = req.user.org
  const repos = org.repos
  let flash = req.flash('info')
  flash = flash[0]
  res.render('home/home', { repos, img: org.img, org: org.name, flash })
  // console.log(org)
}

repoController.org = async (req, res, next) => {
  const org = req.user.profile.org
  const user = {}
  user.name = req.user.username
  res.locals.user = user
  // console.log(org)
  let flash = req.flash('info')
  flash = flash[0]
  res.render('profile/orgs', { org, flash })
}

module.exports = repoController
