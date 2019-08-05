# NUWM Backend
**NUWM Backend** is server side for [React Native Application](https://github.com/dooptha/nuwm-frontend), which displays lectures timetable for students of
the [NATIONAL UNIVERSITY OF WATER AND ENVIRONMENTAL ENGINEERING](http://en.nuwm.edu.ua/).

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

## Dependencies
 * Node.js _(v11.14.0)_ and NPM _(v6.7.0)_
 * MongoDB _(v4.0.10-release)_

## Documentation
Available API routes is *[here](https://documenter.getpostman.com/view/2781524/SVYkvLWY?version=latest).*

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
- Start containers and access `:3000` port for backend and `:27017` for MongoDB
```shell
$ docker-compose up
```
- **IMPORTANT :** Use `docker-compose build` to update your images after `git pull`
- **IMPORTANT :** Make sure you are using the right link for MongoDB it should be `mongodb://mongo:27017` 
[(see config)]()