## [1.10.1](https://github.com/relatiocc/opencloud/compare/v1.10.0...v1.10.1) (2025-11-17)


### Bug Fixes

* **universes:** make GameJoinRestriction duration optional ([5fc1c32](https://github.com/relatiocc/opencloud/commit/5fc1c32ff48a2c17799a359c7bfe73fd3337f8d1)), closes [#7](https://github.com/relatiocc/opencloud/issues/7)

# [1.10.0](https://github.com/relatiocc/opencloud/compare/v1.9.0...v1.10.0) (2025-11-13)


### Bug Fixes

* **universes:** replace append with set for URLSearchParams ([0235d34](https://github.com/relatiocc/opencloud/commit/0235d34049c151b1da0d8db56b5a5274f95f5423))
* **universes:** update translation to use LanguageCode and adjust test cases ([b04246d](https://github.com/relatiocc/opencloud/commit/b04246dcaaf5ab29d87a72159e4cc8d70357f471))
* **universes:** update translations to use Partial<Record> and correct language codes ([009a25b](https://github.com/relatiocc/opencloud/commit/009a25b793774504f50f25b4299351e8e6e62808))


### Features

* add Universes API client ([4ba5fd2](https://github.com/relatiocc/opencloud/commit/4ba5fd296a55e1225dbdb6fec28b2abff7541f7a))
* implement idempotency key generation ([46456c4](https://github.com/relatiocc/opencloud/commit/46456c41044c9160f0c5fd0b21ac6863c6d3c717))
* **universes:** add restart universe servers endpoint ([ceeb0e1](https://github.com/relatiocc/opencloud/commit/ceeb0e12a66d479ccb390b772f12274d505ee805))
* **universes:** add speech asset generation, publishing, and translation methods ([bf5d646](https://github.com/relatiocc/opencloud/commit/bf5d6463256e3644cc6f1727e07be876c8214857))
* **universes:** export Universes resource from index ([d944f85](https://github.com/relatiocc/opencloud/commit/d944f85b668937bcf18cea9836766a68aaffe05f))
* **universes:** port UserRestriction endpoints from [#3](https://github.com/relatiocc/opencloud/issues/3) ([6a583b5](https://github.com/relatiocc/opencloud/commit/6a583b531a0e41df7e32bc555ad2e335248431c1))

# [1.9.0](https://github.com/relatiocc/opencloud/compare/v1.8.0...v1.9.0) (2025-10-31)


### Features

* add per-request authentication support with OAuth2 and API key ([b703c63](https://github.com/relatiocc/opencloud/commit/b703c6328ab2a880a012e9a088506e097a34d37d))

# [1.8.0](https://github.com/relatiocc/opencloud/compare/v1.7.0...v1.8.0) (2025-10-23)


### Features

* implement buildFieldMask utility ([aba0a8e](https://github.com/relatiocc/opencloud/commit/aba0a8e7d0dc1013cc79b33b76044bcd83bf1734))

# [1.7.0](https://github.com/relatiocc/opencloud/compare/v1.6.2...v1.7.0) (2025-10-22)


### Features

* add createNotification method to Users API client ([f16b17a](https://github.com/relatiocc/opencloud/commit/f16b17a2579d5c8be93937e6a34a12bc68f5d200))
* add group join request acceptance and decline methods, group shout retrieval, and role management to Groups API client ([3b1eae3](https://github.com/relatiocc/opencloud/commit/3b1eae302bfbef5de85ff74e6f34e08790ed2d1a))

## [1.6.2](https://github.com/relatiocc/opencloud/compare/v1.6.1...v1.6.2) (2025-10-22)


### Bug Fixes

* republish package ([e97d903](https://github.com/relatiocc/opencloud/commit/e97d90376deb8d4355708569badfedcbf26ccda3))

## [1.6.1](https://github.com/relatiocc/opencloud/compare/v1.6.0...v1.6.1) (2025-10-22)


### Bug Fixes

* update user retrieval method in README example ([751f635](https://github.com/relatiocc/opencloud/commit/751f6351b4221754b2610bc56f8b5023363329f6))

# [1.6.0](https://github.com/relatiocc/opencloud/compare/v1.5.0...v1.6.0) (2025-10-22)


### Features

* **users:** add generateThumbnail method ([ff93a0c](https://github.com/relatiocc/opencloud/commit/ff93a0c2cdc7888ceb94763cfc88a688a6362511))

# [1.5.0](https://github.com/relatiocc/opencloud/compare/v1.4.0...v1.5.0) (2025-10-22)


### Features

* **errors:** make error classes include additional details from API responses ([231e828](https://github.com/relatiocc/opencloud/commit/231e8286c20d3427ca7c73998dc8ff6c9707b26d))

# [1.4.0](https://github.com/relatiocc/opencloud/compare/v1.3.0...v1.4.0) (2025-10-22)


### Features

* **package:** remove .npmignore and update package.json to include files for distribution ([878f700](https://github.com/relatiocc/opencloud/commit/878f70047c845506c86a0b45ea59df1d80cc7f52))

# [1.3.0](https://github.com/relatiocc/opencloud/compare/v1.2.1...v1.3.0) (2025-10-22)


### Features

* **build:** update build script to use tsup and add tsup configuration ([166550c](https://github.com/relatiocc/opencloud/commit/166550c37ccb2ba0ffff8413a1fbeeaa1e63b130))

## [1.2.1](https://github.com/relatiocc/opencloud/compare/v1.2.0...v1.2.1) (2025-10-21)


### Bug Fixes

* **package:** correct exports configuration in package.json ([3538a8f](https://github.com/relatiocc/opencloud/commit/3538a8fb3cb288ea7b877bf98c7737e4dbc4471f))

# [1.2.0](https://github.com/relatiocc/opencloud/compare/v1.1.0...v1.2.0) (2025-10-21)


### Features

* **groups:** add filter option to listGroupMemberships method ([23ed344](https://github.com/relatiocc/opencloud/commit/23ed344c684feb0f0b4544fa78099c3a34e97f5b))

# [1.1.0](https://github.com/relatiocc/opencloud/compare/v1.0.2...v1.1.0) (2025-10-21)


### Features

* **groups:** add opencloud group support ([32f46c8](https://github.com/relatiocc/opencloud/commit/32f46c80b5889282d257e2512e379b1fdcb4e737))

## [1.0.2](https://github.com/relatiocc/opencloud/compare/v1.0.1...v1.0.2) (2025-10-21)


### Bug Fixes

* update .prettierignore and CHANGELOG formatting ([200a09f](https://github.com/relatiocc/opencloud/commit/200a09f4878f0344eaec0436a236fab2df0f6ff2))
* update user retrieval method in README example ([bcef09a](https://github.com/relatiocc/opencloud/commit/bcef09a5973dbe5c97707dec52e8a177b2c1d69f))

## [1.0.1](https://github.com/relatiocc/opencloud/compare/v1.0.0...v1.0.1) (2025-10-21)

### Bug Fixes

* republish package ([d0576a1](https://github.com/relatiocc/opencloud/commit/d0576a1e1fd96fb5d032aa5449e3430432ef3a75))

# 1.0.0 (2025-10-21)

### Features

* **core:** implement OpenCloud TypeScript SDK core, HTTP client, and users resource ([45e4d1a](https://github.com/relatiocc/opencloud/commit/45e4d1a95de89f9e50ef236fbf153d1a77a83885))

# Changelog

All notable changes to this project will be documented in this file.

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and changelog generation.
