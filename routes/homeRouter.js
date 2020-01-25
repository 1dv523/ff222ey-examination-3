const controller = require('../controllers/homeController.js')
const express = require('express')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const router = express.Router()

router.get('/', controller.preIndex, controller.index)
router.post('/logout', controller.preLogout, controller.logout)
router.get('/:id/profile', controller.checkAuth, controller.profile)
router.post('/deleteHook/:hookId/:id/:id2', csrfProtection, controller.checkAuth, controller.deleteHook) //TODO fix crsf protection
router.post('/toggleHook', controller.checkAuth, controller.toggleHook) //TODO fix crsf protection
router.post('/closeIssue/:num/:id1/:id2', csrfProtection, controller.checkAuth, controller.checkRights, controller.closeIssue) //TODO fix crsf protection
router.post('/createIssueComment/:num/:id/:id2', csrfProtection, controller.checkAuth, controller.createComment) //TODO fix crsf protection
router.post('/deleteIssueComment/:num/:id/:id2/:num2', csrfProtection, controller.checkAuth, controller.deleteComment) //TODO fix crsf protection

module.exports = router
