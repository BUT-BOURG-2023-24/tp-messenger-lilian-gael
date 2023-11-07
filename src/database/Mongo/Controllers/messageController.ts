import { Request, Response } from "express";
import Message, { IMessage } from '../Models/MessageModel';
import User, { IUser } from '../Models/UserModel';

import { JoiRequestValidatorInstance } from "../../../JoiRequestValidator";

//fonction de creation de message
async function createMessage(req: Request, res: Response) {
    try {

        const { conversationId, from, content, postedAt, replyTo, edited, deleted } = req.body; //recupere les donnees du message

        //verif d'eventuelles erreurs
        const { error } = JoiRequestValidatorInstance.validate(req);
        if(error) {
            return res.status(400).json({error: error});
        }

        //Creation et ajout du new message
        const newMessage = new Message({
            conversationId: conversationId,
            from: from,
            content: content,
            postedAt: postedAt,
            replyTo: replyTo,
            edited: edited,
            deleted: deleted,
        });
        await newMessage.save();
        return res.status(200).send(newMessage);
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la création du message');
    }
}

//fonction pour modifier le message
async function editMessage(req: Request, res: Response) {
    try {
        // recupere les donnees du message à modifier
        const { messageId } = req.params;
        const { content, edited } = req.body;

        const message = await Message.findById({ messageId: messageId });

        // Vérifie si le message existe
        if (!message) {
            return res.status(404).json({ message: "Message non trouvé pour la modification" });
        }

        // update le message
        message.content = content;
        message.edited = edited;
        
        await message.save(); // save les modifs en bdd

        return res.status(200).json({ message: "Message modifié avec succès" });
    } 
    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification du message');
    }
}

//fonction pour supprimer le message les messages supprimés seront toujours présents en bdd mais pas affichés dans la conv
async function deleteMessage(req: Request, res: Response) {
    try {
        const { messageId } = req.params; // recupere l'id du msg à supprimer 

        const message = await Message.findById(messageId);

        // verifie si le message existe
        if (!message) {
            return res.status(404).json({ message: "Message non trouvé pour la supression" });
        }

        message.deleted = true; // update le message

        await message.save(); // save les modifs en bdd

        return res.status(200).json({ message: "Message supprimé avec succès" });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la suppression du message" });
    }
}

//fonction pour réagir au message
async function reactToMessage(req: Request, res: Response) {
    try{
        // recupere l'id du message, l'id de l'utilisateur et la reaction à ajouter
        const { messageId, userId } = req.params;
        const { reaction } = req.body;

        const message = await Message.findById(messageId);
        const user = await User.findById(userId);

        // verifie si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé pour l'ajout de réaction" });
        }

        // verifie si le message existe
        if (!message) {
            return res.status(404).json({ message: "Message non trouvé pour l'ajout de réaction" });
        }

        // verifie si message.reactions est défini et non null
        if (message.reactions) {
            // verifie si l'utilisateur n'a pas déjà ajouté cette reaction au message
            if (!message.reactions.has(userId)) {
                message.reactions.set(userId, reaction);
            }
            //s'il l'a déjà a ajouté cette reaction, la supprime
            else {
                message.reactions.delete(userId);
            }
        }
        // Si message.reactions est null, créez une nouvelle Map pour stocker les réactions
        else {
            message.reactions = new Map();
            message.reactions.set(userId, reaction);
        }

        message.reactions.set(userId, reaction);

        await message.save(); // save l'ajout en bdd

        return res.status(200).json(message);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de l'ajout de réaction" });
    }
}

//fonction pour récupérer un message avec son identifiant
async function getMessageById(req: Request, res: Response) {

}

module.exports = {
    createMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    getMessageById
}