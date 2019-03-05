import { sessions, sessionsHeap, customInfoHeap, msgsHeap, summaryHeap, commit, setMsgs } from '@/store'

export default function msgsOperators(msgObj) {
    const id = msgObj.sessionId
    setMsgs({ id,
        list: msgsHeap[id].concat(msgObj)
    })
}
