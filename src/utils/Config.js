import path from 'path';
import joi from 'joi';
import * as dotenv from 'dotenv';

import { ConsoleHelper, Tags } from '../helpers/ConsoleHelper.js';
import ProgramHelper from '../helpers/ProgramHelper.js';

dotenv.config({ path: path.join(ProgramHelper.getRootPath(), '.env') });

const defaultValidationSchema = joi
  .object({
    TZ: joi.string().trim().required(),
    ACCOUNT: joi
      .string()
      .trim()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    FROM: joi.string().trim().required(),
    TO: joi
      .string()
      .trim()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    SUMMARY_DAY: joi
      .string()
      .trim()
      .required()
      .allow({
        values: [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday'
        ]
      }),
    SUMMARY_HOUR: joi.number().integer().required().min(0).max(23),
    GRAFANA_URL: joi.string().trim().uri().optional(),
    IP_INFOS_TOKEN: joi.string().trim().required(),
    DB_USER: joi.string().trim().required(),
    DB_PASSWORD: joi.string().trim().required(),
    DB_HOSTNAME: joi.string().trim().required(),
    DB_PORT: joi.number().required().default(5423),
    DB_NAME: joi.string().trim().required(),
    SSH_HOST: joi.string().trim().optional(),
    SSH_USERNAME: joi.string().trim().optional(),
    SSH_PRIVATE_KEY_PATH: joi.string().trim().optional(),
    SSH_PASSPHRASE: joi.string().trim().optional(),
    SSH_PORT: joi.number().optional().default(22)
  })
  .unknown()
  .required();

export class Config {
  static getConfig() {
    const { error, value: env } = defaultValidationSchema.validate(process.env);

    if (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to validate config`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }

    return {
      timezone: env.TZ,
      account: env.ACCOUNT,
      email: {
        from: env.FROM,
        to: env.TO
      },
      summary: {
        day: env.SUMMARY_DAY.toLowerCase(),
        hour: env.SUMMARY_HOUR,
        grafana_url: env.GRAFANA_URL
      },
      ip_infos: {
        token: env.IP_INFOS_TOKEN
      },
      db: {
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        hostname: env.DB_HOSTNAME,
        port: env.DB_PORT,
        name: env.DB_NAME
      },
      ssh: {
        host: env.SSH_HOST,
        username: env.SSH_USERNAME,
        private_key_path: env.SSH_PRIVATE_KEY_PATH,
        passphrase: env.SSH_PASSPHRASE,
        port: env.SSH_PORT
      }
    };
  }
}
