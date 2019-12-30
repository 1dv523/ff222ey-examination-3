'use strict'
const homeController = {}

homeController.index = (req, res, next) => {
  res.render('home/home')
}

module.exports = homeController
