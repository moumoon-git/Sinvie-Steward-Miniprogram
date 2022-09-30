<template>
  <view style="height: 100%;">
    <view class="container" @click="getSubscribeMessage">
      <header
        class="header"
        :style="{
          backgroundImage: `url(${imgStaticUrl}/home/home-banner.png)`,
        }"
      >
        <!-- <text class="header-text-h1">{{
          platformInfo.customName
            ? platformInfo.customName
            : platformInfo.platformName
        }}</text> -->
        <!-- <text class="header-text-h1">工时管理系统</text> -->
        <image
          class="banner-text"
          :src="`${imgStaticUrl}/home/banner-text.png`"
          mode=""
        ></image>
        <image
          class="banner-title"
          :src="`${imgStaticUrl}/home/banner-title.png`"
          mode=""
        ></image>
      </header>
      <view class="userInfo">
        <image
          class="userInfo-icon"
          :src="`${imgStaticUrl}/home/default-head-portrait.png`"
          mode=""
        ></image>
        <text style="margin-left: 20rpx;">{{ `你好，${userInfo.contactName||'同学'}` }}</text>
      </view>
      <ul v-if="isComplete" class="content">
        <li v-for="(menuItem, menuKey) in menuList" :key="menuKey" @click="handleNavigate(menuItem)"
          :class="{
            'working-hour-declaration': menuItem.class == 'working-hour-declaration',
            'working-hour-feedback': menuItem.class == 'working-hour-feedback',
            'working-hour-accounting': menuItem.class == 'working-hour-accounting',
          }"
          :style="{ backgroundImage: `url(${imgStaticUrl}/home/${menuItem.icon}.png)` }"
        >
          <label>{{menuItem.name}}</label>
        </li>
      </ul>
      <van-empty v-else description="暂无数据" />
    </view>
    <getPhoneButton ref="phoneButton" @getPhone="getPhone"></getPhoneButton>
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import getPhoneButton from '@/pages/custom-components/getPhoneButton/getPhoneButton.vue';
import { compose, useLogin } from '@/utils/hooks/useHooks';
import config from '@/static/config/index.js';
import store from '@/store';

export default defineComponent({
  name: 'home',
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      defaultAvatar: this.$imgStaticUrl + '/home/user-icon.png',
      userInfo: { name: '' },
      platformInfo: {},
      requestSubscribeMessageAble: false,
      isComplete: false,
      menuList: [
        {
          name: '工时申报',
          class: 'working-hour-declaration',
          icon: 'menu-icon_green',
          path: '/pages/LaborHourReport/LaborHourReport'
        },
        {
          name: '工时反馈',
          class: 'working-hour-feedback',
          icon: 'menu-icon_red',
          path: '/pages/WorkingHourFeedback/FeedbackList'
        },
        {
          name: '工时核算',
          class: 'working-hour-accounting',
          icon: 'menu-icon_blue',
          path: '/pages/WorkingHourAccounting/WorkingHourAccounting'
        },
      ],
      userInfo: {}
    };
  },
  components: { getPhoneButton },
  computed: {
    avatarImg() {
      return store.state.userInfo.avatar;
    },
    avatar() {
      return this.avatarImg
        ? this.avatarImg.startsWith('http')
          ? this.avatarImg
          : config.fileHost + this.avatarImg
        : null;
    },
  },

  onLoad() {
    // this.login();
    if(!wx.getStorageSync('phone')) {
      this.$refs.phoneButton.visible = true;
    } else {
      this.login();
    }
  },
  onShow() {
  },
  mounted() {
  },
  methods: {
    // login() {
    //   useLogin(this.$http).then((userInfo) => {
    //     if (!userInfo) {
    //       this.$refs.phoneButton.visible = true;
    //       return false;
    //     }
    //     this.userInfo = userInfo;
    //     this.getPlatformTitle();
    //     return true
    //   }).then((res) => {})
    // },
    // 页面跳转
    handleNavigate(menuItem) {
      // if(menuItem.name == '工时核算') {
      //   wx.showToast({
      //     title: '暂未开放',
      //     icon: 'none',
      //   });
      //   return ;
      // }
      wx.navigateTo({
        url: menuItem.path,
      });
    },
    getPlatformTitle() {
      this.$http
        .get({
          url: '/sys/platform/queryByUserId',
          data: {
            userId: wx.getStorageSync('userId'),
          },
        })
        .then(({ data }) => {
          console.log('/sys/platform/queryByUserId data', data);
          if (data.code == 0) {
            this.platformInfo = data.platFormEntity;
            wx.setStorageSync('latitude', data.platFormEntity.latitude);
            wx.setStorageSync('longitude', data.platFormEntity.longitude);
            let area = data.platFormEntity.area?data.platFormEntity.area.split('/'):[''];
            wx.setStorageSync('area', area[area.length-1]);
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
            });
          }
        });
    },
    // 订阅消息
    subscribeMessage() {
      let that = this;
      wx.requestSubscribeMessage({
        tmplIds: ['EqqUmyDd81QjKtPo553rzrv0_1WMtUPok1m74MN3dEM'],
        success(res) {
          console.log('wx.requestSubscribeMessage res', res);
          that.requestSubscribeMessageAble = res.errMsg.includes('ok');
        },
      });
    },
    getSubscribeMessage() {
      if (!this.requestSubscribeMessageAble) {
        this.subscribeMessage();
      }
    },
    getPhone(code) {
      console.log('getPhone code', code);
      this.$http.post({
        url: `/steward-manage/wechat/getMobile?code=${code}`,
      })
      .then(({ data }) => {
        console.log('/steward-manage/wechat/getMobile data', data);
        if (data.code == 200) {
          wx.setStorageSync('phone', data.data);
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
          });
        }
      }).then(()=>{
        this.login();
      });
    },
    login() {
      this.$http.post({
        url: `/oauth-service/user/wxLogin?mobile=${wx.getStorageSync('phone')}`,
      })
      .then(({ data }) => {
        console.log('/oauth-service/user/wxLogin data', data);
        if (data.code == 200) {
          wx.setStorageSync('satoken', data.data.token);
          this.isComplete = true;
          this.getUserInfo();
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
          });
        }
      });
    },
    getUserInfo() {
      this.$http.post({
        url: `/steward-manage/mail/mail-contactor/getByMobile?mobile=${wx.getStorageSync('phone')}`,
      })
      .then(({ data }) => {
        console.log('/steward-manage/mail/mail-contactor/getByMobile data', data);
        if (data.code == 200) {
          this.userInfo = data.data;
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
          });
        }
      });
    },
  },
});
</script>

