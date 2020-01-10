const controller = require('../controllers/repoController.js')
const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.get('/user', controller.user)
router.get('/org', controller.org)

module.exports = router
