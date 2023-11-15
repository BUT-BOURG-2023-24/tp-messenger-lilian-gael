import { type Request, type Response, type NextFunction } from 'express'
import config from '../config'
const jwt = require('jsonwebtoken')
require('dotenv/config')

interface CustomResponse extends Response {
    userId?: string
}


export async function checkAuth (req: Request, res: CustomResponse, next: NextFunction) {
    //R�cup�re le token
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ error: 'Need a token!' })
    }

    const decodedToken = jwt.verify(token, config.SECRET_JWT_KEY)
    const userId = decodedToken.userId

    if (req.body.userId && req.body.userId !== userId) {
        return res.status(401).json({ error: 'Invalid token!' })
    }
    //ID du user ajouter � l'objet
    req.body.user = { id: userId }
    next()
}

module.exports = {
    checkAuth
}