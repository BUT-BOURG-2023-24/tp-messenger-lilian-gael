import { Request, Response } from "express";
import Conversation, { IConversation } from '../Models/ConversationModel';
import { JoiRequestValidatorInstance } from "../../../JoiRequestValidator";
import Message from "../Models/MessageModel";

 export async function createConversation(req: Request, res: Response) {
    try {
        // R�cup�rer les donn�es n�cessaires depuis le corps de la requ�te
        const { participants, title, lastUpdate } = req.body;

        // V�rifiez que les donn�es obligatoires sont pr�sentes dans la requ�te
        if (!participants || !title || !lastUpdate) {
            return res.status(400).json({ message: "Donn�es manquentes pour la cr�ation de conversation " });
        }

        const newConversation: IConversation = new Conversation({
            participants, // Tableau d'identifiants d'utilisateurs
            title,
            lastUpdate,
            messages: [], // Initialisez le tableau de messages vide ou avec les messages existants
            seen: [] // Initialisez les vus � vide ou avec les vus existants
        });

        // Enregistrez la nouvelle conversation dans la base de donn�es
        await newConversation.save();

        // R�ponse de succ�s
        res.status(201).json(newConversation);
    } catch (error) {
        console.error("Erreur lors de la cr�ation de la conversation :", error);
        res.status(500).json({ message: "Erreur lors de la cr�ation de la conversation" });
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

