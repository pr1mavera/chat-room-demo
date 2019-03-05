import * as types from './mutation-types'
import { setProp } from '@/common/js/fp'

// 修改键盘和拓展层的弹出状态，统一接口
export const setMsgs = ({ commit, state }, { id, list }) => {
  commit(types.SET_MSGS_HEAP, setProp(id, state.msgs, list))
}
