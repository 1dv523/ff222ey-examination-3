const repoController = {}

repoController.index = async (req, res, next) => {
  const repos = req.user.profile.user
  const img = req.user.avatar_url
  console.log('i am here')
  console.log(repos)
  res.render('home/home', { repos, img })
}

repoController.user = async (req, res, next) => {
  
}

repoController.org = async (req, res, next) => {
  const org = req.user.profile.org
  res.render('profile/orgs', { org })
}

module.exports = repoController