<style lang="less">
page {
  height: 100%;
}
</style>
<style lang="less" scoped>
.container {
  height: 100%;
  overflow: auto;
  display: block;
  padding: 0rpx;
  box-sizing: border-box;
  background: #F5F5F5;
  .get-phone-number-button {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0%;
    opacity: 0%;
    z-index: 999;
    display: block;
    padding: initial;
    box-sizing: border-box;
    background: #fff;
    line-height: initial;
    text-align: initial;
    font-size: initial;
    &::after {
      border: initial;
    }
  }
  .header {
    width: 100%;
    height: 380rpx;
    // background: url(https://z3.ax1x.com/2021/10/20/5Bte9U.png) no-repeat;
    background-size: 100vw 380rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    position: fixed;
    top: 0%;
    left: 0%;
    .header-text-h1 {
      font-size: 50rpx;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0rpx 10rpx 20rpx rgba(0, 0, 0, 0.5);
      white-space: nowrap;
    }
    .header-text-h4 {
      font-size: 45rpx;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0rpx 10rpx 20rpx rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      margin-top: 10rpx;
    }
    .banner-text {
      width: 200rpx;
      height: 45rpx;
      position: absolute;
      top: 28rpx;
      left: 28rpx;
    }
    .banner-title {
      width: 500rpx;
      height: 114rpx;
    }
  }
  .userInfo {
    padding: 18rpx 0rpx;
    background: #ffffff;
    box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
    border-radius: 8rpx;
    font-weight: 400;
    color: #646566;
    display: flex;
    align-items: center;
    width: 90%;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 320rpx;
    .userInfo-icon {
      // background: url(https://z3.ax1x.com/2021/10/19/5w90mV.png) no-repeat;
      background-size: contain;
      width: 80rpx;
      height: 80rpx;
      display: inline-block;
      border-radius: 50%;
      // background-position: -25rpx -163rpx;
      // background-size: 725rpx 256rpx;
      margin-left: 20rpx;
    }
  }
  .content {
    display: block;
    box-sizing: border-box;
    width: 90%;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 470rpx;
    max-height: 800rpx;
    overflow: auto;
    list-style: none;
    li {
      background: #FFFFFF;
      border-radius: 10rpx;
      width: 100%;
      height: 160rpx;
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      background-repeat: no-repeat;
      label {
        font-weight: 800;
        color: #333333;
        margin-left: 40rpx;
      }
      &.working-hour-declaration {
        background-size: 170rpx 130rpx;
        background-position: 95% center;
      }
      &.working-hour-feedback {
        background-size: 170rpx 130rpx;
        background-position: 95% center;
      }
      &.working-hour-accounting {
        background-size: 170rpx 130rpx;
        background-position: 95% center;
      }
    }
  }
  /deep/ .van-empty {
     margin-top: 450rpx;
  }
}
</style>
