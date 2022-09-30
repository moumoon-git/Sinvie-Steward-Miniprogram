<template>
  <div class="Card">
    <div class="header-title">{{ title }}</div>
    <slot></slot>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Card',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const value = ref(0);
    return {
      value,
    };
  },
});
</script>
<style lang="less" scoped>
.Card {
  width: 96%;
  background: #ffffff;
  border-radius: 10px;
  margin: 20rpx auto;
  .header-title {
    height: 92rpx;
    border-bottom: 1px solid #e0dddd;
    line-height: 92rpx;
    padding-left: 28rpx;
    color: #330000;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
  }
}
</style>
