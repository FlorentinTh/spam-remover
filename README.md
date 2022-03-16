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

The application is logging spam addresses each time a cleanup is made by default. You can access it as follows:

```sh
$ cat $HOME/spam-remover/logs/spams.log
```

Logs are formatted in JSON such as:

```json
{
  "datetime":"2022-03-14 18:00:09",
  "addresses":[
    "john@doe.com",
    "jane@doe.com"
  ]
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
