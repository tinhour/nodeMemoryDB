var fs = require('fs');
var os = require('os')
var express = require("express");
var path = require("path");
var webLog = __dirname + '/logs/weblog.log';
//memoryDATA
var DATA
var DATAMETA;
const saveDataInterval = 5 * 1000;
const saveFile = __dirname + "/data/momory.json";
var lastupdatedCount;
//load data from hardDisk when the nodeJS is restared
function init(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        console.log(filePath + ' status : can read/write');
        if (fs.statSync(filePath).isFile()) {
            var _DATA = fs.readFileSync(filePath);
            _DATA = JSON.parse(_DATA);
            DATA = _DATA.DATA;
            DATAMETA = _DATA.DATAMETA;
            console.log("recovery data from disk at lastupdated at " + DATAMETA.updatedTime)
        } else {
            DATA = {};
            DATAMETA = {};
        }
    } catch (err) {
        console.error('no access!');
        DATA = {};
        DATAMETA = {};
        console.log("Memory DB runing MemoryOnly Mode")
    }
}
init(saveFile);

function MetaDATA(setCount, createTime, getCount, updatedTime, creatUser, updateUser, createIP, isDel) {
    return {
        "setCount": setCount || 0,
        "createTime": createTime || new Date(),
        "updatedTime": updatedTime || new Date(),
        "creatUser": creatUser || "annoymouse",
        "updateUser": updateUser || "annoymouse",
        "createIP": createIP || "127.0.0.1",
        "isDel": isDel || false,
        "getCount": getCount || 0
    }
}

function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

function formatTime(t) {
    var t = t || new Date();
    var ts = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + pad(t.getHours(), 2) + ":" + pad(t.getMinutes(), 2) + ":" + pad(t.getSeconds(), 2) + ":" + pad(t.getMilliseconds(), 3);
    return ts;
}
var startTime = new Date();
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// 将日志写入功能封装
function writeLog(level, message, data = {}) {
    const logEntry = {
        timestamp: formatTime(),
        level,
        message,
        data
    };
    
    fs.appendFile(webLog, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) console.error('Error writing log:', err);
    });
}

// 在中间件中使用
app.use(function (req, res, next) {
    writeLog('info', 'Request received', {
        method: req.method,
        url: req.url,
        ip: req.ip
    });
    next();
});

//allow custom header and CORS
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200); /*让options请求快速返回*/
    } else {
        next();
    }
});
//web logs
app.use('/weblog', express.static(webLog));
//index
app.all('/', function (req, res) {
        var str = '<html><head><meta charset="UTF-8"><title>APIS</title></head><body><h1>API:</h1>'
        str += '<h4><a target="blank" href="/set?key=abc&value=123">/set?key=abc&value=123</a></h4>'
        str += '<h4><a target="blank" href="/set?key=obj&value={%22this%22:%22a%20larg%20objec%22,%22ste%22:{%22ssdfs%22:%22ss%22,%22sdfs%22:%22sdfsdf%22},%22k%22:[1,2,3],%22p%22:[{%22a%22:1},{%22b%22:2},{%22c%22:3}]}">/set?key=ojb&value=JOSN.stringify({"this": "a larg objec","ste":{"ssdfs":"ss","sdfs":"sdfsdf"},"k":[1,2,3],"p":[{"a":1},{"b":2},{"c":3}]})</a></h4>'
        str += '<h4><a target="blank" href="/get?key=abc">/get?key=abc</a></h4>'
        str += '<h4><a target="blank" href="/get?key=obj">/get?key=obj</a></h4>'
        str += '<h4><a target="blank" href="/del?key=abc">/del?key=abc</a></h4>'
        str += '<h4><a target="blank" href="/get?key=abc&meta=1">/get?key=abc&meta=1</a></h4>'
        str += '<h4><a target="blank" href="/clear">/clear</a></h4>'
        str += '<h4><a target="blank" href="/weblog">weblog</a></h4>'
        str += ' </body></html>'
        res.end(str)
    });
// 将路由处理分离到单独的模块
const router = express.Router();

router.all('/get', async (req, res, next) => {
    try {
        var captureStart = new Date();
        var key = req.params.key;
        var meta = req.params.meta || 0;
        if (key) {
            if (DATA[key]) {
                if (!meta) DATA[key].metaData.getCount++;
                res.json({
                    "message": "get " + key + " success",
                    "data": meta ? DATA[key].metaData : DATA[key].data
                })
            } else {
                res.json({
                    "error": "key not found in parameter",
                    "message": "key not found in parameter"
                })
            }
        } else {
            res.json({
                "message": "get allData success",
                "data": DATA
            })
        }
    } catch (err) {
        next(err);
    }
});

