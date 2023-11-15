import {createConversation,getConversationWithParticipants,getAllConversationsForUser,getConversationById,addMessageToConversation,setConversationSeenForUserAndMessage,deleteConversation} from "../database/Mongo/Controllers/conversationController";
import {checkAuth} from "../auth";
const express = require('express')
export const router = express.Router()
router.get(
    '/conversations/participants',
    checkAuth,
    getConversationWithParticipants
)

router.get(
    '/conversations/user/:id',
    checkAuth,
    getAllConversationsForUser
)

router.get(
    '/conversations/id/:id',
    checkAuth,
    getConversationById
)

router.post(
    '/conversations/create',
    checkAuth,
    createConversation
)

router.put(
    '/conversations/addMessage/:id',
    checkAuth,
    addMessageToConversation
)

router.put(
    '/conversations/setSeen/:id',
    checkAuth,
    setConversationSeenForUserAndMessage
)

router.delete(
    '/conversations/delete/:id',
    checkAuth,
    deleteConversation
)

module.exports = router
