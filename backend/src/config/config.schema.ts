import Joi from "joi";

export const ConfigSchema = Joi.object({
	DATABASE_URL: Joi.string()
		.required()
		.uri({
			scheme: ["postgresql"],
		}),

	REDIS_HOST: Joi.string().default("localhost"),
	REDIS_PORT: Joi.number().default(6379),
	REDIS_CACHE_TTL: Joi.number()
		.default(60 * 15)
		.description("This value is in seconds"),

	SESSION_NAME: Joi.string().default("mawi"),
	SESSION_SECRET: Joi.string().required(),
	SESSION_COOKIE_AGE: Joi.number().default(1e3 * 60 * 15),

	GITHUB_CLIENT_ID: Joi.string().required(),
	GITHUB_CLIENT_SECRET: Joi.string().required(),
	GITHUB_CLIENT_CALLBACK_URL: Joi.string()
		.uri({
			scheme: ["http", "https"],
		})
		.required(),

	GOOGLE_CLIENT_ID: Joi.string().required(),
	GOOGLE_CLIENT_SECRET: Joi.string().required(),
	GOOGLE_CLIENT_CALLBACK_URL: Joi.string()
		.uri({
			scheme: ["http", "https"],
		})
		.required(),
	FRONTEND_LANDING_PAGE: Joi.string().required(),
	FRONTEND_HOME_PAGE: Joi.string().required(),
}).unknown(false);
