<template>
	<view class="WorkingHourAccounting">
        <camera device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera>
        <button type="primary" @tap="startRecord">开始录像</button>
        <button type="primary" @tap="stopRecord">结束录像</button>
        <video :src="src"></video>
	</view>
</template>

<script>

export default {
  name: 'WorkingHourAccounting',
  data() {  
	return {
        ctx: null,
        src: ''
	}
   },
   components: {
   },
   computed: {
    },
   onShow() {

    },
    onLoad() {
        this.ctx = wx.createCameraContext();
    },
  methods: {
    startRecord() {
        this.ctx.startRecord({
            success: (res) => {
                console.log('startRecord success res', res);
            },
            fail: (e) => {
                console.log('startRecord fail e', e);
            },
        });
    },
    stopRecord() {
        this.ctx.stopRecord({
            compressed: true,
            success: (res) => {
                console.log('stopRecord success res', res);
                this.src = res.tempVideoPath;
            },
            fail: (e) => {
                console.log('stopRecord fail e', e);
            },
        });
    },
    error(e) {
        console.log(e.detail)
    }
  }
};
</script>

<style lang="less">	
    page {
        background: #F5F5F5;
        height: 100%;
        overflow: hidden;
    }
	.FeedbackList {
		height: 100%;
		display: block;
		padding: 0rpx;
		box-sizing: border-box;
		
	}
</style>