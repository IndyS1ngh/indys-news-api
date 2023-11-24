# Indy's News API
## Link to Hosted Version
https://indys-news-api.onrender.com

## Project Summary
Backend project which builds an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Instructions
To clone this repo, run command: `git clone https://github.com/IndyS1ngh/indys-news-api.git` in your terminal.\
Make sure to run `npm install` afterwards to install dependencies!\
Then you will need to seed the local database. This can be done by running the commands `npm run setup-dbs` followed by `npm run seed`.\
To run any tests, you will need to run `npm test <insert-test.js-file-here>`.

## Requirements
To run this project locally, you will need to add two files: `.env.test` & `.env.development`.\
Each of these files needs their respective environment variables in order to connect to the databases.\
These are: `PGDATABASE=nc_news_test` for `.env.test` and `PGDATABASE=nc_news` for `.env.development`.

Minimum versions required to run project:\
`Node.js` - V21.0.0\
`PostgreSQL` - V12.16
