import fs from 'fs';
import nodemailer from 'nodemailer';
import joi from 'joi';

import { OAuth2Files } from './OAuth2.js';
import { Config } from './utils/Config.js';
import TypeHelper from './helpers/TypeHelper.js';
import { Tags, ConsoleHelper } from './helpers/ConsoleHelper.js';

class Mailer {
  #transport;

  constructor() {
    const config = Config.getConfig();

    let credentials;

    if (process.env.NODE_ENV === 'test') {
      if (!TypeHelper.isUndefinedOrNull(process.env.CREDENTIALS)) {
        credentials = JSON.parse(process.env.CREDENTIALS);
      } else {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `CREDENTIALS environment variable is not set properly`
        );
        process.exit(1);
      }
    } else {
      try {
        credentials = JSON.parse(fs.readFileSync(OAuth2Files.credentialsFilePath));
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `error occurs while trying to access: ${OAuth2Files.credentialsFilePath}`,
          { error, eol: false, date: true }
        );
        process.exit(1);
      }
    }

    const { client_id, client_secret } = credentials.installed;

    let token;

    if (process.env.NODE_ENV === 'test') {
      if (!TypeHelper.isUndefinedOrNull(process.env.TOKEN)) {
        token = JSON.parse(process.env.TOKEN);
      } else {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `TOKEN environment variable is not set properly`
        );
        process.exit(1);
      }
    } else {
      try {
        token = JSON.parse(fs.readFileSync(OAuth2Files.tokenFilePath));
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `error occurs while trying to access: ${OAuth2Files.tokenFilePath}`,
          { error, eol: false, date: true }
        );
        process.exit(1);
      }
    }

    const { refresh_token, access_token, expiry_date } = token;

    this.#transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: config.account,
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: refresh_token,
        accessToken: access_token,
        expires: expiry_date
      }
    });
  }

  async sendMail(params = { from: null, to: null, subject: null, html: null }) {
    const defaultOptions = { from: null, to: null, subject: null, html: null };
    params = {
      ...defaultOptions,
      ...params
    };

    const schema = joi.object().keys({
      from: joi
        .string()
        .trim()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      to: joi
        .string()
        .trim()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      subject: joi.string().trim(),
      html: joi.string().trim().required()
    });

    const { validationError } = schema.validate(params);

    if (validationError) {
      ConsoleHelper.printMessage(Tags.ERROR, `Error occurs while trying to send email`, {
        error: validationError.message
      });
      process.exit(1);
    }

    const mailOptions = {
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html
    };

    try {
      await this.#transport.sendMail(mailOptions);
    } catch (error) {
      ConsoleHelper.printMessage(Tags.ERROR, `Error occurs while trying to send email`, {
        error: error.message
      });
      process.exit(1);
    }

    this.#transport.close();
  }
}

export default Mailer;
