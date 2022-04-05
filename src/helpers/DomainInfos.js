import { exec } from 'promisify-child-process';
import { IPinfoWrapper } from 'node-ipinfo';

import { Config } from '../utils/Config.js';
import TypeHelper from './TypeHelper.js';
import { ConsoleHelper, Tags } from './ConsoleHelper.js';

const config = Config.getConfig();

class DomainInfos {
  #ipInfos = new IPinfoWrapper(config.ip_infos.token, null, 1000);

  constructor(email) {
    if (TypeHelper.isUndefinedOrNull(email) || !TypeHelper.isString(email)) {
      ConsoleHelper.printMessage(Tags.ERROR, `email parameter must be a valid string`);
      process.exit(1);
    }

    this.email = email;
  }

  async getInfos() {
    const domain = this.email.match(/@(.*)/gm, '')[0].substring(1);

    const { stdout, stderr } = await exec(`dig +short ${domain}`);

    if (stderr) {
      ConsoleHelper.printMessage(Tags.ERROR, `Error occurs while fetching domain infos`, {
        error: stderr
      });
      process.exit(1);
    }

    const ip = stdout.match(
      /^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/gm,
      ''
    );

    if (!(ip === null)) {
      let result;

      try {
        result = await this.#ipInfos.lookupIp(ip[0]);

        if (!(result.ip === '127.0.0.1')) {
          return result;
        }

        return null;
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `Error occurs while fetching domain infos`,
          {
            error: JSON.stringify(error)
          }
        );
        process.exit(1);
      }
    }

    return null;
  }
}

export default DomainInfos;
