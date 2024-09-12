import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  JWT_SEED: string;
  MAIL_PORT: number;
  MAIL_HOST: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SEED: joi.string().required(),
    MAIL_PORT: joi.number().required(),
    MAIL_HOST: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  database_url: envVars.DATABASE_URL,
  jwt_seed: envVars.JWT_SEED,
  mail_port: envVars.MAIL_PORT,
  mail_host: envVars.MAIL_HOST,
};
