# NUWM Backend
**NUWM Backend** is server side for [React Native Application](https://github.com/dooptha/nuwm-frontend), which displays lectures timetable for students of
the [NATIONAL UNIVERSITY OF WATER AND ENVIRONMENTAL ENGINEERING](http://en.nuwm.edu.ua/).

## Dependencies
 * Node.js _(v11.14.0)_ and NPM _(v6.7.0)_
 * MongoDB _(v4.0.10-release)_

## Build
**First option is to build the project from source files**
- Clone repository `git clone https://github.com/dooptha/nuwm-backend.git`
- Install [MongoDB](https://www.mongodb.com/download-center/community)
- Install Node.js and NPM, we recommend to use [NVM](https://github.com/nvm-sh/nvm)
- Install npm packages and start sever on `:3000` port

```shell
$ npm i && npm start
```
**Another option is to use [Docker Compose](https://docs.docker.com/compose/)**
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Run multi-container from root directory
```shell
$ docker-compose up
```