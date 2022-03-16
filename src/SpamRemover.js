import path from 'path';
import fs from 'fs';
import { google } from 'googleapis';
import joi from 'joi';
import dayjs from 'dayjs';

import { OAuth2 } from './OAuth2.js';
import Summary from './Summary.js';
import ProgramHelper from './helpers/ProgramHelper.js';
import { Tags, ConsoleHelper, EOL } from './helpers/ConsoleHelper.js';

class SpamRemover {
  #userId = 'me';
  #gmail;
  #summary = new Summary();

  async authenticate() {
    const OAuth2Client = new OAuth2();

    try {
      const auth = await OAuth2Client.authenticate();
      this.#gmail = google.gmail({ version: 'v1', auth });
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error while application tries to authenticate`,
        {
          error: error.message
        }
      );

      process.exit(1);
    }
  }

  async #getEmails(params = { label: null, q: null }) {
    const defaultOptions = { label: null, q: null };
    params = {
      ...defaultOptions,
      ...params
    };

    const schema = joi.object().keys({
      label: joi.string().trim().required(),
      q: joi.string().trim().required()
    });

    const { error } = schema.validate(params);

    if (error) {
      ConsoleHelper.printMessage(Tags.ERROR, `Error occurs while fetching emails`, {
        error: error.message
      });
      process.exit(1);
    }

    let emails;

    try {
      emails = await this.#gmail.users.messages.list({
        userId: this.#userId,
        q: params.q,
        maxResults: 500
      });
    } catch (error) {
      ConsoleHelper.printMessage(Tags.ERROR, `Error with authentication token`, {
        error: error.response.data.error
      });

      process.exit(1);
    }

    let ids = [];

    if (emails) {
      if (!emails.data.messages) {
        ConsoleHelper.printMessage(Tags.OK, `No spam email to be deleted`);
      } else {
        ids = emails.data.messages.map(item => item.id);
      }
    }

    return ids;
  }

  async #logSpamAddresses(ids, params = { label: null }) {
    const defaultOptions = { label: null };
    params = {
      ...defaultOptions,
      ...params
    };

    const schema = joi.object().keys({
      label: joi.string().trim().required()
    });

    const { error } = schema.validate(params);

    if (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to validate logSpamAddresses parameters`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }

    const addresses = [];

    for (const id of ids) {
      const email = await this.#gmail.users.messages.get({ userId: this.#userId, id });
      const from = email.data.payload.headers.filter(header => header.name === 'From')[0]
        .value;
      const address = from.match(/<([^<]*)>/gm)[0].replace(/[<{1}>{1}]/gm, '');
      addresses.push(address);
    }

    const data = {
      datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      addresses
    };

    const logFilePath = path.join(ProgramHelper.getRootPath(), 'logs', 'spams.log');
    const baseDir = path.parse(logFilePath).dir;

    try {
      await fs.promises.mkdir(baseDir, { recursive: true });
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to write spam addresses log`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }

    try {
      await fs.promises.writeFile(logFilePath, JSON.stringify(data) + '\n', {
        flag: 'a',
        encoding: 'utf-8'
      });
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to write spam addresses log`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }
  }

  async #deleteEmails(ids, params = { label: null }) {
    const defaultOptions = { label: null };
    params = {
      ...defaultOptions,
      ...params
    };

    const schema = joi.object().keys({
      label: joi.string().trim().required()
    });

    const { error } = schema.validate(params);

    if (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to delete emails`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }

    let batchDelete;

    try {
      batchDelete = await this.#gmail.users.messages.batchDelete({
        userId: this.#userId,
        requestBody: { ids }
      });
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to delete ${params.label.toLowerCase()} emails`,
        { error }
      );
      process.exit(1);
    }

    if (batchDelete.status === 204) {
      await this.#summary.updateSummaryData({ data: ids.length });

      let msg = `${ids.length} ${params.label.toLowerCase()} email`;

      if (ids.length > 1) {
        msg += 's';
      }

      ConsoleHelper.printMessage(Tags.OK, `${msg} successfully deleted`, {
        eol: EOL.NONE
      });
    }
  }

  async run() {
    const spams = await this.#getEmails({ label: 'spam', q: 'in:spam' });

    if (!(process.env.NODE_ENV === 'test')) {
      if (spams.length > 0) {
        await this.#logSpamAddresses(spams, { label: 'spam' });
        await this.#deleteEmails(spams, { label: 'spam' });
      }
      await this.#summary.sendSummary();
    }

    process.exit(0);
  }
}

export default SpamRemover;
