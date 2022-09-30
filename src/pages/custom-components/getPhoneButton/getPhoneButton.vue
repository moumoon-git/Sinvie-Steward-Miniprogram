<template lang="">
  <view class="getPhoneDialog" v-if="visible">
    <view class="overlay-page"></view>
    <view class="content">
      <view class="title">我们需要您激活手机号码</view>
      <view class="btn-group">
        <view class="btn btn1" @click="cancle">拒绝</view>
        <button
          class="btn btn2"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          确认
        </button>
      </view>
    </view>
  </view>
</template>
<script>
import { compose } from '@/utils/hooks/useHooks';

export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    // 1. 解密手机号
    async decryptPhone(data, { request }) {
      const res = await request.post({
        url: '/mail/mailcontactor/decryptPhone',
        data,
      });

      return {
        mobile: res.data.phoneNumber,
        openId: wx.getStorageSync('openId'),
      };
    },

    // 2. 通过手机号激活
    async activationPart(data, { request, activationPartCallBack }) {
      try {
        const res = await request.post({
          url: '/mail/mailcontactor/passwordActivation',
          data,
        });
        if (res.data.code === 0) {
          wx.showToast({
            title: '激活成功',
            icon: 'success',
          });
          activationPartCallBack(res.data);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
          });

          activationPartCallBack(res.data);
          wx.redirectTo({
            url: '../tip-pages/tip-pages',
          });
        }
      } catch {}

      return null;
    },

    // 获取手机号
    async getPhoneNumber(e) {
      console.log('getPhoneNumber', e);
      console.log(e.detail.errMsg);
      console.log(e.detail.iv);
      console.log(e.detail.encryptedData);
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        // // 不要用data缓存的userKeyWord 不然不是最新的 要在这里重新从storage取
        // let userKeyWord = wx.getStorageSync('userKeyWord')
        //   ? JSON.parse(wx.getStorageSync('userKeyWord'))
        //   : {};
        // const firstParams = {
        //   encryptedData: e.detail.encryptedData,
        //   iv: e.detail.iv,
        //   sessionKey: userKeyWord.sessionKey,
        // };
        // const process = compose(
        //   {
        //     firstParams,
        //     request: this.$http,
        //     // activationPart穿插的callBack
        //     activationPartCallBack: (payload) => {
        //       if (payload.code === 0) {
        //         wx.setStorageSync('platformId', payload.platformId);
        //         wx.setStorageSync('token', payload.token);
        //         setTimeout(() => {
        //           this.$emit('reLogin');
        //         });
        //       } else {
        //         this.$emit('bannerShow');
        //       }
        //     },
        //   },
        //   this.decryptPhone,
        //   this.activationPart
        // );
        // process().then(() => {
        //   this.visible = false;
        // });
        this.$emit('getPhone', e.detail.code);
        this.visible = false;
      } else {
        this.cancle();
      }
    },
    cancle() {
      this.visible = false;
      this.$emit('bannerShow');
    },
  },
};
</script>
<style lang="less">
.getPhoneDialog {
  .overlay-page {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 111;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .content {
    z-index: 112;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 530rpx;
    border-radius: 16rpx;
    background-color: #fff;
    .title {
      height: 100rpx;
      border-bottom: 1px solid #eee;
      text-align: center;
      line-height: 100rpx;
    }
    .btn-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn {
        text-align: center;
        height: 72rpx;
        line-height: 72rpx;
        flex: 1;
      }
      .btn1 {
        border-right: 1px solid #eee;
      }
      .btn2 {
        background-color: transparent;
        border-radius: unset;
        box-sizing: border-box;
        color: #000;
        cursor: pointer;
        display: block;
        font-size: unset;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
        padding-left: 0;
        padding-right: 0;
        position: relative;
        text-align: center;
        text-decoration: none;
        color: #50c549;
        &::after {
          border: initial;
        }
      }
    }
  }
}
</style>
