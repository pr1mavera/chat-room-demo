<template>
    <div class="chat-room">
        <!-- <button @click="add">搞搞搞</button>
        <p>{{config.arr[0].name}}</p> -->
        <section class="session-wrapper">
            <ul>
                <li class="custom" :key="id" v-for="({ id, avatar, name, origin }, index) in customList">
                    <tab
                        :avatar="avatar"
                        :name="name"
                        :origin="origin"
                    ></tab>
                    <div class="line" v-show="index !== customList.length - 1"></div>
                </li>
            </ul>
        </section>
        <section class="msgs-wrapper">
            <div class="msgs-container">
                <ul>
                    <li class="msg block"></li>
                    <li class="msg" :style="{'flex-direction': msg.isSelfSend ? 'row-reverse' : 'row'}" :key="index" v-for="(msg, index) in msgsList">
                        <div class="avatar">
                            <img src="https://video-uat.ihxlife.com/user-server/api/v1/video/image/csHeader?id=1007">
                        </div>
                        <div class="msg-body" :style="{'align-items': msg.isSelfSend ? 'flex-end' : 'flex-start'}">
                            <p class="name" :style="{'text-align': msg.isSelfSend ? 'right' : 'left'}">{{msg.nickName}}</p>
                            <p class="body">{{msg.content}}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="input-wrapper">
                <textarea class="input" type="text"></textarea>
                <button class="commit">发送</button>
            </div>
        </section>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
    ERR_OK, getLoginInfo
} from '@/server'

import {
    msgTypes, msgStatus
} from '@/common/js/status'

import IM from '@/server/im'

import {
    curry, uncurry, pipe, prop, map, reduce, zip, each, spreadArgs, unboundMethod
} from '@/common/js/fp'

import {
    formatDate, randomMin2Max
} from '@/common/js/dateConfig'

import EventEmitter from '@/common/js/EventEmitter'

import msgsOperators from '@/common/js/operators/msgs'
import connectOperators from '@/common/js/operators/connect'
import disconnectOperators from '@/common/js/operators/disconnect'
import summaryOperators from '@/common/js/operators/summary'

const Rx = require('rxjs-es')

