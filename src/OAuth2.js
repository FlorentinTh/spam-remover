import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

import ProgramHelper from './helpers/ProgramHelper.js';
import { Tags, ConsoleHelper } from './helpers/ConsoleHelper.js';
import TypeHelper from './helpers/TypeHelper.js';

export class OAuth2Files {
  static #credentialsFilePath = path.join(
    ProgramHelper.getRootPath(),
    '.secrets',
    'credentials.json'
  );

  static #tokenFilePath = path.join(
    ProgramHelper.getRootPath(),
    '.secrets',
    'token.json'
  );

  static get credentialsFilePath() {
    return this.#credentialsFilePath;
  }

  static get tokenFilePath() {
    return this.#tokenFilePath;
  }
}

export class OAuth2 {
  async authenticate() {
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
        credentials = JSON.parse(
          await fs.promises.readFile(OAuth2Files.credentialsFilePath)
        );
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `error occurs while trying to access: ${OAuth2Files.credentialsFilePath}`,
          { error, eol: false, date: true }
        );
        process.exit(1);
      }
    }

    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const OAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

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
        token = JSON.parse(await fs.promises.readFile(OAuth2Files.tokenFilePath));
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `error occurs while trying to access: ${OAuth2Files.tokenFilePath}`,
          { error, eol: false, date: true }
        );
        process.exit(1);
      }
    }

    OAuth2Client.setCredentials(token);
    return OAuth2Client;
  }
}
