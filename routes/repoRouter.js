const controller = require('../controllers/repoController.js')
const express = require('express')
const router = express.Router()

router.get('/repo', controller.ensureAuthenticated, controller.index)
router.get('/repo/user', controller.ensureAuthenticated, controller.user)
router.get('/repo/org', controller.ensureAuthenticated, controller.org)
router.get('/repo/:id/issues/:rep', controller.ensureAuthenticated, controller.orgIssues, controller.issues)
router.get('/repo/issues/:rep', controller.ensureAuthenticated, controller.userIssues, controller.issues)
router.get('/repo/org/:id', controller.ensureAuthenticated, controller.preRepo, controller.orgRepo)

module.exports = router
