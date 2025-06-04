import * as Joi from 'joi';

export interface EnvSchema {
  // Environment variables for the application
  NODE_ENV: string;
  PORT: string;
  HOST: string;
  TIMEOUT: number;

  // Redis configuration for auth service
  AUTH_REDIS_URL: string;

  // Kafka configuration for auth service
  KAFKA_BROKERS: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_CONSUMER_GROUP_ID: string;

  //Backend Urls
  AUTH_SERVICE_URL: string;
}

export const envValidationSchema: Joi.ObjectSchema<EnvSchema> = Joi.object<EnvSchema>({
  NODE_ENV: Joi.string().valid('local', 'development', 'test', 'staging', 'production').required(),
  PORT: Joi.number().port().required(),
  HOST: Joi.string().hostname().required(),
  TIMEOUT: Joi.number().integer().min(1000).default(30000),

  AUTH_REDIS_URL: Joi.string().uri().required(),

  KAFKA_BROKERS: Joi.string().required(),
  KAFKA_CLIENT_ID: Joi.string().required(),
  KAFKA_CONSUMER_GROUP_ID: Joi.string().required(),

  AUTH_SERVICE_URL: Joi.string().uri().required(),
});
