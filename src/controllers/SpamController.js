import pg from 'pg';

import { ConsoleHelper, Tags } from '../helpers/ConsoleHelper.js';
import TypeHelper from '../helpers/TypeHelper.js';
import Spam from '../models/Spam.js';

const TABLE = 'spams';

class SpamController {
  #client;

  constructor(client) {
    if (!(client instanceof pg.Client)) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `client parameter must be an instance of pg.Client`
      );
      process.exit(1);
    }
    this.#client = client;
  }

  async createSpam(spam) {
    if (!TypeHelper.isObject(spam) && !(spam instanceof Spam)) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `spam parameter must be an instance of Spam`
      );
      process.exit(1);
    }

    const query = `INSERT INTO ${TABLE}(time, email, ip, hostname, city, region, country, location_latitude, location_longitude, organization)
                   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
    const values = [
      spam.time,
      spam.email,
      spam.ip,
      spam.hostname,
      spam.city,
      spam.region,
      spam.country,
      spam.locationLatitude,
      spam.locationLongitude,
      spam.organization
    ];

    try {
      await this.#client.query(query, values);
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to create a new spam entry in the database`,
        {
          error: JSON.stringify(error)
        }
      );
      process.exit(1);
    }
  }

  async getWeeklyCount() {
    const query = `SELECT COUNT(*)
                   FROM ${TABLE}
                   WHERE time >= NOW() - INTERVAL '1 week';`;

    let res;
    try {
      res = await this.#client.query(query);
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to get weekly count from the database`,
        {
          error: JSON.stringify(error)
        }
      );
      process.exit(1);
    }

    return Number(res.rows[0].count);
  }
}

export default SpamController;
