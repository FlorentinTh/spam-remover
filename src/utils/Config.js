import path from 'path';
import joi from 'joi';
import * as dotenv from 'dotenv';

import { Tags, ConsoleHelper } from '../helpers/ConsoleHelper.js';
import ProgramHelper from '../helpers/ProgramHelper.js';

dotenv.config({ path: path.join(ProgramHelper.getRootPath(), '.env') });

const defaultValidationSchema = joi
  .object({
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
    SUMMARY_HOUR: joi.number().integer().required().min(0).max(23)
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
      account: env.ACCOUNT,
      email: {
        FROM: env.FROM,
        TO: env.TO
      },
      summary: {
        DAY: env.SUMMARY_DAY.toLowerCase(),
        HOUR: env.SUMMARY_HOUR
      }
    };
  }
}
