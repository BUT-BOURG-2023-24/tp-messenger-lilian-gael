import { Request, Response } from "express";
import Conversation, { IConversation } from '../Models/ConversationModel';
import { JoiRequestValidatorInstance } from "../../../JoiRequestValidator";
import Message from "../Models/MessageModel";

 export async function createConversation(req: Request, res: Response) {
    try {
        // Récupérer les données nécessaires depuis le corps de la requête
        const { participants, title, lastUpdate } = req.body;

        // Vérifiez que les données obligatoires sont présentes dans la requête
        if (!participants || !title || !lastUpdate) {
            return res.status(400).json({ message: "Données manquentes pour la création de conversation " });
        }

        const newConversation: IConversation = new Conversation({
            participants, // Tableau d'identifiants d'utilisateurs
            title,
            lastUpdate,
            messages: [], // Initialisez le tableau de messages vide ou avec les messages existants
            seen: [] // Initialisez les vus à vide ou avec les vus existants
        });

        // Enregistrez la nouvelle conversation dans la base de données
        await newConversation.save();

        // Réponse de succès
        res.status(201).json(newConversation);
    } catch (error) {
        console.error("Erreur lors de la création de la conversation :", error);
        res.status(500).json({ message: "Erreur lors de la création de la conversation" });
    }
}

export async function getConversationWithParticipants(req: Request, res: Response) {
}

export async function getAllConversationsForUser(req: Request, res: Response) {
}

export async function getConversationById(req: Request, res: Response) {
}



export async function addMessageToConversation(req: Request, res: Response) {
}

export async function setConversationSeenForUserAndMessage(req: Request, res: Response) {
}
export async function deleteConversation(req: Request, res: Response) {
}

