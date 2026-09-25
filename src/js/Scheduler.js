"use strict"

/**
 * 
 */
class Scheduler {
    #interval_time = 10
    #counter = 0
    #interbal_id = -1
    tasks
    handler = () => {
        this.#counter ++
        this.tasks.forEach(e => {
            if (this.#counter % e.interval == 0) {
                e.func(this.#counter)
            }
        })
    }
    start = () => {
        if (this.#interbal_id < 0) {
            console.log("start")
            this.#interbal_id = setInterval(this.handler, this.#interval_time)
        }
    }
    stop = () => {
        if (this.#interbal_id > 0) {
            clearInterval(this.#interbal_id)
            this.#interbal_id = -1
            console.log("stop")
        }
    }
    /**
     * 
     * @param {*} func コールバック関数
     * @param {*} interval インターバル時間(10ms)
     */
    setFunction = (func, interval = 100) => {
        this.tasks.push({
            func: func,
            // interval: Math.floor(interval / this.interval_time)
            interval: interval
        })
    }
    constructor() {
        this.tasks = new Array()
        this.setFunction(() => { console.log("!!") }, 1000)
    }
}