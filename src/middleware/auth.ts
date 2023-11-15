import { type Request, type Response, type NextFunction } from 'express'
import config from '../config'
const jwt = require('jsonwebtoken')
require('dotenv/config')

interface CustomResponse extends Response {
    userId?: string
}


export async function checkAuth (req: Request, res: CustomResponse, next: NextFunction) {
    //recupere le token de l'utilisateur
    const token = req.headers.authorization as string | undefined;

    //si pas de token retourne l'erreur
    if (!token) {
        return res.status(401).json({ error: 'Besoin d\'un token!' });
    }

    try{
        const decodedToken: any = jwt.verify(token, process.env.SECRET_JWT_KEY); //decode le token
        const userId: string = decodedToken.userId; //recupere l'id de l'user

        if (req.body.userId && req.body.userId !== userId) {
            return res.status(401).json({ error: 'Mauvais token' });
        }

        req.body.user = { id: userId };
        next();
    }

    catch (error) {
        return res.status(401).json({ error: 'Probleme avec le token' });
    }


}

module.exports = {
    checkAuth
}