# nodeMemoryDB

[简体中文](./README.md) | English

A simple in-memory database service built with Node.js.

## Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0

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

#### Get Data
- GET `/get`
  - Parameters:
    - `key`: (Optional) Key name. Returns all data if not provided
    - `meta`: (Optional) Set to 1 to return metadata

Request examples:
```bash
# Get data for specific key
curl http://localhost:81/get?key=abc

# Get data with metadata
curl http://localhost:81/get?key=abc&meta=1

# Get all data
curl http://localhost:81/get
```

Response example:
```json
{
  "message": "get abc success",
  "data": "123"
}
```

#### Set Data
- GET/POST `/set`
  - Parameters:
    - `key`: Key name
    - `value`: Value to store

Request examples:
```bash
# Using GET
curl "http://localhost:81/set?key=abc&value=123"

# Using POST
curl -X POST http://localhost:81/set \
  -H "Content-Type: application/json" \
  -d '{"key": "abc", "value": "123"}'
```

Response example:
```json
{
  "message": "abc is stored",
  "data": "success"
}
```

#### Delete Data
- GET/POST `/del`
  - Parameters:
    - `key`: Key name to delete

Request example:
```bash
curl "http://localhost:81/del?key=abc"
```

Response example:
```json
{
  "message": "abc is deleted",
  "data": "success"
}
```

#### Clear Database
- GET/POST `/clear`
  - Note: Only accessible from localhost (127.0.0.1)

Request example:
```bash
curl http://localhost:81/clear
```

Response example:
```json
{
  "message": "DB is cleared",
  "data": "success"
}
```

## Dependencies

- express: ^4.17.1
- body-parser: ^1.19.0
- cors: ^2.8.5

## License

MIT 