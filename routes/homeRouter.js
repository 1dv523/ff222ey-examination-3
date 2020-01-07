const controller = require('../controllers/homeController.js')
const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.get('/login/callback', controller.callback)
router.post('/login', controller.login)
router.get('/repo/:id/:id2', controller.repo)
// router.post('/hooks', controller.hooks)

module.exports = router
