const controller = require('../controllers/homeController.js')
const express = require('express')
const router = express.Router()

router.get('/', controller.index)
// router.post('/hooks', controller.hooks)

module.exports = router
