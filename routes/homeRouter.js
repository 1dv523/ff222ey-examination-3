const controller = require('../controllers/homeController.js')
const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.get('/login/callback', controller.preCallback, controller.callback)
router.post('/login', controller.login)
router.get('/issues/:id/:id2', controller.issues)
router.get('/:id/repo', controller.repo)
// router.post('/hooks', controller.hooks)

module.exports = router
