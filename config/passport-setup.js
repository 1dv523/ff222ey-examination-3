const passport = require('passport')
const GitHubStrategy = require('passport-github2')
const User = require('../models/user.js')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

passport.use(new GitHubStrategy({
  clientID: process.env.client_id,
  clientSecret: process.env.client_secret,
  callbackURL: 'https://d603ceac.ngrok.io/auth/github/callback'
},
async (accessToken, refreshToken, profile, done) => {
  console.log('i am here lol')
  console.log(profile)
  const user = await User.findOne({ github_id: profile.id })
  if (user) {
    console.log('user already exists')
    done(null, user)
  } else {
    const user = new User({
      username: profile.username,
      avatar_url: profile._json.avatar_url,
      node_id: profile._json.node_id,
      github_id: profile.id,
      repos_url: profile._json.repos_url,
      organizations_url: profile._json.organizations_url
    })
    await user.save()
    done(null, user)
  }

  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return done(err, user)
  // })
}
))

module.exports = passport
