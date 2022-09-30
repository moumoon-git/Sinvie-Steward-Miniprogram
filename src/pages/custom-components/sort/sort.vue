<template>
  <view class="sort">
    <container class="container">
      <view class="listbox">
        <view v-if="showClone" direction="vertical" class="list">
          <name>{{ clone.name }}</name>
          <i
            :style="{
              backgroundImage: `url(${imgStaticUrl}/img/ProblemReporting/ProblemReporting.png)`,
            }"
          ></i>
        </view>
        <dragList
          :itemHeight="120"
          :list="reportTypeList"
          :otherData="otherData"
          @updateList="updateList"
          @change="handleDragList"
        >
          <template v-slot="{ item, parentData }">
            <view class="list">
              <name>{{ item.name }}</name>
              <i
                :style="{
                  backgroundImage: `url(${parentData.imgStaticUrl}/img/ProblemReporting/ProblemReporting.png)`,
                }"
              ></i>
            </view>
          </template>
        </dragList>
        <!-- <view
          direction="vertical"
          class="list"
          v-for="(item, index) in reportTypeList"
          :key="item.id"
        >
          <name>{{ item.name }}</name>
          <i
            :style="{
              backgroundImage: `url(${imgStaticUrl}/img/ProblemReporting/ProblemReporting.png)`,
            }"
            :data-index="index"
            @touchstart="handleDragStart"
            @touchmove="handleDragMove"
            @touchend="handleDragEnd"
          ></i>
        </view> -->
      </view>
    </container>
    <footer class="footer">
      <view class="submitButton" @click="handleSubmitClick">确定</view>
    </footer>
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import dragList from '@/components/gzz-drag/drag-list.vue';
export default defineComponent({
  name: 'sort',

  data() {
    return {
      world: 'kiana',
      imgStaticUrl: this.$imgStaticUrl,
      clone: {
        top: 0,
        name: '',
        code: '',
      },
      replace: {
        name: '',
        code: '',
      },
      showClone: false,
      reportTypeList: [],
    };
  },
  computed: {
    otherData() {
      return {
        imgStaticUrl: this.imgStaticUrl,
      };
    },
  },
  components: {
    dragList,
  },
  created() {
    this.getReportTypeList();
  },
  onLoad(option) {},
  methods: {
    getReportTypeList() {
      this.$http
        .post({
          url: '/reporting/typeSort/list',
        })
        .then(({ data }) => {
          console.log('/reporting/typeSort/list data', data);
          if (data.code == 0) {
            this.reportTypeList = data.data;
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleSubmitClick() {
      let sort = this.reportTypeList
        .map((item) => {
          return item.code;
        })
        .join();
      this.$http
        .post({
          url: '/reporting/typeSort/save',
          data: {
            sort,
          },
        })
        .then(({ data }) => {
          console.log('/reporting/typeSort/save data', data);
          if (data.code == 0) {
            this.reportTypeList = data.data;
            wx.redirectTo({
              url:
                '/pages/garbageClassification/ProblemReporting/ProblemReporting',
            });
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'error',
            });
          }
        });
    },
    handleDragList(value) {
      console.log('updateList value',value);
      this.reportTypeList = value;
    }
  },
});
</script>

<style lang="less" scoped>
page {
  background: #f5f5f5;
}

.sort {
  display: block;
  box-sizing: border-box;
  padding: 0rpx;
  height: 100%;
  .container {
    display: block;
    box-sizing: border-box;
    padding: 0rpx;
    height: 100%;
    .listbox {
      .list {
        display: flex;
        position: relative;
        align-items: center;
        width: 100vw;
        height: 120rpx;
        background: #fff;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        font-size: 32rpx;
        color: #333;
        name {
          margin-left: 5%;
        }
        i {
          display: inline-block;
          margin-left: auto;
          margin-right: 5%;
          width: 60rpx;
          height: 60rpx;
          background-position: -455rpx -130rpx;
          background-size: 626rpx 219rpx;
        }
        &::after {
          display: inline-block;
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 90%;
          height: 3rpx;
          background: #eee;
          content: '';
          transform: translateX(-50%);
        }
      }
    }
  }
  .footer {
    display: flex;
    position: fixed;
    left: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 154rpx;
    background: #fff;
    .submitButton {
      display: inline-block;
      padding: 20rpx 200rpx;
      border-radius: 76rpx;
      background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
      box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(12, 126, 161, 0.35);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      font-size: 40rpx;
      color: #fff;
    }
  }
}
</style>