router.all('/set', async (req, res, next) => {
    try {
        var captureStart = new Date();
        var key = req.params.key || req.body.key;
        var value = req.params.value || req.body.value;
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log("ip:", ip)
        if (key) {
            if (DATA[key]) {
                DATA[key].data = value;
                DATA[key].metaData.updatedTime = new Date();
                DATA[key].metaData.setCount++;
                DATA[key].metaData.updateIP = ip;
                res.json({
                    "message": key + " is updated",
                    "data": "success"
                })
            } else {
                DATA[key] = {
                    "data": value,
                    "metaData": new MetaDATA(1)
                }
                DATA[key].metaData.createIP = ip;
                res.json({
                    "message": key + " is stored",
                    "data": "success"
                })
            }
            DATAMETA.updatedTime = new Date();
            DATAMETA.updatedCount = DATAMETA.updatedCount ? DATAMETA.updatedCount + 1 : 1;
            //attention: here can run when set data just to save to file for persist
            //persitDATA(saveFile);
        } else {
            res.json({
                "error": "key not found in parameter",
                "message": "key not found in parameter"
            })
        }
    } catch (err) {
        next(err);
    }
});

app.use('/', router);

//del by  key
app.all("/del", function (req, res) {
        var captureStart = new Date();
        var key = req.params.key;
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (key) {
            if (DATA[key]) {
                delete DATA[key]
                res.json({
                    "message": key + " is deleted",
                    "data": "success"
                })
            } else {
                res.json({
                    "message": key + " is not found yet",
                    "data": "success"
                })
            }
            DATAMETA.updatedTime = new Date();
            DATAMETA.updatedCount = DATAMETA.updatedCount ? DATAMETA.updatedCount + 1 : 1;
            //attention: here can run when set data just to save to file for persist
            //persitDATA(saveFile);
        } else {
            res.json({
                "error": "key not found in parameter",
                "message": "key not found in parameter"
            })
        }
    })
    //clear all data
app.all("/clear", function (req, res) {
        var captureStart = new Date();
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip == "::ffff:127.0.0.1" || ip == "::1") {
            DATA = {};
            res.json({
                "message": "DB is cleared",
                "data": "success"
            })
            DATAMETA.updatedTime = new Date();
            DATAMETA.updatedCount = DATAMETA.updatedCount ? DATAMETA.updatedCount + 1 : 1;
        } else {
            res.json({
                "message": "permission not allowed",
                "error": "fail"
            })
        }
    })
    //save lastupdated count  if not modifyed not save
setInterval(function () {
        if (lastupdatedCount != DATAMETA.updatedCount) {
            lastupdatedCount = DATAMETA.updatedCount;
            persitDATA(saveFile);
        }
    }, saveDataInterval)
    //save DATA to hardDisk for persist

function persitDATA(filePath) {
    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (!err) {
            fs.writeFile(saveFile, JSON.stringify({
                "DATA": DATA,
                "DATAMETA": DATAMETA
            }), function (err) {
                if (!err) {
                    console.log("saved data to file", saveFile)
                } else {
                    console.warn("can't save DATA only run in memory")
                }
            });
        } else {
            var foldPath = path.parse(saveFile).dir;
            fs.mkdir(foldPath, function (err) {
                if (!err) {
                    fs.writeFile(saveFile, JSON.stringify({
                        "DATA": DATA,
                        "DATAMETA": DATAMETA
                    }), function (err) {
                        if (!err) {
                            console.log("saved data to file", saveFile)
                        } else {
                            console.warn("can't save DATA only run in memory")
                        }
                    });
                } else {
                    console.log("cannot create fold path:", foldPath, err)
                }
            })
            console.log("foldPath", foldPath)
        }
    });
}

// 将配置提取到单独的对象
const config = {
    port: 81,
    saveInterval: 5 * 1000,
    dataPath: path.join(__dirname, 'data/momory.json'),
    logPath: path.join(__dirname, 'logs/weblog.log')
};

var service = app.listen(config.port, function () {
    var port = service.address().port;
    console.log('[%s] Service listening at port %s cost Time %ds', formatTime(), port, (new Date() - startTime) / 1000);
    console.log('[%s] double press Ctrl+C to stop service', formatTime())
})

// 添加统一的错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });
});

// 将数据持久化逻辑封装
class DataStore {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = {};
        this.meta = {};
    }

    async load() {
        try {
            const content = await fs.promises.readFile(this.filePath);
            const parsed = JSON.parse(content);
            this.data = parsed.DATA;
            this.meta = parsed.DATAMETA;
        } catch (err) {
            console.warn('Starting with empty data store');
        }
    }

    async save() {
        try {
            const dir = path.dirname(this.filePath);
            await fs.promises.mkdir(dir, { recursive: true });
            await fs.promises.writeFile(
                this.filePath,
                JSON.stringify({
                    DATA: this.data,
                    DATAMETA: this.meta
                })
            );
            console.log('Data saved successfully');
        } catch (err) {
            console.error('Failed to save data:', err);
        }
    }
}

const store = new DataStore(config.dataPath);

// 添加基本的安全中间件
const helmet = require('helmet');
app.use(helmet());

// 添加请求速率限制
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// 添加数据验证
const validateKey = (req, res, next) => {
    const key = req.params.key || req.body.key;
    if (!key || typeof key !== 'string') {
        return res.status(400).json({
            error: 'Invalid key',
            message: 'Key must be a non-empty string'
        });
    }
    next();
};

app.use('/set', validateKey);