export default {
    components: {
        'Tab': () => import('@/components/Tab.vue')
    },
    computed: {
        ...mapGetters([
            'sessions',
            'sessionsHeap',
            'customInfoHeap',
            'msgsHeap',
            'summaryHeap'
        ]),
        customList() {
            const sessionsList = this.sessions.list
            return sessionsList.map(id => this.customInfoHeap[id])
        },
        msgsList() {
            const { list, curIndex } = this.sessions
            return this.msgsHeap[list[curIndex]]
        }
    },
    data() {
        return {
            // customList: [],
            // msgsList: [],
            /**
             * stream
             */
            // sessions$: null,
            // customInfo$: null,
            // msgs$: null,
            emitter: null,
            /**
             * 原始数据 vuex
             */
            // sessions: {
            //     list: [],
            //     curIndex: 0
            // },
            // sessionsHeap: {
            //     '1234': {
            //         customId: '1234',
            //         connect: true,
            //         lastActiveTime: 0,
            //         badge: 0
            //     },
            //     '2345': {
            //         customId: '2435',
            //         connect: true,
            //         lastActiveTime: 0,
            //         badge: 0
            //     }
            // },
            // customInfoHeap: {
            //     // '1234': {
            //     //     id: '1234',
            //     //     name: '老铁',
            //     //     avatar: 'https://video-uat.ihxlife.com/user-server/api/v1/video/image/csHeader?id=1007',
            //     //     origin: 'WE'
            //     // },
            //     // '2345': {
            //     //     id: '2345',
            //     //     name: '齐德龙东强',
            //     //     avatar: 'https://video-uat.ihxlife.com/user-server/api/v1/video/image/csHeader?id=1007',
            //     //     origin: 'WE'
            //     // }
            // },
            // msgsHeap: {
            //     // '1234': [
            //     //     {
            //     //         nickName: '客服',
            //     //         content: '老铁，给刷个火箭呗，老铁给整个呗！！，老铁给整个呗！！，老铁给整个呗！！，老铁给整个呗！！，老铁给整个呗！！',
            //     //         isSelfSend: true,
            //     //         time: new Date().getTime(),
            //     //         msgStatus: msgStatus.msg,
            //     //         msgType: msgTypes.msg_normal
            //     //     },
            //     //     {
            //     //         nickName: '老铁',
            //     //         content: '666老铁，给刷个火箭呗，老铁给整个呗！！，老铁给整个呗！！，老铁给',
            //     //         isSelfSend: false,
            //     //         time: new Date().getTime(),
            //     //         msgStatus: msgStatus.msg,
            //     //         msgType: msgTypes.msg_normal
            //     //     },
            //     //     {
            //     //         nickName: '老铁',
            //     //         content: '得嘞',
            //     //         isSelfSend: false,
            //     //         time: new Date().getTime(),
            //     //         msgStatus: msgStatus.msg,
            //     //         msgType: msgTypes.msg_normal
            //     //     },
            //     //     {
            //     //         nickName: '客服',
            //     //         content: '老铁，给刷个火箭呗，老铁给整个呗！！，老铁给整个呗！！，老铁给整个呗！！，老铁给整个呗！！，老铁给整个呗！！',
            //     //         isSelfSend: true,
            //     //         time: new Date().getTime(),
            //     //         msgStatus: msgStatus.msg,
            //     //         msgType: msgTypes.msg_normal
            //     //     },
            //     //     {
            //     //         nickName: '老铁',
            //     //         content: '666老铁，给刷个火箭呗，老铁给整个呗！！，老铁给整个呗！！，老铁给',
            //     //         isSelfSend: false,
            //     //         time: new Date().getTime(),
            //     //         msgStatus: msgStatus.msg,
            //     //         msgType: msgTypes.msg_normal
            //     //     },
            //     //     {
            //     //         nickName: '老铁',
            //     //         content: '得嘞',
            //     //         isSelfSend: false,
            //     //         time: new Date().getTime(),
            //     //         msgStatus: msgStatus.msg,
            //     //         msgType: msgTypes.msg_normal
            //     //     }
            //     // ],
            //     // '2345': [
            //     //     {
            //     //         nickName: '齐德龙东强',
            //     //         content: '类吼哇',
            //     //         isSelfSend: false,
            //     //         time: new Date().getTime(),
            //     //         msgStatus: msgStatus.msg,
            //     //         msgType: msgTypes.msg_normal
            //     //     }
            //     // ]
            // },
            // summaryHeap: {}
        }
    },
    async mounted() {
        // 拿用户签名
        const info = await this.getUserSig('webchat2')
        // IM 登录
        this.initIM(info)
        // 初始化事件响应器，绑定对应流的关联关系
        this.initEventWithStreamBinded()

        // this.sessions$ = new Rx.BehaviorSubject(this.sessions)
        //                        .subscribe(data => {
        //                            this.sessions = data
        //                        })
        // this.customInfo$ = new Rx.BehaviorSubject(this.customInfoHeap)
        //                         .subscribe(data => {
        //                             this.customInfoHeap = data
        //                         })
        // this.msgs$ = new Rx.BehaviorSubject(this.msgsHeap)
        //                     .subscribe(data => {
        //                         this.msgsHeap = data
        //                     })

        // Rx.Observable.combineLatest(this.sessions$, this.customInfo$)
        //             .map(([sessions, customInfo]) => sessions.list.map(sessionId => customInfo[sessionId]))
        //             .subscribe(res => {
        //                 this.customList = res
        //             })

        // Rx.Observable.combineLatest(this.sessions$, this.msgs$)
        //             .map(([sessions, msgs]) => msgs[sessions.list[sessions.curIndex]])
        //             .subscribe(res => {
        //                 this.msgsList = res
        //             })
    },
    methods: {
        // add() {
        //     const arr = this.config.arr.splice(0, 1)[0]
        //     arr.name = 222
        //     this.config.arr[0] = arr
        // },
        async getUserSig(userId) {
            const res = await getLoginInfo(userId)
            if (res.result.code === ERR_OK) {
                console.log('============================= 我现在来请求 getUserInfo 辣 =============================')
                return Object.assign(res.data, { userId, userName: userId })
            } else {
                console.log('error in getLoginInfo')
            }
        },
        initIM({ userId, userName, sdkAppId, accountType, userSig }) {
            const loginInfo = {
                identifier: userId,
                identifierNick: userName,
                sdkAppID: sdkAppId,
                userSig,
                accountType,
                appIDAt3rd: sdkAppId
            }
            console.debug('initIM', loginInfo)
            return new Promise((resolve) => {
                IM.login(loginInfo, {
                        // 'onBigGroupMsgNotify': this.onBigGroupMsgNotify,
                        'onMsgNotify': this.onMsgNotify
                    }, () => {
                        console.log('===============================> initIM success <===============================')
                        resolve()
                    }, err => {
                        alert(err.ErrorInfo)
                    }
                )
            })
        },
        onMsgNotify(msgs) {
            const { customMsgs, systemMsgs } = this.parseMsgs(msgs)
            // const self = this
            systemMsgs.length && systemMsgs.map(systMsg => {
                if (+systMsg.code === 22) {
                    const sessionId = this.getRamSessionId()
                    const msg = {
                        userId: systMsg.userId,
                        msgBody: {
                            data: {
                                code: 23,
                                csId: 'webchat2',
                                csName: '王效雷',
                                csNick: '王效雷',
                                sessionId
                            },
                            desc: '王效雷会话创建成功了',
                            ext: ''
                        }
                    }
                    IM.sendSystemMsg(msg)
                    this.emitter.emit('connect', systMsg)
                }
                else if (+systMsg.code === 25) {
                    const msg = {
                        userId: systMsg.userId,
                        msgBody: {
                            data: {
                                code: 24
                            },
                            desc: '王效雷会话结束了',
                            ext: ''
                        }
                    }
                    IM.sendSystemMsg(msg)
                    this.emitter.emit('disconnect', systMsg)
                }
            })

            customMsgs.length && customMsgs.map(msg => this.emitter.emit('msgs', msg))
        },
        initEventWithStreamBinded() {
            // 获取事件响应器
            this.emitter = EventEmitter.getInstance()
            // 事件列表
            const events = [ 'msgs', 'connect', 'disconnect', 'summary' ]

            const makeObservableFromEvent = curry( Rx.Observable.fromEvent, 2 )( this.emitter )
            const mapObservable = uncurry( map )

            const observableMapperFns = [ msgsOperators, connectOperators, disconnectOperators, summaryOperators ]

            const [ msgs$, connect$, disconnect$, summary$ ] = pipe(
                map( makeObservableFromEvent ),
                curry( zip )( observableMapperFns ),
                map( spreadArgs( mapObservable ) )
            )
            ( events )

            const subscribeToObservable = pipe( unboundMethod, uncurry )( 'subscribe', 2 )

            // !!SIDE EFFECTS!!
            each( spreadArgs( subscribeToObservable ) )
                ( zip(
                    [ () => {}, () => {}, () => {}, () => {} ],
                    [ msgs$, connect$, disconnect$, summary$ ]
                ) )
        },
        getRamSessionId() {
            const date = formatDate('yyyy-MM-dd-hh-mm-ss-SSS').split(/-/g).join('')
            const ram = randomMin2Max(100000, 999999)
            return `1${date}${ram}`
        },
        /**
         * desc: onMsgNotify 消息解析
         * sign: parseMsgs :: Array: [ msgs ] -> { customMsgs: [ { msg }, ... ], systemMsgs: [ { msg }, ... ] }
         */
        parseMsgs: (function() {
            const getProp = key => curry(prop, 2)(key)

            const uncurryMapFn = uncurry( map )
            const getContent = getProp('content')

            const getCustomMsgBodys = pipe( getContent, contentDecompose, customMsgParse )
            const getSystemMsgBodys = pipe( getContent, contentDecompose, systemMsgParse )
            const msgMapperFns = [ getCustomMsgBodys, getSystemMsgBodys ]

            // contentDecompose :: { 'data': String, 'desc': String, 'ext': String } -> [ 'data': Object, 'desc': Object, 'ext': Object ]
            // 解析content, 转 JSON 为 js 对象
            function contentDecompose(content) {
                const keyArr = ['data', 'desc', 'ext']
                return keyArr.map(
                    key => content[key] && content[key].match(/{/)
                            ? JSON.parse(content[key])
                            : content[key] || {}
                )
            }

            // customMsgParse :: [ 'data': Object, 'desc': Object, 'ext': Object ] -> Object
            // 解析 C2C 消息的 content
            function customMsgParse([data, desc, ext]) {
                return Object.assign(desc, ext, {
                    content: data,
                    isSelfSend: false,
                    isSystem: false
                })
            }

            // systemMsgParse :: { 'data': String, 'desc': String, 'ext': String } -> Object
            // 解析 系统 消息的 content
            function systemMsgParse([data, desc, ext]) {
                return Object.assign(data, desc, ext, {
                    openId: data.userId,
                    isSystem: true
                })
            }

            // category :: [ Msg ] -> [ customMsgs: [ Elem ], systemMsgs: [ Elem ] ]
            // 消息分类成 C2C消息 和 系统消息
            function category(arr) {
                return reduce(
                    ([ custom, system ], item) => item.fromAccount === 'administrator'
                                                    ? [ custom, system.concat(item.elems) ]
                                                    : [ custom.concat(item.elems), system ]
                ) // eslint-disable-line
                ( [[], []] ) // eslint-disable-line
                ( arr )
            }

            return function parseMsgsPipe(msgs) {
                /**
                 *   消息解析管道
                 *   msgs: [
                 *       {
                 *           fromAccount: 'administrator' || Any,
                 *           elems: [ Msg.Elem ]
                 *       }, :Msg
                 *       ...
                 *   ]
                 *   category -> [
                 *                   customMsgs: [ Msg.Elem ],
                 *                   systemMsgs: [ Msg.Elem ]
                 *               ]
                 *   zip ->  [
                 *               customMsgs: [
                 *                   getCustomMsgBodys: Function,
                 *                   [ Msg.Elem ]
                 *               ],
                 *               systemMsgs: [
                 *                   getSystemMsgBodys: Function,
                 *                   [ Msg.Elem ]
                 *               ],
                 *           ]
                 *   map ->  [
                 *               customMsgs: [ Msg.Elem ].map(getCustomMsgBodys),
                 *               systemMsgs: [ Msg.Elem ].map(getSystemMsgBodys),
                 *           ]
                 */
                const [ customMsgs, systemMsgs ] = pipe(
                    category,
                    curry( zip )( msgMapperFns ),
                    map( spreadArgs( uncurryMapFn ) )
                ) // eslint-disable-line
                ( msgs )

                return { customMsgs, systemMsgs }
            }
        })()
    }
}
</script>

<style lang="less">
.chat-room {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 800px;
    height: 700px;
    background: #eee;
    display: flex;
    .session-wrapper {
        flex-shrink: 0;
        width: 250px;
        height: 100%;
        background-color: #ddd;
        ul > li.custom {
            position: relative;
            .line {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: calc(~'100% - 40px');
                height: 1px;
                background: #bbb;
            }
        }
    }
    .msgs-wrapper {
        flex-shrink: 1;
        width: 100%;
        height: 100%;
        background-color: #eee;
        display: flex;
        flex-direction: column;
        .msgs-container {
            flex-shrink: 1;
            width: 100%;
            height: 100%;
            // padding: 0 20px;
            // box-sizing: border-box;
            overflow: auto;
            ul > li.msg {
                display: flex;
                margin-bottom: 20px;
                &.block {
                    width: 100%;
                }
                .avatar {
                    flex-shrink: 0;
                    width: 60px;
                    height: 60px;
                    padding: 0 20px;
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 50%;
                    }
                }
                .msg-body {
                    flex-shrink: 1;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    .name {
                        font-size: 12px;
                        line-height: 18px;
                        color: #555;
                    }
                    .body {
                        position: relative;
                        display: inline-block;
                        max-width: 60%;
                        padding: 16px;
                        border-radius: 4px;
                        margin-top: 5px;
                        font-size: 15px;
                        line-height: 20px;
                        background-color: lightsteelblue;
                    }
                }
            }
        }
        .input-wrapper {
            position: relative;
            flex-shrink: 0;
            width: 100%;
            height: 180px;
            // background-color: #000;
            border-top: 1px solid #ccc;
            .input {
                // width: 100%;
                // height: 100%;
                width: calc(~'100% - 20px');
                height: calc(~'100% - 70px');
                resize: none;
                overflow: auto;
                border: 0;
                padding: 0;
                margin: 10px 10px 60px;
                // box-sizing: border-box;
                background-color: unset;
                font-size: 14px;
                line-height: 22px;
                outline: none;
            }
            .commit {
                position: absolute;
                bottom: 12px;
                right: 10px;
                width: 110px;
                height: 36px;
                margin: 0;
                padding: 0;
                border-radius: 5px;
                color: dodgerblue;
                border: 1px solid dodgerblue;
                font-size: 14px;
                outline: none;
            }
        }
    }
}
</style>
