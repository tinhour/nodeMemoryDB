# nodeMemoryDB

[English](./README_EN.md) | 简体中文

一个基于 Node.js 构建的简单内存数据库服务。

## 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

## 功能特点

- 轻量级内存数据库
- RESTful API 接口
- 简单易用
- 支持基础的 CRUD 操作

## 安装

```bash
npm install nodeMemoryDB
```

## 使用方法

启动服务器：

```bash
npm run start
```

服务器将在 81 端口启动，作为内存数据库服务运行。

## API 接口

### 数据操作

#### 获取数据
- GET `/get`
  - 参数：
    - `key`：（可选）键名。如果不提供，则返回所有数据
    - `meta`：（可选）设为 1 时返回元数据

请求示例：
```bash
# 获取指定键的数据
curl http://localhost:81/get?key=abc

# 获取指定键的数据及元数据
curl http://localhost:81/get?key=abc&meta=1

# 获取所有数据
curl http://localhost:81/get
```

响应示例：
```json
{
  "message": "get abc success",
  "data": "123"
}
```

#### 设置数据
- GET/POST `/set`
  - 参数：
    - `key`：键名
    - `value`：值

请求示例：
```bash
# GET 方式
curl "http://localhost:81/set?key=abc&value=123"

# POST 方式
curl -X POST http://localhost:81/set \
  -H "Content-Type: application/json" \
  -d '{"key": "abc", "value": "123"}'
```

响应示例：
```json
{
  "message": "abc is stored",
  "data": "success"
}
```

#### 删除数据
- GET/POST `/del`
  - 参数：
    - `key`：要删除的键名

请求示例：
```bash
curl "http://localhost:81/del?key=abc"
```

响应示例：
```json
{
  "message": "abc is deleted",
  "data": "success"
}
```

#### 清空数据库
- GET/POST `/clear`
  - 注意：只允许从本地（127.0.0.1）访问

请求示例：
```bash
curl http://localhost:81/clear
```

响应示例：
```json
{
  "message": "DB is cleared",
  "data": "success"
}
```

## 项目依赖

- express: ^4.17.1
- body-parser: ^1.19.0
- cors: ^2.8.5

## 许可证

MIT 

```javascript
npm install nodeMemoryDB 
npm run start
```