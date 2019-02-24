<template>
    <div class="chat-room">
        <button @click="add">搞搞搞</button>
        <section class="session-wrapper">
            <ul>
                <li class="custom" :key="id" v-for="({ id, avatar, name, origin }) in customList">
                    <tab
                        :avatar="avatar"
                        :name="name"
                        :origin="origin"
                    ></tab>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import {
    ERR_OK,
    getLoginInfo
} from '@/server'

import {
    msgTypes, msgStatus
} from '@/common/js/status'

import IM from '@/server/im'

import {
    trace,
    curry,
    uncurry,
    partialRight,
    pipe,
    prop,
    map,
    reduce,
    zip,
    spreadArgs
} from '@/common/js/fp'

// const Rx = require('rxjs-es')

export default {
    components: {
        'Tab': () => import('@/components/Tab.vue')
    },
    computed: {
        // sessionsCustomInfo() {
        //     const getAllCustomInfo = sessionId => this.customInfo[sessionId]
        //     return this.sessionList.list.map(getAllCustomInfo)
        // }
    },
    data() {
        return {
            customList: [],
            /**
             * 原始数据 vuex
             */
            sessions$: null,
            sessions: {
                list: ['1234'],
                curIndex: 0
            },
            sessionsHeap: {
                '1234': {
                    customId: '1234',
                    connect: true,
                    lastActiveTime: 0,
                    badge: 0
                },
                '2345': {
                    customId: '2435',
                    connect: true,
                    lastActiveTime: 0,
                    badge: 0
                }
            },
            customInfo$: null,
            customInfoHeap: {
                '1234': {
                    id: '1234',
                    name: '老铁',
                    avatar: 'https://video-uat.ihxlife.com/user-server/api/v1/video/image/csHeader?id=1007',
                    origin: 'WE'
                },
                '2345': {
                    id: '2345',
                    name: '齐德龙东强',
                    avatar: 'https://video-uat.ihxlife.com/user-server/api/v1/video/image/csHeader?id=1007',
                    origin: 'WE'
                }
            },
            msgsHeap: {
                '1234': [
                    {
                        nickName: '老铁',
                        content: '老铁，给刷个火箭呗',
                        isSelfSend: true,
                        time: new Date().getTime(),
                        msgStatus: msgStatus.msg,
                        msgType: msgTypes.msg_normal
                    },
                    {
                        nickName: '老铁',
                        content: '666',
                        isSelfSend: false,
                        time: new Date().getTime(),
                        msgStatus: msgStatus.msg,
                        msgType: msgTypes.msg_normal
                    },
                    {
                        nickName: '老铁',
                        content: '得嘞',
                        isSelfSend: false,
                        time: new Date().getTime(),
                        msgStatus: msgStatus.msg,
                        msgType: msgTypes.msg_normal
                    }
                ],
                '2345': [
                    {
                        nickName: '齐德龙东强',
                        content: '类吼哇',
                        isSelfSend: false,
                        time: new Date().getTime(),
                        msgStatus: msgStatus.msg,
                        msgType: msgTypes.msg_normal
                    }
                ]
            },
            summaryHeap: {}
        }
    },
    async mounted() {
        // 拿用户签名
        const info = await this.getUserSig('webchat2')
        // IM 登录
        this.initIM(info)

        // this.sessions$ = Rx.Observable.of(this.sessions.list)
        // this.customInfo$ = Rx.Observable.of(this.customInfoHeap)

        // const stream$ = Rx.Observable.combineLatest(this.sessions$, this.customInfo$)
        //             .map(([sessions, customInfo]) => sessions.map(sessionId => customInfo[sessionId]))
        //             .subscribe(res => {
        //                 this.customList = res
        //             })
    },
    methods: {
        add() {
            debugger
            this.sessions$.next(['1234', '2345'])
        },
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
            debugger
        },
        parseMsgs(msgs) {
            const getProp = key => curry(prop, 2)(key)

            const uncurryMapFn = uncurry( map )
            const getContent = getProp('content')

            const getCustomMsgBodys = pipe( getContent, contentDecompose, customMsgParse )
            const getSystemMsgBodys = pipe( getContent, contentDecompose, systemMsgParse )
            const msgMapperFns = [ getCustomMsgBodys, getSystemMsgBodys ]

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
            )( msgs )

            // contentDecompose :: { 'data': String, 'desc': String, 'ext': String } -> [ 'data': Object, 'desc': Object, 'ext': Object ]
            // 解析content, 转 JSON 为 js 对象
            function contentDecompose(content) {
                const keyArr = ['data', 'desc', 'ext']
                return keyArr.map(
                    key => content[key].match(/{/)
                            ? JSON.parse(content[key])
                            : content[key]
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
                    ([ custom, system ], item) => {
                        return item.fromAccount === 'administrator'
                        ? [ custom, system.concat(item.elems) ]
                        : [ custom.concat(item.elems), system ]
                    }
                )
                ( [[], []] )
                ( arr )
            }

            return { customMsgs, systemMsgs }
        }
    }
}
</script>

<style lang="less">

</style>
