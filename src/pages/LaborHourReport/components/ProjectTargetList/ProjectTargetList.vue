<template>
  <van-popup
    :show="show"
    round
    position="bottom"
    @click-overlay="handleClickOverlay"
  >
    <view class="SvPopupPicker">
      <header class="SvPopupPicker__header">
        <view class="SvPopupPicker__header__left">
          <van-icon :name="icon" @click="handleBackorClose" />
        </view>
        <view class="SvPopupPicker__header__center"> {{ title }} </view>
        <view class="SvPopupPicker__header__right" @click="handleSumit">
          确定
        </view>
      </header>
      <template v-if="projectOrTarget === 'project'">
        <main v-if="projectList.length > 0" class="SvPopupPicker__main">
          <view
            v-for="(item, index) in projectList"
            :key="item.id"
            :class="[
              'list-item-wrapper',
              {
                'list-item-wrapper--active':
                  selectedData.project.id === item.id,
              },
            ]"
            @click="handleSelectThirdTarget(item)"
          >
            <text>{{ item.projectName }}</text>
            <van-icon class="list-item-wrapper__right" name="arrow" />
          </view>
        </main>
      </template>
      <template v-else>
        <TargetList
          :value="thirdTargetIds"
          :project-id="selectedData.project.id"
          class="targetList"
          @update="handleUpdateThirdTarget"
        />
      </template>
    </view>
  </van-popup>
</template>

<script>
import { defineComponent } from 'vue';
import TargetList from '../TargetList/TargetList.vue';
import { getProjectList, getThirdTargets } from '../../assets/js/api.js';
export default defineComponent({
  name: 'ProjectTargetList',
  components: {
    TargetList,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    // 项目或者目标
    defaultModule: {
      type: String,
      default: 'project', // project or target
    },
  },
  data() {
    return {
      icon: 'cross',
      projectOrTarget: 'project', // 项目或者目标
      projectList: [], // 项目分组
      thirdTargetIds: [], // 三级id
      // 选中的数据
      selectedData: {
        project: {}, // 当前选中的项目
        thirdTargets: [], // 三级目标
      },
      title: '请选择工时项目',
      testProjectList: [
        {
          id: 1,
          projectName: '荔城项目',
        },
        {
          id: 2,
          projectName: '增城项目',
        },
        {
          id: 3,
          projectName: '南海项目',
        },
      ],
      selectedProjects: [],
    };
  },
  watch: {
    // 监听show
    show: {
      handler(newVal) {
        if (newVal) {
          this.projectOrTarget = this.defaultModule;
          this.icon = 'cross';
        }
      },
      immediate: true,
      deep: true,
    },
    // 监听 projectOrTarget
    projectOrTarget: {
      handler(newVal) {
        if (newVal === 'project') {
          this.title = '请选择工时项目';
        } else {
          this.title = '请选择项目目标';
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  onLoad() {},
  onShow() {},
  mounted() {
    // 获取项目分组
    this.handleGetProjectList();
  },
  methods: {
    /**
     * @description 打开三级目标
     * @param projectOrTarget 项目或目标
     * @param val 选中的项目和目标
     */
    setData(val, projectOrTarget) {
      this.selectedData = val;
      this.thirdTargetIds =
        val.thirdTargets && val.thirdTargets.length > 0 ? val.thirdTargets.map((el) => el.id) : [];
      this.projectOrTarget = projectOrTarget;
      this.handleGetProjectList();
    },
    /**
     * @description 更新选中的三级目标数据
     */
    handleUpdateThirdTarget(val) {
      this.selectedData.thirdTargets = val;
      this.thirdTargetIds = val.length > 0 ? val.map((el) => el.id) : [];
    },
    /**
     * @description 项目分组返回树形结构
     */
    async handleGetProjectList() {
      // 测试数据
      // this.projectList = this.testProjectList.map((el) => ({
      //   ...el,
      //   checked: false,
      // }))
      // return;
      const result = await getProjectList();
      // console.log('项目分组返回树形结构', result);
      if (result.data.code === 200) {
        this.projectList = result.data.data
          ? result.data.data.map((el) => ({
              ...el,
              checked: false,
            }))
          : [];
      } else {
        wx.showToast({
          title: '获取项目失败',
          icon: 'error',
        });
      }
    },
    /**
     * @description 点击遮罩层关闭
     */
    handleClickOverlay() {
      this.$emit('close');
      // 初始化
      Object.assign(this.$data.selectedData, this.$options.data.call(this).selectedData);
      Object.assign(this.$data.selectedProjects, this.$options.data.call(this).selectedProjects);
    },
    /**
     * @description 返回或者关闭
     */
    handleBackorClose() {
      if (this.icon === 'cross') {
        this.handleClickOverlay();
      } else {
        this.projectOrTarget = 'project';
        this.icon = 'cross'
      }
    },
    /**
     * @description 提交
     */
    handleSumit() {
      // 有三级目标时提交
      if (this.selectedData.thirdTargets && this.selectedData.thirdTargets.length > 0) {
        this.$emit('submit', this.selectedData);
      }
      this.handleClickOverlay();
    },
    /**
     * @description 切换选择
     */
    handleSelectThirdTarget(item) {
      if (this.selectedProjects.length > 0) {
        // 若是从点击“添加工时”按钮进来，要将已选的项目过滤赋值给子组件
        const filterData = this.selectedProjects.filter((el) => el.project.id === item.id)
        this.thirdTargetIds = filterData.length > 0 ? filterData[0].thirdTargets : []
      }
      this.selectedData.project = item;
      this.projectOrTarget = 'target';
      this.icon = 'arrow-left';
    },
  },
});
</script>

<style lang="less">
.SvPopupPicker {
  width: 100vw;
  height: 60vh;
  display: flex;
  align-items: center;
  flex-direction: column;

  &__header {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40rpx;
    box-sizing: border-box;
    flex-shrink: 0;
    &__left {
      color: #666666;
      font-size: 38rpx;
    }
    &__center {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 54rpx;
    }
    &__right {
      color: #0091ff;
      border: none;
      font-size: 32rpx;
      font-weight: 400;
    }
  }
  &__main {
    width: 100%;
    flex: 1;
    overflow-y: scroll;
    padding: 0 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    van-checkbox-group {
      width: 100%;
      height: 100%;
    }

    .list-item-wrapper {
      width: calc(100% - 80rpx);
      min-height: 90rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15rpx 0;
      box-sizing: border-box;
      border-bottom: 1rpx solid #f7f7f7;
      .checkbox {
        border: 1rpx solid #666366;
        width: 44rpx;
        height: 44rpx;
        line-height: 44rpx;
        text-align: center;
        border-radius: 50%;
      }

      .checkbox-checked {
        border: 1rpx solid #0191fd;
        background: #0191fd;
        color: #ffffff;
      }

      &--active {
        color: #0091ff;
      }
    }
  }

  .targetList {
    overflow: scroll;
    height: calc(100% - 100rpx);
  }
}
</style>
