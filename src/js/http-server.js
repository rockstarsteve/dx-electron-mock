/**
 * http服务工具
 */
let express = require('express')
let bodyParser = require("body-parser")
let app = express()
app.use(bodyParser.urlencoded({ extended: false }))
let fs = require('fs')
let http = require('http')
let com = require('./com.js')

let httpserver = {
    port: 8080,
    config: {},
    /**
     * 初始化服务
     */
    init(port) {
        this.port = port;
        this.bindConfig();
        this.server = http.createServer(app);
        this.server.listen(port, () => {
            let host = this.server.address().address;
            let port = this.server.address().port;
        });
        return this.server;
    },
    /**
     * 初始化参数
     */
    bindConfig() {
        fs.readFile(com.getPath(), 'utf8', (err, data) => {
            if (err) {
                alert(err);
            } else {
                console.log("----->>>>>>")
                this.config = JSON.parse(data);
                app.all('*', function (req, res, next) {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
                    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
                    if (req.method == 'OPTIONS') {
                        res.send(200); /让options请求快速返回/
                    } else {
                        next();
                    }
                });
                for (let url in this.config) {
                    let v = this.config[url];
                    app[v.method](url, function (req, res) {
                        // res.header('Access-Control-Allow-Origin', '*');
                        // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                        // res.header('Access-Control-Allow-Headers', 'Content-Type');
                        // res.header('Access-Control-Allow-Credentials', 'true');
                        let obj = v.returnvalue;
                        console.log(req.query)
                        console.log(req.body)
                        let query = req.method === 'GET' ? req.query : req.body;
                        let temp = {};
                        for (let key in query) {
                            temp[key] = query[key];
                            //存入变量中
                        }
                        let returnvalue = v.returnvalue.default;
                        try {
                            //执行所有的表达式，判断满足条件的返回
                            for (let k in obj) {
                                if (k != 'default') {
                                    try {
                                        with (temp) {
                                            if (eval(unescape(k))) {
                                                returnvalue = obj[k];
                                                break;
                                            }
                                        }
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                            }
                        } catch (e) {
                            console.log(e)
                        }
                        res.send(returnvalue);
                        res.end();
                    });
                }
            }
        })
    }
}

module.exports = httpserver;