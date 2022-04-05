import dayjs from 'dayjs';

import { Config } from './utils/Config.js';
import DateHelper from './helpers/DateHelper.js';
import Database from './utils/Database.js';
import SpamController from './controllers/SpamController.js';
import Mailer from './Mailer.js';
import { ConsoleHelper, EOL, Tags } from './helpers/ConsoleHelper.js';

class Summary {
  async sendSummary() {
    const config = Config.getConfig();
    const todayDay = dayjs().day();

    if (DateHelper.getDayNumber(config.summary.DAY) === todayDay) {
      const currentHour = dayjs().hour();

      if (config.summary.HOUR === currentHour) {
        const database = new Database();
        const client = await database.connect({ sshTunnel: true });

        const spamController = new SpamController(client);
        const total = await spamController.getWeeklyCount();

        await database.close();

        const plural = total > 1 ? 's' : '';

        const mailer = new Mailer();
        await mailer.sendMail({
          from: config.email.FROM,
          to: config.email.TO,
          subject: `Weekly Summary Report`,
          html: `<div style="font-size: 16px;font-family: 'Arial';">
                  <p>This week, <strong>${total} spam email${plural}</strong> have been successfully deleted.</p>
                  <p>Complete and detailed logs are available if you need more insight on spam addresses that have been removed.</p>
              </div>`
        });

        ConsoleHelper.printMessage(Tags.OK, `Weekly summary report successfully sent`, {
          eol: EOL.NONE
        });
      }
    }
  }
}

export default Summary;
