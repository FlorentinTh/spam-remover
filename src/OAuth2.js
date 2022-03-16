import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

import ProgramHelper from './helpers/ProgramHelper.js';
import { Tags, ConsoleHelper } from './helpers/ConsoleHelper.js';

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

    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const OAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    let token;

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

    OAuth2Client.setCredentials(token);
    return OAuth2Client;
  }
}
