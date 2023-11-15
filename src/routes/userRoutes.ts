const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController')
const auth = require('../auth')

router.post(
    '/users/create',
    userController.createUser
)

router.get(
    '/users/name/:username',
    auth.checkAuth,
    userController.getUserByName
)

router.get(
    '/users/:id',
    auth.checkAuth,
    userController.getUserById
)

router.get(
    '/users',
    auth.checkAuth,
    userController.getUsersByIds
)

module.exports = router