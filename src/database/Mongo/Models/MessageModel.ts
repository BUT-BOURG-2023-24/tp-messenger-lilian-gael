import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";
import Reaction from "../../../Reaction"; //les reactions

import UserModel, { IUser } from "./UserModel";
import ConversationModel, { IConversation } from "./ConversationModel";

export interface IMessage extends Document {
	conversationId : MongooseID;
	from: MongooseID,
	content: string,
	postedAt: Date,
	replyTo: MongooseID | null, //soit une reference à un autre msg soit null
	edited:  boolean,
	deleted: boolean,
	reactions: Map<MongooseID, Reaction> | null; // reference à un string qui sera l'user_id(cle) et un choix parmi l'enum Reaction (valeur), peut être null
	//A COMPLETER
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
	conversationId: {
		type: Schema.Types.ObjectId, //tableau d'identifiants d'objet avec comme référence Conversation
		ref: "ConversationModel", // Référence au modèle Conversation
	},

	from: {
		type: Schema.Types.ObjectId, //tableau d'identifiants d'objet avec comme référence User
		ref: "UserModel", // Référence au modèle User
	},

	content: String,
	postedAt: Date,

	replyTo: {
	  type: Schema.Types.ObjectId,  //tableau d'identifiants d'objet avec comme référence Message null par défaut
	  ref: "Message",
	  default: null,
	},

	edited: Boolean,
	deleted: Boolean,

	reactions: {
		type: Map,
		of: Reaction,
	},
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
