<template>
    <div class="chat-tab border-1px-after">
        <div class="avatar">
            <img src="https://video-uat.ihxlife.com/user-server/api/v1/video/image/csHeader?id=1007">
        </div>
        <div class="content">
            <span class="label name">{{name}}</span>
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
// @import '~@/common/style/mixin.less';

.chat-tab {
    width: 100%;
    height: 100px;
    background-color: #ccc;
    padding: 20px 20px;
    box-sizing: border-box;
    display: flex;
    .avatar {
        width: 60px;
        height: 60px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
    }
    .content {
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .label {
            font-size: 13px;
            line-height: 20px;
            &.name {
                font-size: 15px;
            }
        }
    }
}
</style>
