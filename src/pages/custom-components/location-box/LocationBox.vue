<template lang="">
  <van-tooltip :value="location">
    <template #default>
      <view class="location maring-box">
        <van-icon style="margin-left: 15rpx;color:#999;" name="location-o" />
        <text class="overflow-ellipsis" style="width: 45%; font-size: 22rpx;">
          {{ location }}
        </text>
        <text v-if="isInRange" style="font-size: 20rpx;color: #0BD295"
          >（已进入巡查范围）</text
        >
        <text v-else style="font-size: 20rpx;">（未进入巡查范围）</text>
        <van-loading
          class="refreshLoading"
          v-show="loadingRefresh"
          slot="loading"
          type="spinner"
          size="20"
          vertical
        />
        <view
          v-show="!loadingRefresh"
          class="refresh"
          @click.stop="refresh(currentPointInfo)"
          >刷新位置</view
        >
      </view>
    </template>
  </van-tooltip>
</template>
<script>
import { getDistance } from '@/utils/utils.js';
import { getLocation } from '@/utils/hooks/useHooks.js';
export default {
  props: {
    location: {
      type: String,
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    isInRange: {
      type: Boolean,
    },
  },
  data() {
    return {
      loadingRefresh: false,
      currentPointInfo: {},
      showPopover: false,
    };
  },
  methods: {
    isInArea(otherPoint, currentPointInfo) {
      const distance = getDistance(
        currentPointInfo.latitude,
        currentPointInfo.longitude,
        otherPoint.latitude,
        otherPoint.longitude
      );
      return distance <= currentPointInfo.clockInRange / 1000;
    },
    async refresh(currentPointInfo) {
      this.currentPointInfo = currentPointInfo;
      this.loadingRefresh = true;

      let { longitude, latitude, address } = await getLocation();
      if(!longitude && !latitude && !address.toString()) {
        longitude = currentPointInfo.longitude;
        latitude = currentPointInfo.latitude;
        if(currentPointInfo.address) {
          address = currentPointInfo.address;
        }
      }
      const isInArea = this.isInArea({ longitude, latitude }, currentPointInfo);
      this.$emit('update:isInRange', isInArea);
      if (isInArea) {
        this.$emit('update:longitude', longitude);
        this.$emit('update:latitude', latitude);
      }
      if(address.toString()) {
        this.$emit('update:location', address);
      }
      setTimeout(() => {
        this.loadingRefresh = false;
      }, 1500);
    },
  },
};
</script>
<style lang="less" scoped>
.location {
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 15rpx 0;
  width: 92%;
  background: #fff;
  .refresh {
    margin-left: auto;
    margin-right: 15rpx;
    padding: 5px;
    border-radius: 5px;
    width: 100rpx;
    height: 30rpx;
    color: #0091FF;
    line-height: 30rpx;
    text-align: center;
    font-size: 24rpx;
  }
  .overflow-ellipsis {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color:#9999;
  }
}
</style>
