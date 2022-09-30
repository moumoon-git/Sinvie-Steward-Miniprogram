<template>
  <view
    :class="['targetItem', { 'targetItem--declare-again': isDeclareAgain }]"
  >
    <view v-if="!isDeclareAgain" class="targetItem__header">
      <image
        v-if="formStatus !== 'view'"
        hover-class="button-hover-class"
        mode="widthFix"
        :src="
          projectThirdTargetObj.isFavorite === 1
            ? 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-like-active.svg'
            : 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-like.svg'
        "
        @click="handleCollectTarget"
      ></image>
      <view class="target-name">{{
        projectThirdTargetObj.thirdTargetName
      }}</view>
      <view v-if="formStatus === 'view'" class="target-status">
        <image
          v-if="projectThirdTargetObj.workingHour.state === 1"
          mode="widthFix"
          src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-to-feedback.png"
        ></image>
        <image
          v-if="projectThirdTargetObj.workingHour.state === 2"
          mode="widthFix"
          src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-feedback.png"
        ></image>
        <image
          v-if="projectThirdTargetObj.workingHour.state === 3"
          mode="widthFix"
          src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-returned.png"
        ></image>
      </view>
      <view v-else hover-class="button-hover-class" class="target-operation">
        <van-icon name="cross" @click="handleDeleteThirdTarget" />
      </view>
    </view>
    <view class="targetItem__body">
      <view class="van-form-item van-form-item--vertical">
        <view
          :class="[
            'van-form-item__label ',
            { 'is-required': formStatus !== 'view' },
          ]"
        >
          工作内容：
        </view>
        <view v-if="formStatus === 'view'" class="van-form-item__value">
          {{ projectThirdTargetObj.workingHour.achievement }}
        </view>
        <van-field
          v-else
          :value="projectThirdTargetObj.workingHour.achievement"
          placeholder="请输入工作内容"
          autosize
          type="textarea"
          clearable
          :border="false"
          :autosize="true"
          custom-style="padding-bottom: 0;"
          input-class="van-form-item__input"
          @change="handleChangeAchievement($event, index2)"
        />
      </view>
      <view
        :class="[
          'van-form-item ',
          formStatus === 'view'
            ? 'van-form-item--horizontal'
            : 'van-form-item--vertical',
        ]"
      >
        <view
          :class="[
            'van-form-item__label ',
            { 'is-required': formStatus !== 'view' },
          ]"
        >
          使用工时：
        </view>
        <view v-if="formStatus === 'view'" class="van-form-item__value"
          >{{ projectThirdTargetObj.workingHour.timeConsuming }}小时</view
        >
        <view v-else class="labor-hour">
          <view
            v-for="item in timeConsumingOptions"
            :key="item"
            :class="[
              item === '自定义' ? 'hour-style-2' : 'hour-style-1',
              {
                'hour-style-active': item === activeTimeConsuming,
              },
            ]"
            @click="handleClickTimeConsuming(item)"
          >
            <text>{{ item === '自定义' ? item : `${item}小时` }}</text>
            <text v-if="item === '自定义'">(小时)</text>
            <van-field
              v-if="
                item === '自定义' &&
                (item === activeTimeConsuming || customizedTime)
              "
              :value="customizedTime"
              type="digit"
              :custom-style="`${
                item === activeTimeConsuming
                  ? 'background:#F4FBFF;'
                  : 'background:#F5F6F7;'
              }padding: 15rpx;height: 72rpx;`"
              :focus="true"
              :maxlength="customizedTimeLength"
              @input="handleInputCustomizedTime"
              @blur="handleBlurCustomizedTime"
            />
          </view>
        </view>
      </view>
      <view
        :class="[
          'van-form-item ',
          formStatus === 'view'
            ? 'van-form-item--horizontal'
            : 'van-form-item--vertical',
        ]"
      >
        <view
          :class="[
            'van-form-item__label ',
            { 'is-required': formStatus !== 'view' },
          ]"
        >
          工作自评：
        </view>
        <view v-if="formStatus === 'view'" class="van-form-item__value">{{
          selfAssessmentTxt
        }}</view>
        <view v-else class="van-rate-wrapper">
          <van-rate
            :value="projectThirdTargetObj.workingHour.selfAssessment"
            :size="30"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
            @change="handleRateChange($event, index2)"
          />
          <text>{{ selfAssessmentTxt }}</text>
        </view>
      </view>
      <view class="van-form-item van-form-item--vertical">
        <view :class="['van-form-item__label ']"> 照片上传： </view>
        <view class="image-upload">
          <upload
            :fileList="fileList"
            :showUpload="formStatus !== 'view'"
            @input="handleUploadInput"
          ></upload>
        </view>
      </view>

      <!-- 反馈结果 -->
      <view
        v-if="
          !isDeclareAgain &&
          (projectThirdTargetObj.workingHour.state === 2 ||
            projectThirdTargetObj.workingHour.state === 3)
        "
        class="feedback-result"
      >
        <view class="feedback-result__title">反馈结果</view>
        <view class="van-form-item van-form-item--horizontal">
          <view class="van-form-item__label"> 工作效率： </view>
          <view class="van-form-item__value">{{
            workEfficiencyTxt || '-'
          }}</view>
        </view>
        <view class="van-form-item van-form-item--horizontal">
          <view class="van-form-item__label"> 任务完成度： </view>
          <view class="van-form-item__value">{{
            taskCompletionTxt || '-'
          }}</view>
        </view>
        <view class="van-form-item van-form-item--horizontal">
          <view class="van-form-item__label"> 任务满意度： </view>
          <view class="van-form-item__value">{{
            taskSatisfactionTxt || '-'
          }}</view>
        </view>
        <view class="van-form-item van-form-item--vertical">
          <view class="van-form-item__label"> 反馈意见： </view>
          <view class="van-form-item__value">
            {{ projectThirdTargetObj.workingHour.reviewComment || '-' }}
          </view>
        </view>
      </view>
    </view>
    <view class="targetItem__footer">
      <view class="targetItem__footer__left">
        <image
          mode="widthFix"
          src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-man.svg"
          class="icon-man"
        ></image>
        <view class="target-leader">
          审批人：{{
            projectThirdTargetObj.mailContactorVO
              ? `${projectThirdTargetObj.mailContactorVO.contactName}（${
                  projectThirdTargetObj.mailContactorVO.projectPosition ||
                  projectThirdTargetObj.mailContactorVO.deparmentName
                }）`
              : '-'
          }}
        </view>
      </view>
      <view
        v-if="projectThirdTargetObj.workingHour.id && !isDeclareAgain"
        class="targetItem__footer__right"
      >
        <van-button type="default" @click="handleDeleteProjects">
          撤销
        </van-button>
        <view class="division"></view>
        <van-button type="default" @click="handleDeclareAgain">
          重新申报
        </van-button>
      </view>
    </view>
    <van-notify ref="vanNotifyref" id="van-notify" />
    
    <van-dialog
      class="dialog"
      ref="vanDialogRef"
      :show="vanDialog.show"
      :title="vanDialog.title"
      :message="vanDialog.message"
      :confirm-button-color="'#F85B47'"
      :confirm-button-text="'确定'"
      :cancel-button-text="'取消'"
      :show-cancel-button="true"
      @confirm="handleConfirmDelete"
      @cancel="handleVanDialogCancel"
    >
    </van-dialog>
  </view>
</template>
<script>
import { defineComponent } from 'vue';
import upload from '../../../../../../components/upload/upload.vue';
import { handleOnlyNumberInput } from '../../../../assets/js/useHook';
import {
  deleteWorkingHours
} from '../../../../assets/js/api.js';
export default defineComponent({
  name: 'projectThirdTarget',
  components: {
    upload,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    projectThirdTarget: {
      type: Object,
      default: () => ({}),
    },
    // 重新申报
    isDeclareAgain: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // van-dialog 弹窗配置
      vanDialog: {
        title: '提示',
        message: '是否撤销该工时填报',
        show: false,
      },
      formStatus: 'edit',
      projectThirdTargetObj: {
        id: '',
        projectId: '', // 项目id
        firstTargetId: '', // 一级项目id
        secondTargetId: '', // 二级目标id
        thirdTargetName: '', // 三级目标id
        mailContactorVO: {}, // 审批人信息
        workingHour: {
          id: '', // 工时id
          projectId: '', // 项目id
          thirdTargetId: '', // 目标id
          achievement: '', // 工作内容
          timeConsuming: 0, // 耗时
          selfAssessment: 4, // 自评
          taskCompletion: 0, // 任务完成度
          taskSatisfaction: 0, // 任务满意度
          workEfficiency: 0, // 工作效率
          reviewComment: '', // 审核意见
          reviewContactorId: '', // 审核人id
          fallInTime: '', // 填报时间
          state: null, // 状态（1：待反馈，2：已反馈，3：已退回）（新增可不传）
          picIds: [], // 图片id数组
          attachments: [], // 图片
        }, // 工时
      },
      // 星值名称-自评
      selfAssessmentTxtOptions: ['较差', '一般', '良好', '优秀', '卓越'],
      // 星值名称-任务完成度
      taskCompletionTxtOptions: [
        '非常低效',
        '低效',
        '低于预期',
        '符合预期',
        '超预期',
      ],
      // 星值名称-工作效率
      workEfficiencyTxtOptions: ['非常低效', '低效', '一般', '正常', '高效'],
      // 星值名称-任务满意度
      taskSatisfactionTxtOptions: ['较差', '一般', '良好', '优秀', '卓越'],
      timeConsumingOptions: [1, 2, 3, 4, '自定义', 5, 6, 7, 8],
      fileList: [],
      // 当前选中的耗时
      activeTimeConsuming: null,
      customizedTime: null, // 自定义工时
      customizedTimeLength: 4, // 自定义工时输入的最大长度
    };
  },
  computed: {
    // 自评
    selfAssessmentTxt() {
      return this.selfAssessmentTxtOptions[
        this.projectThirdTargetObj.workingHour.selfAssessment - 1
      ];
    },
    // 任务完成度
    taskCompletionTxt() {
      return this.taskCompletionTxtOptions[
        this.projectThirdTargetObj.workingHour.taskCompletion - 1
      ];
    },
    // 工作效率
    workEfficiencyTxt() {
      return this.workEfficiencyTxtOptions[
        this.projectThirdTargetObj.workingHour.workEfficiency - 1
      ];
    },
    // 任务满意度
    taskSatisfactionTxt() {
      return this.taskSatisfactionTxtOptions[
        this.projectThirdTargetObj.workingHour.taskSatisfaction - 1
      ];
    },
  },
  watch: {
    projectThirdTarget: {
      handler(newVal, oldVal) {
        if (!newVal) {
          return;
        }
        this.projectThirdTargetObj = newVal;
        if (!oldVal) {
          // 耗时赋值
          const { timeConsuming } = this.projectThirdTargetObj.workingHour;
          if ([1, 2, 3, 4, 5, 6, 7, 8].includes(timeConsuming)) {
            this.activeTimeConsuming = timeConsuming;
          } else {
            // 自定义
            this.customizedTime = timeConsuming || null;
            this.activeTimeConsuming = timeConsuming ? '自定义' : null;
          }
        }

        // 如果有workingHour.id，说明数据已入数据库
        this.formStatus =
          !newVal.workingHour || !newVal.workingHour.id || this.isDeclareAgain
            ? 'edit'
            : 'view';

        // 图片
        if (
          this.projectThirdTargetObj.workingHour.attachments &&
          this.projectThirdTargetObj.workingHour.attachments.length > 0
        ) {
          this.fileList = this.projectThirdTargetObj.workingHour.attachments;
          this.projectThirdTargetObj.workingHour.picIds =
            this.projectThirdTargetObj.workingHour.attachments.map(
              (el) => el.id
            );
        } else {
          this.fileList = [];
          this.projectThirdTargetObj.workingHour.picIds = [];
        }
      },
      immediate: true,
      deep: true,
    },
    'projectThirdTargetObj.workingHour.timeConsuming': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$emit('update-workingHour', this.index);
        }
      },
      immediate: true,
      deep: true,
    },
    'projectThirdTargetObj.workingHour': {
      handler(newVal) {
        this.$emit('update', newVal, this.index);
      },
      immediate: true,
      deep: true,
    },
  },
  onLoad() {},
  onShow() {},
  mounted() {},
  methods: {
    /**
     * @description van-dialog cancel 方法
     */
    handleVanDialogCancel() {
      this.vanDialog.show = false;
    },
    /**
     * @description 删除项目
     */
    async handleDeleteProjects() {
      this.vanDialog.show = true
    },

    /**
     * @description 确认删除
     */
    async handleConfirmDelete() {
      const ids = [this.projectThirdTargetObj.workingHour.id];
      const result = await deleteWorkingHours(ids)
      if (result.data.code === 200) {
        wx.showToast({
          title: '撤销成功',
          icon: 'success',
        });
        this.$emit('refresh')
      }
    },

    initData() {
      Object.assign(this.$data, this.$options.data.call(this));
    },
    /**
     * @decription 更新上传的文件
     */
    handleUploadInput(val) {
      this.projectThirdTargetObj.workingHour.attachments = val;
    },
    handleCollectTarget() {
      this.$emit('collect-target', this.projectThirdTargetObj, this.index);
    },
    handleDeleteThirdTarget() {
      this.$emit('delete-third-target', this.index);
    },
    closedFunction() {
      wx.showToast({
        title: '功能暂未开放',
        icon: 'none',
      });
    },
    getProjectThirdTargetObj() {
      return this.projectThirdTargetObj;
    },
    /**
     * @description 更新工作内容
     */
    handleChangeAchievement(event) {
      this.projectThirdTargetObj.workingHour.achievement = event.detail;
    },
    /**
     * @description 点击工时
     */
    handleClickTimeConsuming(time) {
      // 当前选中的耗时
      this.activeTimeConsuming = time;
      this.projectThirdTargetObj.workingHour.timeConsuming =
        time === '自定义' ? this.customizedTime || 0 : time;
    },
    /**
     * @description 评分星级改变触发
     */
    handleRateChange(event) {
      this.projectThirdTargetObj.workingHour.selfAssessment = event.detail;
    },
    /**
     * @description 输入自定义工时触发
     */
    handleInputCustomizedTime(event) {
      if (!event.detail) {
        this.customizedTime = '';
      } else {
        // 只能输入数字
        const val = handleOnlyNumberInput(event.detail);
        this.customizedTime = Number(val);
        this.customizedTime = event.detail ? Number(event.detail) : null;
        if (this.customizedTime > 24 || this.customizedTime < 0) {
          wx.showToast({
            title: '输入工时有误',
            icon: 'error',
          });
          return;
        }
        // 如果输入的数字加上小数点的长度为3，且小数点后有两位小数，则只能给输入三位数字
        if (
          event.detail.length === 3 &&
          event.detail.split('.')[1].length >= 1
        ) {
          this.customizedTimeLength = 3;
        } else if (
          event.detail.length === 4 &&
          event.detail.split('.')[1].length > 1
        ) {
          this.customizedTimeLength = 3;
          wx.showToast({
            title: '请保留一位小数',
            icon: 'error',
          });
        } else {
          this.customizedTimeLength = 4;
        }
        // 只保留一位小数
        if (
          event.detail.indexOf('.') > -1 &&
          event.detail.split('.')[1].length > 1
        ) {
          this.customizedTime = Number(this.customizedTime.toFixed(1));
        }
      }
      this.projectThirdTargetObj.workingHour.timeConsuming =
        this.customizedTime;
    },
    handleBlurCustomizedTime(event) {
      if (this.customizedTime === 0) {
        wx.showToast({
          title: '输入工时有误',
          icon: 'error',
        });
        return;
      }
    },
    /**
     * @description 重新申报
     */
    handleDeclareAgain() {
      this.$emit('declare-again', this.projectThirdTargetObj, this.index);
    },
  },
});
</script>

<style lang="less" scoped>
@import './assets/styles/projectThirdTarget.less';
</style>
<style lang="less">
.targetItem {
  .van-form-item__input {
    padding: 20rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 42rpx;
    min-height: 120rpx;
    background: #f5f6f7;
  }
  .targetItem__footer__right {
    width: 200rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .division {
      width: 1rpx;
      height: 23rpx;
      background: #DDDDDD;
    }
    button {
      padding: 0;
      border: none;
      color: #0091ff;
    }
  }
}
</style>
