let path = require('path');
let os = require('os');

let Common = {
    /**
     * 获取配置文件
     */
    getPath() {
        return path.join(os.homedir(), 'config.json');
    }

}

module.exports = Common;