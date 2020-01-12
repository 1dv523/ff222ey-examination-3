const controller = require('../controllers/repoController.js')
const express = require('express')
const router = express.Router()

router.get('/repo', controller.index)
router.get('/repo/user', controller.user)
router.get('/repo/org', controller.org)

module.exports = router
