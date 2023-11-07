import { Request, Response } from "express";
import Message, { IMessage } from '../Models/MessageModel';
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
            return res.status(404).json({ message: "Message non trouvé" });
        }

        // update le message
        message.content = content;
        message.edited = edited;
        
        await message.save();

        return res.status(200).json(message);
    } 
    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification du message');
    }
}

//fonction pour supprimer le message
async function deleteMessage(req: Request, res: Response) {

}

//fonction pour réagir au message
async function reactToMessage(req: Request, res: Response) {

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