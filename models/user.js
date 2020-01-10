'use strict'
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  avatar_url: { type: String, required: true, unique: true },
  node_id: { type: String, required: true },
  github_id: { type: String, required: true },
  repos_url: { type: String, required: true },
  organizations_url: { type: String, required: true }
})

userSchema.plugin(uniqueValidator, { message: 'Error, {PATH} already exist.' })

const myDB = mongoose.connection.useDb('Github')
const Schema = myDB.model('user', userSchema)

// const Schema = mongoose.model('User', userSchema)

module.exports = Schema
