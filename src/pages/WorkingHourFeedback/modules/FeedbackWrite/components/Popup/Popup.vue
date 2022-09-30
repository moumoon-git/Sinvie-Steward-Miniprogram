<template>
  <van-popup
    :show="popupShow"
    round
    position="bottom"
    custom-style="height: 40%;"
    closeable
    close-icon-position="top-left"
    @close="close"
  >
    <div class="header-title">
      <div>请选择成员</div>
      <div @click="confirm">确定</div>
    </div>
    <div class="content-wrap">
      <div
        :class="[
          'list-item',
          { 'list-item-active': activeItem.contactorId === item.contactorId },
        ]"
        v-for="item in peopleList"
        :key="item.contactorId"
        @click="handleClick(item)"
      >
        <div>{{ item.mailContactorName }}</div>
        <div class="number">{{ item.count }}</div>
      </div>
    </div>
  </van-popup>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  props: {
    popupShow: {
      type: Boolean,
      default: false,
    },
    peopleList: {
      type: Array,
      default: () => [],
    },
    activeId: {
      type: Number,
      default: 0,
    },
  },
  emits: ['tabClick', 'update:popupShow'],
  setup(props, { emit }) {
    const activeItem = ref({});

    function close() {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        props
      );
      emit('update:popupShow', false);
    }

    const handleClick = (item) => {
      activeItem.value = item;
      // emit('tabClick', item);
    };

    const confirm = () => {
      emit('tabClick', activeItem.value);
      close();
    };

    watch(
      () => props.popupShow,
      (val) => {
        if (val) {
          const index = props.peopleList.findIndex(
            (item) => item.contactorId === props.activeId
          );
          activeItem.value = props.peopleList[index];
        }
      }
    );

    return {
      close,
      handleClick,
      confirm,
      activeItem,
    };
  },
});
</script>
<style lang="less" scoped>
.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 11px;
  left: 40%;
  width: 54%;
  font-size: 16px;
  > div:last-child {
    color: #0091ff;
  }
}
.content-wrap {
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
  height: calc(100% - 48px);
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 210rpx;
    height: 80rpx;
    margin: 15rpx;
    background: #f5f6f7;
    border: 1px solid transparent;
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
    border: 1px solid #0091ff;
    color: #0091ff;
  }
}
</style>
