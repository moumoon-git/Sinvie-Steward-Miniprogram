<template>
  <div class="HeaderBar">
    <div
      :class="[
        'list-item',
        { 'list-item-active': activeId === item.contactorId },
      ]"
      v-for="item in peopleList"
      :key="item.contactorId"
      @click="handleClick(item)"
    >
      <div>{{ item.mailContactorName }}</div>
      <div class="number">{{ item.count }}</div>
    </div>
    <div class="all-btn" @click="showAll">
      <van-icon name="friends-o" />查看全部
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  name: 'HeaderBar',
  props: {
    peopleList: {
      type: Array,
      default: () => [],
    },
    activeId: {
      type: Number,
      default: 0,
    },
  },
  emits: ['tabClick', 'showPopup'],
  setup(props, { emit }) {
    const handleClick = (item) => {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        props.activeId
      );
      if (props.activeId === item.contactorId) return;
      emit('tabClick', item);
    };

    const showAll = () => {
      if (props.peopleList.length === 1 && props.peopleList[0].count === 0) {
        wx.showToast({
          title: '已无填写项',
          icon: 'none',
        });
        return;
      }
      emit('showPopup');
    };

    return {
      handleClick,
      showAll,
    };
  },
});
</script>
<style lang="less" scoped>
.HeaderBar {
  height: 120rpx;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10rpx;
  position: relative;
  border-bottom: 1px solid #e0dddd;
  color: #666;
  background: #fff;
  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 160rpx;
    height: 100%;
    margin: 0 15rpx;
    .number {
      width: 36rpx;
      height: 30rpx;
      background: #ff6d49;
      border-radius: 17rpx;
      border: 2px solid #fa6400;
      color: #fff;
      line-height: 30rpx;
      text-align: center;
      margin-left: 5px;
    }
  }
  .list-item-active {
    border-bottom: 4rpx solid #0091ff;
    color: #000;
  }
  .all-btn {
    min-width: 180rpx;
    min-height: 130rpx;
    background: #ffffff;
    box-shadow: -2px 0px 12px 0px rgba(0, 0, 0, 0.08);
    position: sticky;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
}
</style>
