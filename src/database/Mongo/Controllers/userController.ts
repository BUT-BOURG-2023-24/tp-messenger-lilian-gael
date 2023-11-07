import { Request, Response } from 'express';

import User, { IUser } from '../Models/UserModel';
import { JoiRequestValidatorInstance } from "../../../JoiRequestValidator";

const pictures = require("../../../pictures");
const bcrypt = require('bcrypt');

//fonction de creation d'utilisateur
async function createUser(req: Request, res: Response) {
    try {

        const { username, password } = req.body; //recupere les donnees d'inscription
        const user = await User.findOne({ username: username });
        //verifie si l'utilisateur existe déjà
        if(user){
            return res.status(400).send("Utilisateur déjà existant");
        }
        //verif d'eventuelles erreurs
        const { error } = JoiRequestValidatorInstance.validate(req);
        if(error) {
            return res.status(400).json({error: error});
        }
        let passwordModif = await bcrypt.hash(password, 5); //crypte le mdp en bdd
        //Creation et ajout du new user
        const newUser = new User({username: username, password: passwordModif, profilePic: pictures.pickRandom()}); //pickRandom pour choisir une image aléatoire dans pictures.ts
        await newUser.save();
        return res.status(200).send(newUser);
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la création de l\'utilisateur');
    }

}

//recupére l'utilisateur avec son nom
async function getUserByName(req: Request, res: Response) {
    try {
        const { username } = req.body; // recupere le nom de l'utilisateur

        if (!username) {
            return res.status(400).json({ message: "Nom d'utilisateur manquant dans la requête" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la recherche de l'utilisateur");
    }
}
async function getUserById(req: Request, res: Response) {
    try {
        const { id } = req.params; // Récupére l'id d'utilisateur
        const user = await User.findOne({_id: id}).catch(() => res.status(500).send("L'utilisateur n'existe pas"));
        return res.status(200).send(user);
    }
    catch(error) {
        return res.status(500).send("Erreur lors de la recherche de l'utilisateur");
    }
}
async function getUsersByIds(req: Request, res: Response) {
    try {
        const { ids } = req.body; // récupére l'id de la photo
        if (!req.body || !ids) {
            return res.status(400).json({ message: "L'utilisateur n'existe pas" });
        }
        const users = await User.find({ _id: { $in: ids } }).catch((error: Error) => res.status(500).json({error: error}));
        res.status(200).send(users);
    }
    catch(error) {
        res.status(500).send("Erreur lors de la recherche de l'utilisateur");
    }
}




module.exports = {
    createUser,
    getUserByName,
    getUserById,
    getUsersByIds,

}