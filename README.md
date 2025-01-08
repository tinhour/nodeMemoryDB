# nodeMemoryDB

[English](./README_EN.md) | 简体中文

一个基于 Node.js 构建的简单内存数据库服务。

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

- GET `/api/get/:key` - 获取数据
- POST `/api/set` - 设置数据
- DELETE `/api/delete/:key` - 删除数据
- GET `/api/keys` - 获取所有键列表

## 许可证

MIT 

```javascript
npm install nodeMemoryDB 
npm run start
```