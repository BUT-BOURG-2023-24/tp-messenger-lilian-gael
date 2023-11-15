import {createMessage, editMessage, deleteMessage, reactToMessage, getMessageById} from "../database/Mongo/Controllers/messageController";
import {checkAuth} from "../middleware/auth";
const express = require('express')
const router = express.Router()

router.post(
    '/create',
    checkAuth,
    createMessage
)

router.get(
    '/:id',
    checkAuth,
    getMessageById
)

router.delete(
    '/:id',
    checkAuth,
    deleteMessage
)

router.post(
    '/:id/edit',
    checkAuth,
    editMessage
)

router.post(
    '/:id/react',
    checkAuth,
    reactToMessage
)

module.exports = router