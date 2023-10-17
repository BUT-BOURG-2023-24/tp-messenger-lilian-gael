import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export interface IUser extends Document {
	username: string,
	password: string,
	profilePicId: string

	//A COMPLETER
}

const userSchema: Schema<IUser> = new Schema<IUser>({
	username: {
		//string obligatoire et unique
		type: String,
		required: true,
		unique: true
	  },
	  password: {
		//string obligatoire
		type: String,
		required: true
	  },
	  profilePicId: {
		// pas obligatoire 
		type: String, //string car pictures.ts sont des strings
		default: null
	  }
	//A COMPLETER
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
