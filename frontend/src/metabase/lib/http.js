import {Api} from "metabase/lib/api";

class Http extends Api {
    constructor() {
        super()
        this.basename = ''
    }

    get(...args) {
        return this._send('GET', ...args)
    }

    post(...args) {
        return this._send('POST', ...args)
    }

    put(...args) {
        return this._send('PUT', ...args)
    }

    delete(...args) {
        return this._send('DELETE', ...args)
    }

    _send(type, url, params = {}, data = {}, options = {}) {
        // 尽量让params里面的参数和data中的参数的名称不同
        const datas = Object.assign({}, params, data)
        return this[type](url, options)(datas)
    }
}

export default new Http