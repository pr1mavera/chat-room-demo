import * as types from './mutation-types'

const mutations = {
  [types.SET_SESSIONS](state, sessions) {
    state.sessions = sessions
  },
  [types.SET_SESSIONS_HEAP](state, sessionsHeap) {
    state.sessionsHeap = sessionsHeap
  },
  [types.SET_CUSTOMINFO_HEAP](state, customInfoHeap) {
    state.customInfoHeap = customInfoHeap
  },
  [types.SET_MSGS_HEAP](state, msgsHeap) {
    state.msgsHeap = msgsHeap
  },
  [types.SET_SUMMARY_HEAP](state, summaryHeap) {
    state.summaryHeap = summaryHeap
  }
}

export default mutations
