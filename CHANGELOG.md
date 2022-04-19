# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/FlorentinTh/spam-remover/compare/v1.2.0...v2.0.0) (2022-04-19)


### ⚠ BREAKING CHANGES

* **env:** TZ environment variable is now required
* **log-spam-addresses:** column is_email_valid was added to the database schema

### Features

* **env:** change hardcoded timestamp in MailHelper class to an environment variable ([b9454ba](https://github.com/FlorentinTh/spam-remover/commit/b9454bace5f72f6305815d5c2559a0c5577b55cc))


### Bug Fixes

* **log-spam-addresses:** fix the issue when a spam email addresses were invalid ([d73e7f0](https://github.com/FlorentinTh/spam-remover/commit/d73e7f0692c80154fb9f9bbd1d1b9c638ed5b8a0))


### Chore

* **data:** update data file according to changes made to the database schema ([4d61042](https://github.com/FlorentinTh/spam-remover/commit/4d61042025b4ab05b6308dd26efddcb98addc423))


### CI

* **build:** remove ci-build on windows instances and remove no longer required env variables ([1c26313](https://github.com/FlorentinTh/spam-remover/commit/1c26313c635a5c77d4bbe2fdbbf292305dacdd8c))


### Documentation

* **.env:** update .env.example according to changes made as regards adding a TZ variable ([cfffeb8](https://github.com/FlorentinTh/spam-remover/commit/cfffeb8ff7dcfe23a253a45a6660d65963e37cbc))
* **readme:** update readme according to previous commit ([0ac66bd](https://github.com/FlorentinTh/spam-remover/commit/0ac66bd7c1e674ff00990ef5f8869b8b27575ef1))
* **readme:** update readme to add a platform badge ([42478d7](https://github.com/FlorentinTh/spam-remover/commit/42478d7539ab0b5d7b8665635dbd8c02c3ca0c8c))
* **visualization:** update documentation to add a vizualization section as well as required files ([161a131](https://github.com/FlorentinTh/spam-remover/commit/161a13126fb880fda47e6ec1ef591db259f51afd))

## [1.2.0](https://github.com/FlorentinTh/spam-remover/compare/v1.1.1...v1.2.0) (2022-04-15)


### Features

* **summary:** add url to grafana dashboard in summary email content ([b4f6269](https://github.com/FlorentinTh/spam-remover/commit/b4f626930d6a19afb0b439cce36e2d1371a7cabd))


### Styling

* **spam-remover:** add a missing line break ([d5474b5](https://github.com/FlorentinTh/spam-remover/commit/d5474b573403823d2085a99ccfcb7cb1752eded7))


### Refactors

* **spam-remover:** change model definition to better handle location lat and long in DB ([dde2bf4](https://github.com/FlorentinTh/spam-remover/commit/dde2bf40101ccea9deabd25a5420bee721b60a67))
* **utils:** move Mailer and OAuth2 classes to utils folder ([0b02901](https://github.com/FlorentinTh/spam-remover/commit/0b029011ac50358a08781fcdc61651f661234d84))


### Documentation

* **.env.example:** update .env.example to match new configuration ([5e03c91](https://github.com/FlorentinTh/spam-remover/commit/5e03c914d56f73f5a506258d23c3e3c334408485))
* **readme:** fix a typo in readme file ([73c300e](https://github.com/FlorentinTh/spam-remover/commit/73c300edbd99829a133e12b005ca0fc10f379076))
* **readme:** update documentation in readme ([617ddbc](https://github.com/FlorentinTh/spam-remover/commit/617ddbcc2b1351692d9e9f5424ce11107e0cc41e))
* **readme:** update readme to reflect changes in data definition ([8a1be03](https://github.com/FlorentinTh/spam-remover/commit/8a1be03e3845d4d59cbb11b97a08fd6e5a1b28dc))


### Chore

* **data:** add a seed of data ([e0342b6](https://github.com/FlorentinTh/spam-remover/commit/e0342b6ecb44f82900854be291b8bcb92287699f))
* **data:** update sample of data to reflect previous changes in the model definition ([4ccce1c](https://github.com/FlorentinTh/spam-remover/commit/4ccce1cd4b1dfb3a7e9ebc054500ee927384af1b))
* **eslint:** remove no more usefull packages related to eslint config ([630af3a](https://github.com/FlorentinTh/spam-remover/commit/630af3af1cb6eb2b86cee4d8f4fb94a699fcce07))

### [1.1.1](https://github.com/FlorentinTh/spam-remover/compare/v1.1.0...v1.1.1) (2022-04-05)


### Bug Fixes

* **config:** fix improper call of config in Database and DomainInfos ([8388344](https://github.com/FlorentinTh/spam-remover/commit/83883441cdf98d5e73b37f7ed857687721d0e085))


### Refactors

* **domain-infos:** move domain-infos from helpers to utils ([ef4fc81](https://github.com/FlorentinTh/spam-remover/commit/ef4fc81e3f67d69b91a4154deb1db4a10c4e5ca5))
* **spam-remover:** fix DomainInfos import ([bd83cfa](https://github.com/FlorentinTh/spam-remover/commit/bd83cfab3d79fe94f2b7430cd79d0f5e8be63233))

## [1.1.0](https://github.com/FlorentinTh/spam-remover/compare/v1.0.3...v1.1.0) (2022-04-05)


### Features

* **database:** add database logging support and remove file logging ([16498e1](https://github.com/FlorentinTh/spam-remover/commit/16498e1f67dd38e77d2d5eb01573641d0a9d5a33))


### Refactors

* **data:** remove no longer required data example folder ([974a6d6](https://github.com/FlorentinTh/spam-remover/commit/974a6d6134186a7269939708a5e5dbe0c32490b8))
* **imports:** update imports order ([479c8ca](https://github.com/FlorentinTh/spam-remover/commit/479c8ca620767b5969fa0863264e084ebe58e8ea))


### Documentation

* **readme:** update documentation in readme file ([2ba0bbe](https://github.com/FlorentinTh/spam-remover/commit/2ba0bbe3e0ecdab8190832e7dfe8f64906964c79))


### Chore

* **deps:** add new dependencies and update existing ones ([020e5b4](https://github.com/FlorentinTh/spam-remover/commit/020e5b44d2e190c74f0f6e1183eb846dff93b64a))

### [1.0.3](https://github.com/FlorentinTh/spam-remover/compare/v1.0.2...v1.0.3) (2022-03-31)


### Bug Fixes

* **oauth2:** fix parsing error messages ([b30e890](https://github.com/FlorentinTh/spam-remover/commit/b30e890303c5656f04d22cf33b44b541d5c29009))
* **spam-remover:** add missing condition for test command to prevent deleting spams ([e55253e](https://github.com/FlorentinTh/spam-remover/commit/e55253e99fcc418eed9f4c2a6aaeaece1ec51896))
* **spam-remover:** fix issue in logSpamAddresses func while parsing email addresses ([6348caa](https://github.com/FlorentinTh/spam-remover/commit/6348caaab0c7e766c778f166f42d8bffcc0388b4))


### Chore

* **deps:** update dependencies ([027196e](https://github.com/FlorentinTh/spam-remover/commit/027196ef9f029dd1541c02dc33a182d3f22c7392))

### [1.0.2](https://github.com/FlorentinTh/spam-remover/compare/v1.0.1...v1.0.2) (2022-03-16)


### Bug Fixes

* **spam-remover:** fix an object access error ([e6a5ade](https://github.com/FlorentinTh/spam-remover/commit/e6a5adee9e715403251101aa84e5f31a81adaaf1))


### Chore

* **deps:** update dependencies ([c1e2a62](https://github.com/FlorentinTh/spam-remover/commit/c1e2a62824168ab8c040839cc57f2a25bfa32f25))


### CI

* **github-ci:** add both dependabot and snyk configuration files ([ed16709](https://github.com/FlorentinTh/spam-remover/commit/ed16709cec1bb5df14525f1f52c8c2bf4479c283))
* **github-ci:** add specific configuration for ci to be functionnal ([7719e36](https://github.com/FlorentinTh/spam-remover/commit/7719e36f76f7a1d6077699668afbd417276ac76e))
* **github-ci:** tests to check if ci uses secret tokens correctly ([5a6b9f9](https://github.com/FlorentinTh/spam-remover/commit/5a6b9f95e9ae1e5d8d272caee468ae13c9eac7db))
* **github-ci:** yet another ci test ([75d295e](https://github.com/FlorentinTh/spam-remover/commit/75d295ea28e4c6d0d4c30d5b4abbc558ccbdabbb))
* **github-ci:** yet another ci test ([be44fbf](https://github.com/FlorentinTh/spam-remover/commit/be44fbf9c9d2e045f48414ea91d42e23016fdcdf))
* **github-ci:** yet another ci test ([c6d6d44](https://github.com/FlorentinTh/spam-remover/commit/c6d6d44e8b9dc1687c41e21f8a6fcfc51061c2e1))
* **github-ci:** yet another ci test ([aa9458e](https://github.com/FlorentinTh/spam-remover/commit/aa9458eec2eea5b5a9231feacc126587803af080))

### 1.0.1 (2022-03-16)


### Chore

* **project:** complete first version ([94ec5bb](https://github.com/FlorentinTh/spam-remover/commit/94ec5bb94e100aad6bdbc3a756b5cecbc500d4ac))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.