import * as joi from "joi"; //npm install joi; npm install @types/joi;npm install joi --save-dev;npm install @types/joi --save-dev;
import { Request } from "express";

interface JoiRequestValidatorResponse
{
	error?: string
}

interface JoiRouteValidator
{
	route: string,
	method: string,
	validatorSchema: joi.ObjectSchema<any>
}

class JoiRequestValidator 
{
	validators: JoiRouteValidator[] = 
	[
		{
			route: "", //creation d'user, changements dans usercontroller et userRoutes, peut-être pareil pour message et conversation
			method:"POST",
			validatorSchema: joi.Object({
				username: joi.string().required(),
				password: joi.password.string().min(6).required()
			})
		},
		
		{
			route: "/messages/create",
			method:"POST",
			validatorSchema: joi.Object({ //peut-être rajouter l'id
				conversationId: joi.integer().required(), //si integer existe
				from: joi.string().required(),
				content: joi.string().required(),
				replyTo: joi.string().allow(null),
				edited: joi.boolean(),
				deleted: joi.boolean(),
			})
		},
		
        {
            route: "/conversation/create",
            method: "POST",
            validatorSchema: joi.object({
                participants: joi.array().items(joi.string()).required(),
                messages: joi.array().items(joi.string()).required(),
                title: joi.string().required(),
            }),
        },

		{
            route: "/message/:id/react",
            method: "POST",
            validatorSchema: joi.object({
                reaction: joi.string().required(),
            })
        },

		{
            route: "/message/:id/edit",
            method: "POST",
            validatorSchema: joi.object({
				route: "/message/:id/edit",
				method: "POST",
				validatorSchema: joi.object({
					content: joi.string().required(),
					edited: joi.boolean().required(), //peut-être mettre juste 1 à la place car il est edit
				})
            })
        },

		// EXEMPLE
		// {
		// 	route: "/conversations/:id",
		// 	method: "POST",
		// 	validatorSchema: bodyFormat,
		// }
	];

	validate(request: Request): JoiRequestValidatorResponse 
	{
		// request.baseUrl contient l'URL de base, avant application des middlewares.
		// request.route.path contient l'URL que vous déclarez dans votre middleware de routage.
		console.log(request.baseUrl);
		console.log(request.route.path);

		/* 
			ETAPE 1:

			Trouver dans la liste de validators, le validator qui correspond à la route de la requête.
		*/

		/* 
			ETAPE 2:

			Si le validator n'existe pas
				=> retourner un objet vide.
			Si le validator existe 
				=> valider le body de la requête.
				=> Si le body est valide
					=> retourner un objet vide.
				=> Si le body est invalide
					=> retourner un objet avec une clé error contenant les details de l'erreur.
		*/
		return {};
	}
}

export const JoiRequestValidatorInstance = new JoiRequestValidator();