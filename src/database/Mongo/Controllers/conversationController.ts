import { type Request, type Response } from 'express'
import { JoiRequestValidatorInstance } from '../../../JoiRequestValidator'
import Conversation, { IConversation } from '../Models/ConversationModel';


//recupere les participants de la conversation
async function getConversationWithParticipants(req: Request, res: Response) {

    try {
        //Recupere les utilisateurs de la conversation
        const { userOne, userTwo } = req.body
        const conversation = await Conversation.findOne({
          participants: { $all: [userOne, userTwo] } //all = mongo pour s'assurer que userOne et userTwo sont présents
        }) ;
        
        //verifie si la conv existe
        if (conversation) {
          return res.status(200).send({ conversation });
        }
        else {
          return res.status(404).send({conversation: "Conversation non trouvée"});
        }
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des participants de la conversation');
    }
}

//recupére les conversations d'un utilisateur
async function getAllConversationsForUser(req: Request, res: Response) {
    try {
        //recup l'id de l'user
        const { idUser } = req.params;

        //recup les conversations de l'user
        const conversations = await Conversation.find({
            participants: { $in: [idUser] } //in = mongo pour s'assurer que l'id user est présent
        });

        //verifie s'il a des conversations
        if(conversations){
            return res.status(200).send({ conversations });
        }
        else {
            return res.status(404).send("Aucune conversation n'a pu être trouvée");
        }
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des conversations de l\'utilisateur ');
    }
}

//recupere la conversation grâce à son id
async function getConversationById(req: Request, res: Response, idConversation: number) {
    try {
        const { idConv } = req.params; //recupere l'id de la conversation
        const conversation = await Conversation.findById(idConv); //recupere la conversation avec son id (findById)

        //vérifie que la conversation existe
        if (conversation) {
          return res.status(200).send({ conversation });
        } 
        else {
          return res.status(404).send({conversation: "la conversation n'a pas pu être trouvée"});
        }
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération de conversation par id');
    }
}

//creer une nouvelle conversation
async function createConversation(req: Request, res: Response) {
    try {
        const { participants, messages, title } = req.body; //recupere les infos de la conversation
        const lastUpdate = new Date(); //Derniere modif de la conversation

        //verif d'eventuelles erreurs
        const { error } = JoiRequestValidatorInstance.validate(req);
        if(error) {
            return res.status(400).json({error: error});
        }

        const newConversation = new Conversation({
            participants,
            messages,
            title,
            lastUpdate
        });

        await newConversation.save(); //enregistre en bdd

        return res.status(200).send(newConversation);
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la création de conversation');
    }
}

//ajoute un message à la conversation
async function addMessageToConversation(req: Request, res: Response) {
    try {
        const { idConversation } = req.params; //recupere l'id de la conversation
        const { addedMessage } = req.body; //recupere le message

        //verif d'eventuelles erreurs
        const { error } = JoiRequestValidatorInstance.validate(req)
        if (error) {
            return res.status(400).json({ error });
        }
    
        const updatedConversation = await Conversation.findOneAndUpdate(
          { _id: idConversation }, //pour trouver la conversation
          { $push: { messages: addedMessage } }, //ajoute le message à la liste des messages de la conversation
          { new: true } //mets à jour la conv
        );
    
        //vérifie que la conversation est bien ajoutée
        if (updatedConversation) {
          return res.status(200).json(updatedConversation);
        } 
        else {
          return res.status(404).send({updatedConversation: "Le message n'a pas pu être ajouté"});
        }
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de l\ajout du message à la conversation');
    }
}

async function setConversationSeenForUserAndMessage(req: Request, res: Response) { //ici aide
    try {
        type MongooseID = string;


        const { idConversation } = req.params; //recupere l'id de la conversation 
        const { user, message } = req.body; //recupere l'user et le dernier message
        //verif d'eventuelles erreurs
        const { error } = JoiRequestValidatorInstance.validate(req);
        if (error) {
            return res.status(400).json({ error });
        }

        const conversation = await Conversation.findById(idConversation); //recup la conversation avec son id
        if (!conversation) {
            return res.status(404).send({conversation: "conversation non trouvée"});
        }

        const updateSeen = new Map<string, MongooseID>(Object.entries({
            [user.id.toString()]: message
          })) || new Map<string, MongooseID>();
        console.log("updateSeen: " + updateSeen); //debug

        const { modifiedCount } = await Conversation.updateOne(
            { _id: idConversation },
            { seen: updateSeen }
        ); //modifie la valeurs de seen

        if (modifiedCount == 0) {
            return res.status(400).send({conversation: "erreur avec la conversation"});
        } 
        else {
            return res.status(200).json(conversation);
        }
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de setConversationSeenForUserAndMessage');
    }
}

//supprime une conversation
async function deleteConversation(req: Request, res: Response) {
    try {
        const { idConversation } = req.params; //recupere l'id de la conversation

        const deletedProductData = await Conversation.findByIdAndRemove(idConversation); //trouve la conv avec son id et la supprime
        if (deletedProductData) {
          return res.status(200).send({conversation: "conversation supprimée"});
        }
        else {
            return res.status(404).send({conversation: "Conversation non trouvée"});
        }
    }

    catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la suppression de la conversation');
    }
}


module.exports = {
    getConversationWithParticipants,
    getAllConversationsForUser,
    getConversationById,
    createConversation,
    addMessageToConversation,
    setConversationSeenForUserAndMessage,
    deleteConversation
}