/**
 * EventEmitter
 * 
 * @desc 自定义事件触发器（单例）
 * @author Primavera
 * @date 2019/3/1
 */

class EventEmitter {
    constructor() {
        // 初始化观察者
        this.handlers = {}
        // 初始化单例
        this.instance = null
    }
    // 获取单例
    static getInstance() {
        if(!this.instance) {
            this.instance = new Queue()
        }
        return this.instance
    }
    // 绑定订阅器
	on(evtName, cb) {
		this.handlers[evtName] = this.handlers[evtName] || []
		this.handlers[evtName][this.handlers[evtName].length] = cb
    }
    // 添加观察者
	addEventListener(...args) {
		return this.on(...args)
    }
    // 移除
    removeEventListener() {}
    // 抛出命令
	emit(evtName, ...args) {
		for (let handler of (this.handlers[evtName] || [])) {
			handler(args)
		}
	}
}

export default EventEmitter
