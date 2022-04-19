import joi from 'joi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import TypeHelper from './TypeHelper.js';
import { ConsoleHelper, Tags } from './ConsoleHelper.js';

class MailHelper {
  static async getFromFieldFromHeaders(headers) {
    if (!TypeHelper.isArray(headers)) {
      ConsoleHelper.printMessage(Tags.ERROR, `header parameter must be an array`);
    }

    const from = headers.filter(header => header.name === 'From')[0];
    if (!TypeHelper.isUndefinedOrNull(from)) {
      let address = from.value;

      if (address.includes('<') || address.includes('>')) {
        address = address.match(/<([^<]*)>/gm, '')[0].slice(1, -1);
      }

      const schema = joi.string().trim().email();
      const { error } = schema.validate(address);

      let isValid;

      if (error) {
        ConsoleHelper.printMessage(
          Tags.WARN,
          `Error while parsing email address: ${error._original}`,
          {
            error: error.details[0].message
          }
        );

        isValid = false;
      } else {
        isValid = !error;
      }

      return {
        from: address,
        isValid
      };
    }
  }

  static async getDateFieldFromHeaders(headers) {
    if (!TypeHelper.isArray(headers)) {
      ConsoleHelper.printMessage(Tags.ERROR, `header parameter must be an array`);
    }

    const dateReceived = headers
      .filter(header => header.name === 'X-Received')[0]
      .value.split(';')[1]
      .trim();

    dayjs.extend(utc);
    dayjs.extend(timezone);

    return dayjs
      .utc(dateReceived)
      .local()
      .tz('America/Montreal')
      .format('YYYY-MM-DD HH:mm:ss');
  }
}

export default MailHelper;
