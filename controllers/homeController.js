'use strict'
const homeController = {}

homeController.index = (req, res, next) => {
  
  res.render('home/home')
}

homeController.hooks = (req, res, next) => {
  console.log(req.headers)
  console.log(req.body.action)
}

module.exports = homeController
