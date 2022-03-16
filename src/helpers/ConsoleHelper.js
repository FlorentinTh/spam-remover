import chalk from 'chalk';
import dayjs from 'dayjs';
import joi from 'joi';

import TypeHelper from './TypeHelper.js';

export const Tags = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  OK: 'OK',
  WARN: 'WARN'
};

export const EOL = {
  START: 'START',
  END: 'END',
  BOTH: 'BOTH',
  NONE: 'NONE'
};

export class ConsoleHelper {
  static printMessage(tag, message, options = { error: null, eol: 'NONE', date: true }) {
    switch (tag) {
      case Tags.INFO:
        tag = chalk.cyan(tag);
        break;
      case Tags.ERROR:
        tag = chalk.red(tag);
        break;
      case Tags.OK:
        tag = chalk.greenBright(tag);
        break;
      case Tags.WARN:
        tag = chalk.yellowBright(tag);
        break;
      default:
        tag = chalk.cyan(Tags.INFO);
        break;
    }

    if (!TypeHelper.isString(message)) {
      ConsoleHelper.printMessage(Tags.ERROR, `Message must be a string`);
      process.exit(1);
    }

    const defaultOptions = { error: null, eol: 'NONE', date: true };
    options = {
      ...defaultOptions,
      ...options
    };

    const schema = joi.object().keys({
      error: joi.string().optional().empty(null).allow(null).allow(''),
      eol: joi.string().case('upper').valid('START', 'END', 'BOTH', 'NONE'),
      date: joi.boolean()
    });

    const { error } = schema.validate(options);

    if (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error while validating console printing options`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }

    let errorMsg = '';

    if (!TypeHelper.isUndefinedOrNull(options.error)) {
      errorMsg = `Reason: ${options.error}`;
    }

    let output = '';

    if (options.eol === 'START' || options.eol === 'BOTH') {
      output = '\n';
    }

    if (options.date) {
      output += `${dayjs().format('YYYY-MM-DD HH:mm:ss')} - `;
    }

    output += `${
      chalk.grey('[ ') + tag + chalk.grey(' ]') + chalk.white(`: ${message}. ${errorMsg}`)
    }`;

    if (options.eol === 'END' || options.eol === 'BOTH') {
      output += '\n';
    }

    console.log(output);
  }
}
