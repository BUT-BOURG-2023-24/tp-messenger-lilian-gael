import {createUser, getUserByName, getUserById,getUsersByIds,} from "../database/Mongo/Controllers/userController";
const express = require('express')
const router = express.Router()
import {checkAuth} from "../middleware/auth";

router.post(
    '/users/create',
    createUser
)

router.get(
    '/users/name/:username',
    checkAuth,
    getUserByName
)

router.get(
    '/users/:id',
    checkAuth,
    getUserById
)

router.get(
    '/users',
    checkAuth,
    getUsersByIds
)

module.exports = router