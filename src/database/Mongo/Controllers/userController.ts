import express, { Request, Response } from 'express';

import User, { IUser } from '../Models/UserModel';
import { JoiRequestValidatorInstance } from "../../../JoiRequestValidator";

const pictures = require("../../../pictures");
const bcrypt = require('bcrypt');

//fonction de creation d'utilisateur
async function createUser(req: Request, res: Response) {
    try {

        const { username, password } = req.body; //recupere les donnees d'inscription
        
        const user = await User.findOne({ username: username });

        //verification de l'existance de l'utilisateur
        if(user){
            return res.status(400).send("User already exist");
        }

        //verif d'eventuelles erreurs
        const { error } = JoiRequestValidatorInstance.validate(req);
        if(error) {
            return res.status(400).json({error: error});
        }

        let hash = await bcrypt.hash(password, 5); //crypte le mdp

        //Creation et ajout du new user
        const newUser = new User({username: username, password: hash, profilePic: pictures.pickRandom()});
        await newUser.save();
    
        return res.status(200).send(newUser);
    }

    catch (error) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
    }
}

module.exports = {
    createUser,
}