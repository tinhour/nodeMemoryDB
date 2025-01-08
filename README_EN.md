# nodeMemoryDB

[简体中文](./README.md) | English

A simple in-memory database service built with Node.js.

## Features

- Lightweight in-memory database
- RESTful API interface
- Easy to use
- Basic CRUD operations support

## Installation

```bash
npm install nodeMemoryDB
```

## Usage

Start the server:

```bash
npm run start
```

The server will start on port 81 and run as a memory database service.

## API Endpoints

### Data Operations

- GET `/api/get/:key` - Get data
- POST `/api/set` - Set data
- DELETE `/api/delete/:key` - Delete data
- GET `/api/keys` - Get all keys

## License

MIT 