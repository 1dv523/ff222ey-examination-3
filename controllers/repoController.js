const moment = require('moment')
const github = require('octonode')

const repoController = {}
const err = {}
let ghrepo

repoController.index = async (req, res, next) => {
  const repos = req.user.profile.user
  const img = req.user.avatar_url
  res.render('home/home', { repos, img })
}

repoController.user = async (req, res, next) => {
  
}

repoController.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}

repoController.userIssues = (req, res, next) => {
  const token = req.user.accessToken
  const client = github.client(token)
  const rep = req.params.rep
  ghrepo = client.repo(`${req.user.username}/${rep}`)
  next()
}

repoController.orgIssues = (req, res, next) => {
  const token = req.user.accessToken
  const client = github.client(token)
  const org = req.params.id
  const repo = req.params.rep
  ghrepo = client.repo(`${org}/${repo}`)
  next()
}

repoController.issues = (req, res, next) => {
  const issues = []
  ghrepo.issues({
    per_page: 100
  }, function (err, status, body, headers) {
    if (err) {
      console.log(err)
      err.status = 500
      return next(err)
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
            updated: moment(element.updated_at).format('MMMM Do YYYY, h:mm a')
          }
        )
      })
    }
    res.render('home/issues', { issues })
  }) // array of
}

repoController.preRepo = async (req, res, next) => {
  const repo = req.params.id
  const arr = req.user.profile.org
  const org = arr.find(o => o.name === repo)
  if (org) {
    req.user.org = org
    next()
  } else {
    err.status = 404
    next(err)
  }
}

repoController.orgRepo = async (req, res, next) => {
  console.log('i am here biych')
  const org = req.user.org
  const repos = org.repos
  res.render('home/home', { repos, img: org.img, org: org.name })
  // console.log(org)
}

repoController.org = async (req, res, next) => {
  const org = req.user.profile.org
  const user = {}
  user.name = req.user.username
  res.locals.user = user
  // console.log(org)
  res.render('profile/orgs', { org })
}

module.exports = repoController
