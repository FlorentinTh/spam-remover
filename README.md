# spam-remover

![node](https://img.shields.io/badge/node-%3E%3D16-blue) [![License](https://img.shields.io/github/license/FlorentinTh/spam-remover)](https://github.com/FlorentinTh/spam-remover/blob/master/LICENSE) [![snyk](https://github.com/FlorentinTh/spam-remover/actions/workflows/dependencies.yml/badge.svg)](https://github.com/FlorentinTh/spam-remover/actions/workflows/dependencies.yml) [![build](https://github.com/FlorentinTh/spam-remover/actions/workflows/build.yml/badge.svg)](https://github.com/FlorentinTh/spam-remover/actions/workflows/build.yml) [![GitHub Release](https://img.shields.io/github/release/FlorentinTh/spam-remover)](https://github.com/FlorentinTh/spam-remover/releases)

Clean Gmail account from spam messages that keep stacking in your mailbox.

## Authors

- [**Florentin Thullier**](https://github.com/FlorentinTh) - 2022


## Instructions

1. Copy your ```credentials.json``` and ```token.json``` files in the root project folder inside a ```.secrets``` folder.

    > **Note:** instructions to obtain such files are provided in the [Google documentation](https://developers.google.com/workspace/guides/create-credentials).

2. Adapt the content of ```.env.example``` according to your needs and rename the file as ```.env```.


## Example

You can use this project as a cron job. The example below shows how to run automatically the cleanup forever at every hour and log the output in a dedicated file.

```sh
$ contrab -e

# add:
0 * * * * node $HOME/spam-remover/bin/spam-remover.js >> $HOME/spam-remover/logs/spam-remover.log 2>&1
```

## Logging

The application is logging spam addresses as well as detailed domain related information from the sending server to a Timescale database.

> **Note:** see the [official documentation](https://www.postgresql.org/docs/14/installation.html) to install a self-hosted Postgres instance as well as the [other official documentation](https://docs.timescale.com/install/latest/self-hosted/) to enable Timescale related capabilities.

SQL commands to make this project works:

```sql
-- create a dedicated database:
CREATE DATABASE IF NOT EXISTS spams_remover;

-- enable the use of timescale:
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- create the required table:
CREATE TABLE IF NOT EXISTS spams (
   time     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   email    TEXT NOT NULL,
   ip       TEXT NULL,
   hostname TEXT NULL,
   city     TEXT NULL,
   region   TEXT NULL,
   country  TEXT NULL,
   loc      POINT NULL,
   org      TEXT NULL
);

-- Enable the hyper table timescale capability:
SELECT create_hypertable('spams','time');

-- To import previous exported data formatted in CSV:
\copy spams (time, email, ip, hostname, city, region, country, loc, org) from './spams.csv' WITH DELIMITER ';' CSV HEADER;
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
