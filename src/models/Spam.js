import joi from 'joi';

import { ConsoleHelper, Tags } from '../helpers/ConsoleHelper.js';

class Spam {
  #time;
  #email;
  #ip;
  #hostname;
  #city;
  #region;
  #country;
  #loc;
  #org;

  get time() {
    return this.#time;
  }

  get email() {
    return this.#email;
  }

  get ip() {
    return this.#ip;
  }

  get hostname() {
    return this.#hostname;
  }

  get city() {
    return this.#city;
  }

  get region() {
    return this.#region;
  }

  get country() {
    return this.#country;
  }

  get loc() {
    return this.#loc === null ? null : `(${this.#loc})`;
  }

  get org() {
    return this.#org;
  }

  constructor(time, email, ip, hostname, city, region, country, loc, org) {
    this.#validate({
      time,
      email,
      ip,
      hostname,
      city,
      region,
      country,
      loc,
      org
    });

    this.#time = time;
    this.#email = email;
    this.#ip = ip;
    this.#hostname = hostname;
    this.#city = city;
    this.#region = region;
    this.#country = country;
    this.#loc = loc;
    this.#org = org;
  }

  #validate(spam) {
    const schema = joi.object().keys({
      time: joi.string().trim().required(),
      email: joi.string().trim().required(),
      ip: joi.string().trim().required().allow(null),
      hostname: joi.string().trim().required().allow(null),
      city: joi.string().trim().required().allow(null),
      region: joi.string().trim().required().allow(null),
      country: joi.string().trim().required().allow(null),
      loc: joi.string().trim().required().allow(null),
      org: joi.string().trim().required().allow(null)
    });

    const { error } = schema.validate(spam);

    if (error) {
      ConsoleHelper.printMessage(Tags.ERROR, `Error while validating spam object`, {
        error: JSON.stringify(error)
      });
      process.exit(1);
    }
  }
}

export default Spam;
