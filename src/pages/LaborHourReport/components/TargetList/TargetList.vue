<template>
  <view class="TargetList">
    <template v-if="loading">
      <Loading />
    </template>
    <template v-else>
      <template v-if="thirdLevelList.length > 0">
        <view
          v-for="(item, index) in thirdLevelList"
          :key="item.id"
          :class="[
            'list-item-wrapper',
            { 'list-item-wrapper--active': item.checked },
            { 'list-item-wrapper--disabled': item.disabled },
          ]"
          @click="handleSelectThirdLevel(item)"
        >
          <text :class="['list-item-wrapper__left']">{{
            item.thirdTargetName
          }}</text>
          <view class="list-item-wrapper__right">
            <view
              :class="[
                'checkbox',
                { 'checkbox-checked': item.checked },
                { 'checkbox-disabled': item.disabled },
              ]"
            >
              <van-icon v-show="item.checked" name="success" />
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="TargetList--empty">
          <image
            data-content="暂无目标"
            mode="aspectFit"
            src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-empty.svg"
            class="empty"
          ></image>
        </view>
      </template>
    </template>
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import { getTargets } from '../../assets/js/api.js';
import Loading from '../../../../components/loading/loading.vue';
export default defineComponent({
  name: 'SvPopupTabPicker',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    projectId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      thirdTargetIds: [], // 三级目标id
      thirdLevelList: [], // 三级
      loading: true,
    };
  },
  watch: {
    // 监听 projectId
    projectId: {
      handler(newVal) {
        // 获取三级目标
        this.handleGetThirdTargets(newVal);
      },
      immediate: true,
      deep: true,
    },
    // 监听父组件传入的值
    value: {
      handler(newVal) {
        this.thirdTargetIds = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    Loading
  },
  computed: {},
  onLoad() {},
  onShow() {},
  mounted() {},
  methods: {
    /**
     * @description 根据项目获取三级目标
     */
    async handleGetThirdTargets(id) {
      // 测试数据
      // const index = this.testProjectList.findIndex((el) => el.id === id);
      // this.thirdLevelList = this.testProjectList[index].targets.map((el) => {
      //     const index =
      //       this.thirdTargetIds.length > 0
      //         ? this.thirdTargetIds.findIndex((id) => id === el.id)
      //         : -1;
      //     console.log(index);
      //     return {
      //       ...el,
      //       checked: index > -1,
      //     };
      //   });
      this.loading = true;
      const result = await getTargets(id);
      if (result.data.code === 200) {
        if (!result.data.data) {
          this.thirdLevelList = [];
          return;
        }
        // 默认选中
        this.thirdLevelList = result.data.data.map((el) => {
          const index =
            this.thirdTargetIds.length > 0
              ? this.thirdTargetIds.findIndex((id) => id === el.id)
              : -1;
          return {
            ...el,
            checked: index > -1,
            disabled: index > -1, //  若表单中已经选了该项目，则禁用不能反选
          };
        });
      } else {
        wx.showToast({
          title: '获取目标失败',
          icon: 'error',
        });
      }
      this.loading = false;
    },
    /**
     * @description 选三级
     */
    handleSelectThirdLevel(item) {
      // 若表单中已经选了该项目，则不能反选
      if (!item.disabled) {
        item.checked = !item.checked;
      }
      // 通过checked为true过滤出选中的三级目标
      const filterData = this.thirdLevelList.filter((el) => el.checked);
      // 三级目标id
      this.thirdTargetIds =
        filterData.length > 0 ? filterData.map((el) => el.id) : [];
      // 将选中的三级目标传给父级组件
      this.$emit('update', filterData);
    },
  },
});
</script>

<style lang="less">
.TargetList {
  width: calc(100vw - 80rpx);
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 40rpx;

  &::-webkit-scrollbar {
    background: transparent;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
  }
  van-checkbox-group {
    width: 100%;
    height: 100%;
  }

  .level-wrapper {
    widows: 100%;
    display: flex;
    align-items: center;
    height: 60rpx;
    margin-bottom: 10rpx;

    .level-item {
      width: 33%;
      display: flex;
      flex-direction: column;
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
      line-height: 40px;

      &::after {
        content: '';
        width: 47rpx;
        height: 6rpx;
        background: transparent;
      }
      &--active {
        font-weight: bolder;
        &::after {
          content: '';
          width: 47rpx;
          height: 6rpx;
          background: linear-gradient(90deg, #2b80ff 0%, #65bcff 100%);
        }
      }
    }
  }
  .list-item-wrapper {
    width: 100%;
    min-height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15rpx 0;
    box-sizing: border-box;
    flex-shrink: 0;
    border-bottom: 1rpx solid #f7f7f7;

    &--active {
      color: #0091ff;
    }
    &--disabled {
      color: #666;
    }

    &__left {
      flex: 1;
    }

    &__right {
      flex-shrink: 0;
      width: 40rpx;
      height: 40rpx;
    }

    // 复选框
    .checkbox {
      width: 44rpx;
      height: 44rpx;
      line-height: 44rpx;
      text-align: center;
    }

    .checkbox-checked {
      color: #0191fd;
    }
    .checkbox-disabled {
      color: #666;
    }
  }

  &--empty {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 80rpx;
    .empty {
      width: 198rpx;
      height: 206rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      &::after {
        content: attr(data-content);
        height: 28rpx;
        display: block;
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
        line-height: 28rpx;
      }
    }
  }
}
</style>
