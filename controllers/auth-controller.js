const authController = {}

authController.callback = async (req, res, next) => {
  const username = req.user.username
  res.redirect(`/${username}/profile`)
}

module.exports = authController
