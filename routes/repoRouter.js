const controller = require('../controllers/repoController.js')
const express = require('express')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const router = express.Router()

router.get('/repo', controller.ensureAuthenticated, controller.index)
router.get('/repo/user', controller.ensureAuthenticated, controller.user)
router.get('/repo/org', controller.ensureAuthenticated, controller.org)
router.get('/repo/:id/issues/:rep', csrfProtection, controller.ensureAuthenticated, controller.orgIssues, controller.issues)
router.get('/repo/issues/:rep', csrfProtection, controller.ensureAuthenticated, controller.userIssues, controller.issues)
router.get('/repo/org/:id', controller.ensureAuthenticated, controller.preRepo, controller.orgRepo)
router.get('/repo/issues/:num/:rep/comments', csrfProtection, controller.ensureAuthenticated, controller.userComments, controller.comments)
router.get('/repo/:id/issues/:num/:rep/comments', csrfProtection, controller.ensureAuthenticated, controller.orgComments, controller.comments)

module.exports = router
