# SportApp — Server

REST API backend for the SportApp fitness tracking application.
Built as a B.Eng. thesis project.

## Architecture

Layered structure: Routes → Controllers → Services → Database

- **config/** — environment-based configuration
- **controllers/** — request handling logic
- **middleware/** — authentication, validation
- **routes/** — API endpoint definitions
- **services/** — business logic layer
- **utils/** — shared helpers

## Tech Stack

Node.js · Express · PostgreSQL · JWT · REST API

## Run locally

Copy `.env.example` to `.env` and fill in your values, then:

npm install
node server.js