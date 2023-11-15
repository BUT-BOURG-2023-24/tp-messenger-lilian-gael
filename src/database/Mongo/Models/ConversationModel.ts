import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

// import UserModel, { IUser } from "./UserModel";


export interface IConversation extends Document {
	participants: MongooseID[]; // utilisateurs
	messages: MongooseID[]; //Tableau de chaque message de la conversation
	title: string; //Creation du titre en fct des participants sera dans le controlleur
	lastUpdate: Date;
	seen: { userId: MongooseID; messageId: MongooseID };

	//A COMPLETER
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
	participants: [
		{
		  type: Schema.Types.ObjectId, //tableau d'identifiants d'objet avec comme référence User
		  ref: "UserModel", // Référence au modèle User
		},
	],
	messages: [{
		type: Schema.Types.ObjectId,
		ref: "MessageModel"
	}],

	title: { type: String, required: true },
	lastUpdate: { type: Date, required: true },

	seen: {
		type: {
		  userId: { type: Schema.Types.ObjectId,
			ref: "UserModel",
			required: true 
		  },
		  messageId: {
			type: Schema.Types.ObjectId,
			ref: "MessageModel",
			required: true 
		  },
		},
	  }
//A COMPLETER
});

const ConversationModel = mongoose.model<IConversation>("Conversation", conversationSchema);

export default ConversationModel;