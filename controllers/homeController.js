'use strict'
const github = require('octonode')
const _ = require('lodash')
const url  = require('url')

let client
const homeController = {}
const err = {}
let name
let repo

homeController.index = async (req, res, next) => {
  let flash = req.flash('info')
  flash = flash[0]
  res.render('home/login', { flash })
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

homeController.checkRights = async (req, res, next) => {
  const token = req.user.accessToken
  const client = github.client(token)
  name = req.params.id1
  repo = req.params.id2
  const ghrepo = client.repo(`${name}/${repo}`)
  const username = req.user.username

  try {
    const result = await ghrepo.collaboratorsAsync()
    const user = result[0].find(e => e.login === username)
    if (user) {
      if (user.permissions.push) {
        return next()
      }
    }
    err.status = 403
    next(err)
  } catch (error) {
    console.log(error)
  }
}

homeController.closeIssue = async (req, res, next) => {
  console.log('here boi')
  const token = req.user.accessToken
  const client = github.client(token)

  const num = req.params.num
  const ghissue = client.issue(`${name}/${repo}`, num)

  const result = await ghissue.updateAsync({ state: 'closed' })
  let status = result[1].status
  status = status.split(' ')
  status = status[0]

  if (status >= 200 < 300) {
    req.flash('info', { type: 'success', text: 'Issue succesfully closed' })
  } else {
    req.flash('info', { type: 'danger', text: 'An error occured while closing the issue pls try again later' })
  }
  const backURL = req.header('Referer') || '/'
  res.redirect(backURL)
  console.log(status)
}

homeController.createComment = async (req, res, next) => {
  const token = req.user.accessToken
  const client = github.client(token)
  const num = req.params.num
  const name = req.params.id
  const repo = req.params.id2
  const comment = req.body.comment
  console.log(comment)

  const ghissue = client.issue(`${name}/${repo}`, num)

  try {
    const result = await ghissue.createCommentAsync({ body: comment })
    console.log(result)
    let status = result[1].status
    status = status.split(' ')
    status = status[0]

    if (status >= 200 < 300) {
      req.flash('info', { type: 'success', text: 'Comment succesfully created' })
    } else {
      req.flash('info', { type: 'danger', text: 'An error occured while creating comment pls try again later' })
    }
    const backURL = req.header('Referer') || '/'
    res.redirect(backURL)
  } catch (error) {
    console.log(error)
  }
}

homeController.deleteComment = async (req, res, next) => {
  console.log('i am here boi')
  const token = req.user.accessToken
  const client = github.client(token)
  const num = req.params.num
  const name = req.params.id
  const repo = req.params.id2
  const ghissue = client.issue(`${name}/${repo}`, num)

  console.log(req.params.num2)

  try {
    const result = await ghissue.deleteCommentAsync(req.params.num2)
    let status = result[1].status
    status = status.split(' ')
    status = status[0]

    if (status >= 200 < 300) {
      req.flash('info', { type: 'success', text: 'Comment succesfully deleted' })
    } else {
      req.flash('info', { type: 'danger', text: 'An error occured while deleting comment pls try again later' })
    }
    const backURL = req.header('Referer') || '/'
    res.redirect(backURL)
  } catch (error) {
    console.log(error)
  }
}

homeController.deleteHook = async (req, res, next) => {
  const token = req.user.accessToken
  const client = github.client(token)
  const name = req.params.id
  const name2 = req.params.id2
  const hookId = req.params.hookId
  const repo = `${name}/${name2}`
  let hooks = req.user.hooks
  const ghrepo = client.repo(repo)
  await ghrepo.deleteHookAsync(hookId)
  hooks = hooks.filter(hook => { return hook.name !== repo })
  req.user.hooks = hooks
  res.redirect('/')

  // ghrepo.hooks(async function (err, status, body, headers) {
  //   if (err) {
  //     // console.log(err)
  //     if (err.statusCode === 404) {
  //       err.status = 404
  //       return next(err)
  //     } else {
  //       err.status = 500
  //       return next(err)
  //     }
  //   }
  //   if (status) {
  //     if (status.length > 0) {
  //       for (const hook of status) {
  //         const id = hook.id
  //         await ghrepo.deleteHookAsync(id)
  //       }
  //       hooks = hooks.filter(hook => { return hook.name !== repo })
  //     }
  //   }
  //   req.user.hooks = hooks
  //   res.redirect('/')
  // })
}

homeController.toggleHook = async (req, res, next) => {
  const repo = req.body.repo
  const type = req.body.type
  const token = req.user.accessToken
  client = github.client(token)
  const name = repo.substring(0, repo.indexOf('/'))
  console.log(repo)
  const ghrepo = client.repo(repo)
  let hooks = req.user.hooks
  ghrepo.hooks(async function (err, status, body, headers) {
    if (err) {
      // console.log(err)
    }
    if (status) {
      if (status.length > 0) {
        const hook = status.find(e => e.config.url.includes(process.env.url))
        if (hook) {
          const id = hook.id
          await ghrepo.deleteHookAsync(id)
          hooks = hooks.filter(hook => { return hook.name !== repo })
        } else {
          await ghrepo.hookAsync({
            name: 'web',
            active: true,
            events: ['issues', 'issue_comment'],
            config: {
              url: process.env.url + '/hooks'
            }
          })
          hooks.push({ name: repo })
        }
        // console.log(hooks)
      } else {
        await ghrepo.hookAsync({
          name: 'web',
          active: true,
          events: ['issues', 'issue_comment'],
          config: {
            url: process.env.url + '/hooks'
          }
        })
        hooks.push({ name: repo })
      }
    }
    req.user.hooks = hooks
    if (type) {
      res.redirect(`/${req.user.username}/repo/org/${name}`)
    } else {
      res.redirect(`/${req.user.username}/repo`)
    }
  })
}

homeController.profile = async (req, res, next) => {
  const token = req.user.accessToken
  client = github.client(token)
  const profile = {}
  const ghme = client.me()
  const userRepos = []
  const orgRepos = []
  const allRepos = []
  const hooks = []
  const availableHooks = []
  let body = await ghme.reposAsync()

  body[0].forEach(element => {
    if (element.owner.type === 'User') {
      userRepos.push({ name: element.full_name, repo: element.name, img: element.owner.avatar_url, user: element.owner.login })
    }
    allRepos.push(element.full_name)
  })
  profile.user = userRepos

  body = await ghme.orgsAsync()
  const promises = []
  for (const org of body[0]) {
    const url = org.repos_url
    const result = client.getAsync(url)
    promises.push(result)
    orgRepos.push({ name: org.login, img: org.avatar_url, url: org.repos_url, user: req.user.username })
  }

  await Promise.all(promises).then(function (values) {
    values.forEach((result, i) => {
      if (result[0] === 200) {
        const lol = []
        result[1].forEach(element => {
        // console.log(element)
          const filtered = _.pick(element, 'name', 'full_name', 'html_url', 'hooks_url', 'id')
          lol.push(filtered)
          if (!allRepos.includes(element.full_name)) {
            allRepos.push(element.full_name)
          }
        })

        orgRepos[i].repos = lol
      } else {
        err.status = 500 //TODO CHECK FOR A BETTER CODE
        next(500)
      }
    })
  })

  let counter = 0

  const promise1 = new Promise(function (resolve, reject) {
    for (const repo of allRepos) {
      const ghrepo = client.repo(repo)
      ghrepo.hooks(function (err, status, body, headers) {
        counter++
        if (err) {
          // console.log(err)
        }
        if (status) {
          console.log(status)
          const hook = status.find(e => e.config.url.includes(process.env.url))
          availableHooks.push({ name: repo })
          if (hook) {
            hooks.push({ name: repo, id: hook.id })
          }
          console.log(hook)
        }
        if (counter === allRepos.length) {
          resolve()
        }
      })
    }
  })

  await promise1
  req.user.availableHooks = availableHooks
  req.user.hooks = hooks

  profile.org = orgRepos
  req.user.profile = profile
  const info = [{ name: ' User Repos ', count: profile.user.length, user: true, username: req.user.username }, { name: 'Org', count: profile.org.length, username: req.user.username }]
  let flash = req.flash('info')
  flash = flash[0]
  res.render('profile/profile', { info, hooks, flash, csrfToken: req.user.csrfToken })
}

homeController.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) { return next() } else {
    err.status = 403
    next(err)
  }
}

module.exports = homeController
