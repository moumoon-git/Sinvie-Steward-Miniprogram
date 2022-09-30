<template>
  <van-popup
    :show="show"
    round
    position="bottom"
    @click-overlay="handleClickOverlay"
  >
    <view class="PopupEditProjectsLaborHours">
      <header class="PopupEditProjectsLaborHours__header">
        <view class="PopupEditProjectsLaborHours__header__left">
          <van-icon name="cross" @click="handleClickOverlay" />
        </view>
        <view class="PopupEditProjectsLaborHours__header__center">
          {{ target.thirdTargetName }}
        </view>
        <view
          class="PopupEditProjectsLaborHours__header__right"
          @click="handleSubmit"
        >
          确定
        </view>
      </header>
      <main v-if="target" class="PopupEditProjectsLaborHours__main">
        <ProjectThirdTarget
          ref="editProjectThirdTargetRef"
          :projectThirdTarget="target"
          :isDeclareAgain="true"
          :formStatus="'edit'"
          class="projectThirdTarget"
        />
      </main>
    </view>
    <van-notify ref="vanNotifyref" id="van-notify" />
  </van-popup>
</template>

<script>
import { defineComponent } from 'vue';
import ProjectThirdTarget from '../../components/ProjectsLaborHoursItem/components/ProjectThirdTargets/ProjectThirdTarget.vue';
import { saveWorkingHour } from '../../assets/js/api.js';
export default defineComponent({
  name: 'PopupEditProjectsLaborHours',
  components: {
    ProjectThirdTarget,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    target: {
      type: Object,
      default: () => ({}),
    },
    fallInTime: {
      type: String,
      default: ''
    },
    laborHoursDayList: {
      type: Array,
      default: () => [],
    },
    activeDateIndex: {
      type: String,
      default: new Date().getDate() - 1,
    },
  },
  data() {
    return {};
  },
  watch: {
    // target: {
    //   handler(newVal) {
    //     console.log('监听-target', newVal)
    //   },
    //   deep: true,
    //   immediate: true,
    // }
  },
  computed: {},
  onLoad() {},
  onShow() {},
  mounted() {},
  methods: {
    handleClickOverlay() {
      this.$emit('close');
    },
    initData() {
      setTimeout(() => {
        this.$refs.editProjectThirdTargetRef.initData();
      });
    },
    async handleSubmit() {
      const thirdTargetObj =
        this.$refs.editProjectThirdTargetRef.getProjectThirdTargetObj();
      const data = {
        id: thirdTargetObj.workingHour.id, // 工时id
        projectId: thirdTargetObj.projectId, // 项目id
        thirdTargetId: thirdTargetObj.id, // 目标id
        achievement: thirdTargetObj.workingHour.achievement, // 工作内容
        timeConsuming: thirdTargetObj.workingHour.timeConsuming, // 耗时
        selfAssessment: thirdTargetObj.workingHour.selfAssessment, // 自评
        fallInTime: this.fallInTime ? this.fallInTime : `${this.laborHoursDayList[this.activeDateIndex].year}-${
          this.laborHoursDayList[this.activeDateIndex].month
        }-${this.laborHoursDayList[this.activeDateIndex].day}`, // 填报时间
        picIds: thirdTargetObj.workingHour.picIds || [],
        state: 1, // 重新申报的数据，状态要改成1（待反馈）
        reviewContactorId: thirdTargetObj.mailContactorVO.id || '', // 审批人id
      };
      // 提交，提交需至少存在一个项目，且该项目至少存在一个动作，且该动作的必填项已完成填报后才可提交，否则统一提示用户“请填报完整申报单”
      if (!data.achievement || !data.selfAssessment || !data.timeConsuming) {
        wx.showToast({
          title: '请正确填报',
          icon: 'error',
        });
        return;
      }
      const result = await saveWorkingHour([data]);
      if (result.data.code === 200) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        });
        this.$emit('refresh');
        this.$emit('close');
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'error',
        });
        // this.$refs.vanNotifyref.setData({
        //   type: 'danger',
        //   message: result.data.message || result.data.msg || '保存失败',
        //   show: true,
        // });
      }
    },
  },
});
</script>

<style lang="less">
.PopupEditProjectsLaborHours {
  width: 100vw;
  // height: 70vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  &__header {
    width: 100%;
    height: 100rpx;
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    align-items: center;
    justify-content: space-between;
    padding: 0 40rpx;
    box-sizing: border-box;
    &__left {
      color: #666666;
      font-size: 38rpx;
    }
    &__center {
      text-align: center;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 54rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__right {
      text-align: right;
      margin: 0;
      padding: 0;
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
  }
}
</style>
