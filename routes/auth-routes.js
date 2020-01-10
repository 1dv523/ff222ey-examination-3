const controller = require('../controllers/auth-controller.js')
const express = require('express')
const router = express.Router()
const passport = require('passport')

router.post('/github', passport.authenticate('github', { scope: ['user', 'repo', 'admin:repo_hook', 'admin:org_hook', 'admin:org', 'admin:repo_hook'] }))
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), controller.callback)

module.exports = router
