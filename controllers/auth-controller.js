const authController = {}

authController.callback = async (req, res, next) => {
  res.send('urboi')
}

module.exports = authController
