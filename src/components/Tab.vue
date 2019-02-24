<template>
    <div class="chat-tab">
        <div class="avatar">
            <img src="https://video-uat.ihxlife.com/user-server/api/v1/video/image/csHeader?id=1007">
        </div>
        <div class="content">
            <span class="label">{{name}}</span>
            <span class="label">{{origin | originFormat}}</span>
        </div>
    </div>
</template>

<script>
import { originDict } from '@/common/js/status'

export default {
    props: {
        avatar: {
            type: String
        },
        name: {
            type: String
        },
        origin: {
            type: String
        }
    },
    filters: {
        originFormat: val => `来源：${originDict[val]}`
    }
}
</script>

<style lang="less">

</style>
