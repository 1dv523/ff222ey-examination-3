const passport = require('passport')
const GitHubStrategy = require('passport-github2')

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (user, done) => {
  // console.log(user)
  done(null, user)
})
console.log(process.env.url + '/auth/github/callback')
passport.use(new GitHubStrategy({
  clientID: process.env.client_id,
  clientSecret: process.env.client_secret,
  callbackURL: process.env.url + '/auth/github/callback'
},
async (accessToken, refreshToken, profile, done) => {
  const user = {
    username: profile.username,
    avatar_url: profile._json.avatar_url,
    node_id: profile._json.node_id,
    github_id: profile.id,
    repos_url: profile._json.repos_url,
    organizations_url: profile._json.organizations_url,
    accessToken
  }
  done(null, user)
}
))

module.exports = passport
