import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';
import joi from 'joi';

import { Config } from './utils/Config.js';
import Mailer from './Mailer.js';
import ProgramHelper from './helpers/ProgramHelper.js';
import DateHelper from './helpers/DateHelper.js';
import { Tags, ConsoleHelper, EOL } from './helpers/ConsoleHelper.js';

class Summary {
  async sendSummary() {
    const config = Config.getConfig();
    const todayDay = dayjs().day();

    if (DateHelper.getDayNumber(config.summary.DAY) === todayDay) {
      const currentHour = dayjs().hour();

      if (config.summary.HOUR === currentHour) {
        const { total } = await (await this.#getSummaryData()).data;

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

        await this.updateSummaryData({ reset: true });
      }
    }
  }

  async #getSummaryData() {
    const filePath = path.join(ProgramHelper.getRootPath(), 'data', 'summary.json');

    let dataFile;

    try {
      dataFile = await fs.promises.readFile(filePath, {
        encoding: 'utf-8',
        flag: 'r'
      });
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to get summary data`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }

    return {
      filePath,
      data: JSON.parse(dataFile)
    };
  }

  async updateSummaryData(options = { data: 0, reset: false }) {
    const defaultOptions = { data: 0, reset: false };
    options = {
      ...defaultOptions,
      ...options
    };

    const schema = joi.object().keys({
      data: joi.number().integer().required(),
      reset: joi.boolean().required()
    });

    const { validationError } = schema.validate(options);

    if (validationError) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to update summary data`,
        {
          error: validationError.message
        }
      );
      process.exit(1);
    }

    const summaryData = await this.#getSummaryData();

    if (options.reset) {
      summaryData.data.total = 0;
    } else {
      summaryData.data.total += options.data;
    }

    try {
      await fs.promises.writeFile(
        summaryData.filePath,
        JSON.stringify(summaryData.data),
        {
          encoding: 'utf-8',
          flag: 'w'
        }
      );
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to update summary data`,
        {
          error: error.message
        }
      );
      process.exit(1);
    }
  }
}

export default Summary;
