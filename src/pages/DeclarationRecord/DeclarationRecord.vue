<template>
  <view class="DeclarationRecord">
    <van-tabs :active="active" animated @change="handleGetProjectsByDate">
      <van-tab
        v-for="(item, index) in feedbackStatistics"
        :key="item.name"
        :name="item.params"
        :title="item.name"
        :info="item.count"
      >
        <template v-if="isLoading">
          <Loading />
        </template>
        <template v-else>
          <view v-if="recordList.length > 0" class="DeclarationRecord__content">
            <view v-for="(item2, index2) in recordList" :key="index2">
              <view class="DeclarationRecord__content__record-time">
                <image
                  mode="widthFix"
                  src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-division.svg"
                  class="icon-division"
                ></image>
                <text class="fallInTime">{{ item2.date }}</text>
                <image
                  mode="widthFix"
                  src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-division.svg"
                  class="icon-division reverse"
                ></image>
              </view>
              <ProjectsLaborHoursItem
                v-for="(item3, index3) in item2.records"
                :key="index3"
                ref="projectsLaborHoursItemRef"
                :index="index3"
                :project="item3"
                @declare-again="handleDeclareAgain(arguments)"
              />
            </view>
          </view>
          <view v-else class="DeclarationRecord__content-empty">
            <image
              data-content="暂无记录"
              mode="aspectFit"
              src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-empty.svg"
              class="empty"
            ></image>
          </view>
        </template>
      </van-tab>
    </van-tabs>
    
    <PopupEditProjectsLaborHours
      ref="PopupEditProjectsLaborHoursRef"
      :show="showEditLaborHours"
      :target="editedTarget"
      :fallInTime="fallInTime"
      @close="handleClosePopup"
      @refresh="handleGetProjectsByDate"
    />
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import ProjectsLaborHoursItem from '../LaborHourReport/components/ProjectsLaborHoursItem/ProjectsLaborHoursItem.vue';
import PopupEditProjectsLaborHours from '../LaborHourReport/components/PopupEditProjectsLaborHours/PopupEditProjectsLaborHours.vue';
import {
  getCurrentMonth,
  getCurrentDate,
} from '../LaborHourReport/assets/js/useHook.js';
import {
  recordByState,
  countByMonth,
} from '../LaborHourReport/assets/js/api.js';
import Loading from '../../components/loading/loading.vue';

export default defineComponent({
  name: 'DeclarationRecord',
  data() {
    return {
      fallInTime: '',
      // 重新申报
      showEditLaborHours: false,
      isLoading: true,
      active: 0,
      // 我的项目
      recordList: [],
      tabs: ['待反馈', '已反馈', '已退回'],
      // 反馈统计
      feedbackStatistics: [
        {
          code: 'feedback',
          name: '已反馈',
          count: 0,
          params: 2,
        },
        {
          code: 'noFeedback',
          name: '待反馈',
          count: 0,
          params: 1,
        },
        {
          code: 'returned',
          name: '已退回',
          count: 0,
          params: 3,
        },
      ],
      // 被编辑的目标
      editedTarget: null,
      // 被编辑的目标下标
      editedTargetIndex: 0,
    };
  },
  components: {
    PopupEditProjectsLaborHours,
    ProjectsLaborHoursItem,
    Loading,
  },
  computed: {},
  onLoad() {},
  onShow() {},
  mounted() {
    this.active = this.feedbackStatistics[0].params
    this.handleCountByMonth();
    this.handleGetProjectsByDate();
  },
  methods: {
    
    /**
     * @description 重新申报
     */
    handleDeclareAgain([val, index]) {
      this.fallInTime = val.workingHour.fallInTime;
      this.showEditLaborHours = true;
      this.editedTarget = val;
      this.editedTargetIndex = index;
    },
    /**
     * @description 关闭重新申报弹窗
     */
    handleClosePopup() {
      this.showEditLaborHours = false;
      setTimeout(() => {
        this.editedTarget = {}; // 初始化，不然重新申报的数据会有问题
      }, 200);
    },
    /**
     * @description 根据月份获取工时申报统计
     */
    async handleCountByMonth() {
      const month = getCurrentMonth();
      const result = await countByMonth(month);
      console.log('根据月份获取工时申报统计', result);
      if (result.data.code === 200) {
        const { feedback, noFeedback, returned } = result.data.data;
        this.feedbackStatistics[0].count = feedback;
        this.feedbackStatistics[1].count = noFeedback;
        this.feedbackStatistics[2].count = returned;
      } else {
        wx.showToast({
          title: '获取统计失败',
          icon: 'error',
        });
        this.feedbackStatistics[0].count = 0;
        this.feedbackStatistics[1].count = 0;
        this.feedbackStatistics[2].count = 0;
      }
    },
    /**
     * @description 申报记录
     */
    async handleGetProjectsByDate(event) {
      this.active = event ? event.detail.name : this.active;
      this.isLoading = true;
      this.recordList = [];
      const result = await recordByState({
        month: getCurrentMonth(),
        state: this.active, // 	状态（1：待反馈，2：已反馈，3：已退回）（新增可不传）
      });
      if (result.data.code === 200) {
        this.recordList = result.data.data;
        this.isLoading = false;
      } else {
        wx.showToast({
          title: result.data.message || result.data.msg || '获取记录失败',
          icon: 'error',
        });
        this.recordList = [];
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="less">
.DeclarationRecord {
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  .van-tab {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .van-info.tabs-index--van-tab__title__info {
    display: inline-block;
    padding: 0 10rpx;
    background: #ff6d49;
    border-radius: 17rpx;
    border: 2rpx solid #fa6400;
    font-size: 24rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    height: 38rpx;
    line-height: 33rpx;
    text-align: center;
  }
  .van-tab.van-tab--active {
    color: #333333;
  }
  * {
    box-sizing: border-box;
  }
  .count {
    width: auto;
    height: 30px;
    background: #ff6d49;
    border-radius: 17px;
    border: 2px solid #fa6400;
    padding: 0 10rpx;
  }

  &__content {
    flex: 1;
    padding-bottom: 20rpx;
    overflow-y: scroll;
    background: #F5F5F5;

    &__record-time {
      margin : 35rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon-division {
        width: 26rpx;
        height: 36rpx;
      }

      .icon-division.reverse {
        transform: rotate(180deg);
      }

      .fallInTime {
        margin: 0 16rpx;
      }
    }

    &-empty {
      width: 100%;
      height: 50vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .empty {
        width: 198rpx;
        height: 206rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
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
}
</style>
