import fs from 'fs';
import SSH2Promise from 'ssh2-promise';
import pg from 'pg';

import { Config } from '../utils/Config.js';
import { ConsoleHelper, Tags } from '../helpers/ConsoleHelper.js';

class Database {
  #client;

  get client() {
    return this.#client;
  }

  async connect(options = { sshTunnel: true }) {
    const config = Config.getConfig();

    const defaultOptions = { sshTunnel: true };
    options = {
      ...defaultOptions,
      ...options
    };

    const params = {
      username: config.db.username,
      password: config.db.password,
      hostname: config.db.hostname,
      port: config.db.port,
      dbName: config.db.name
    };

    if (options.sshTunnel) {
      const ssh = new SSH2Promise({
        host: config.ssh.host,
        username: config.ssh.username,
        privateKey: await fs.promises.readFile(config.ssh.private_key_path),
        passphrase: config.ssh.passphrase,
        port: config.ssh.port
      });

      const tunnelPort = 33000 + Math.floor(Math.random() * 1000);

      ssh.addTunnel({
        remoteAddr: config.db.hostname,
        remotePort: config.db.port,
        localPort: tunnelPort
      });

      try {
        await ssh.connect();
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `Error occurs while trying to connect database`,
          {
            error
          }
        );
        process.exit(1);
      }

      params.port = tunnelPort;
    }

    this.#client = new pg.Client({
      connectionString: `postgres://${params.username}:${params.password}@${params.hostname}:${params.port}/${params.dbName}`
    });

    try {
      await this.#client.connect();
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to connect database`,
        {
          error
        }
      );
      process.exit(1);
    }

    return this.#client;
  }

  async close() {
    try {
      await this.#client.end();
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to close database connection`,
        {
          error
        }
      );
      process.exit(1);
    }
  }
}

export default Database;
