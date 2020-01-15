const controller = require('../controllers/homeController.js')
const express = require('express')
const router = express.Router()

router.get('/', controller.preIndex, controller.index)
router.post('/logout', controller.preLogout, controller.logout)
router.get('/:id/profile', controller.checkAuth, controller.profile)
// router.post('/hooks', controller.hooks)

module.exports = router
