<template>
  <view
    :class="[
      'ProjectsLaborHoursItem',
      { 'ProjectsLaborHoursItem--declare-again': isDeclareAgain },
    ]"
  >
    <view v-if="showTime" class="ProjectsLaborHoursItem-time">
      <image
        mode="widthFix"
        src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-division.svg"
        class="icon-division"
      ></image>
      <text class="fallInTime">{{ projectObj.fallInTime }}</text>
      <image
        mode="widthFix"
        src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-division.svg"
        class="icon-division reverse"
      ></image>
    </view>
    <view v-if="!isDeclareAgain" class="ProjectsLaborHoursItem__header">
      <view class="ProjectsLaborHoursItem__header__left">
        <image
          :data-project-index="`项目${index + 1}`"
          mode="widthFix"
          src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-bg.svg"
          class="project-index-bg"
        ></image>
        <view class="project-name">{{ projectObj.projectName }}</view>
      </view>
      <view
        v-if="formStatus !== 'view'"
        class="ProjectsLaborHoursItem__header__right"
      >
        <image
          mode="widthFix"
          :src="
            projectObj.isFavorite === 1
              ? 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-like-active.svg'
              : 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-like.svg'
          "
          @click="handleCollectProject()"
        ></image>
        <image
          hover-class="button-hover-class"
          mode="widthFix"
          src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-add-square.svg"
          @click="handleAddThirdTarget"
        ></image>
        <image
          hover-class="button-hover-class"
          mode="widthFix"
          src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-delete.svg"
          @click="handleRemoveProject"
        ></image>
      </view>
    </view>
    <view
      v-if="projectObj.projectThirdTargets.length > 0"
      class="ProjectsLaborHoursItem__main"
    >
      <ProjectThirdTarget
        v-for="(item, index2) in projectObj.projectThirdTargets"
        :key="item.id"
        :ref="`projectThirdTargetRef`"
        :index="index2"
        :projectThirdTarget="item"
        :isDeclareAgain="isDeclareAgain"
        class="projectThirdTarget"
        @update-workingHour="handleUpdateWorkingHour"
        @declare-again="handleDeclareAgain(arguments)"
        @delete-third-target="handleDeleteThirdTarget"
        @refresh="handleRefresh"
        @collect-target="handleCollectTarget(arguments)"
        @update="handleUpdateProjectTarget(arguments)"
      />
    </view>
    <view v-else class="ProjectsLaborHoursItem__main">
      <image
        data-content="暂无目标"
        mode="aspectFit"
        src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-empty.svg"
        class="empty"
      ></image>
    </view>
    <van-dialog
      ref="vandialogref"
      class="dialog"
      :show="vanDialog.show"
      :title="vanDialog.title"
      :message="vanDialog.message"
      :show-cancel-button="true"
      @cancel="handleVanDialogCancel"
      @confirm="handleVanDialogConfirm"
    />
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import ProjectThirdTarget from './components/ProjectThirdTargets/ProjectThirdTarget.vue';
import {
  addCollect,
  removeCollectTarget,
  removeCollectProject,
} from '../../assets/js/api';
export default defineComponent({
  name: 'ProjectsLaborHoursItem',
  components: {
    ProjectThirdTarget,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    // 项目数据
    project: {
      type: Object,
      default: () => ({}),
    },
    // 重新申报
    isDeclareAgain: {
      type: Boolean,
      default: false,
    },
    // 显示日期
    showTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      projectObj: {
        id: '', // 项目id
        projectName: '', // 项目名称
        projectThirdTargets: [],
        isFavorite: 0, // 收藏状态 1：已收藏
      },
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
      },
      // van-dialog 弹窗配置
      vanDialog: {
        title: '提示',
        message: '',
        show: false,
        delete: '', // 'project' or 'target'
      },
      // 即将被删除的目标index
      deletedTargetIndex: null,
    };
  },
  watch: {
    project: {
      handler(newVal) {
        if (!newVal) {
          return;
        }
        this.projectObj = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    formStatus() {
      if (this.projectObj.projectThirdTargets.length === 0 || this.projectObj.projectThirdTargets.filter((el) => !el.workingHour.id).length > 0) {
        return 'edit'
      } else {
        return 'view'
      }
    }
  },
  onLoad() {},
  onShow() {},
  mounted() {},
  methods: {
    handleRefresh() {
      this.$emit('refresh')
    },
    /**
     * @description 更新目标
     */
    handleUpdateProjectTarget([val, index]) {
      this.projectObj.projectThirdTargets[index].workingHour = val;
    },
    /**
     * @description 收藏目标
     */
    async handleCollectTarget([thirdTarget, index]) {
      // isFavorite:1 已收藏
      // 收藏/取消收藏目标
      const result =
        thirdTarget.isFavorite === 1
          ? await removeCollectTarget({
              projectId: this.project.id,
              ids: [String(thirdTarget.id)],
            })
          : await addCollect({
              projectId: this.project.id,
              thirdTargetId: thirdTarget.id,
            });
      if (result.data.code === 200) {
        if (thirdTarget.isFavorite !== 1) {
          wx.showToast({
            title: '目标已收藏',
            icon: 'success',
          });
        }
        this.projectObj.projectThirdTargets[index].isFavorite =
          this.projectObj.projectThirdTargets[index].isFavorite === 1 ? 0 : 1;
      } else {
        wx.showToast({
          title: `${thirdTarget.id.isFavorite === 1 ? '取消' : ''}收藏失败`,
          icon: 'error',
        });
      }
    },
    /**
     * @description 收藏项目
     */
    async handleCollectProject() {
      // 收藏/取消收藏项目
      const result =
        this.projectObj.isFavorite === 1
          ? await removeCollectProject([this.project.id])
          : await addCollect({
              projectId: this.project.id,
            });
      if (result.data.code === 200) {
        if (this.projectObj.isFavorite !== 1) {
          wx.showToast({
            title: '项目已收藏',
            icon: 'success',
          });
        }
        this.projectObj.isFavorite = this.projectObj.isFavorite === 1 ? 0 : 1;
      } else {
        wx.showToast({
          title: `${this.projectObj.isFavorite === 1 ? '取消' : ''}收藏失败`,
          icon: 'error',
        });
      }
    },
    /**
     * @description 移除项目
     */
    handleRemoveProject() {
      this.vanDialog = {
        title: '提示',
        message: '是否移除该项目',
        show: true,
        delete: 'project',
      };
      this.$refs.vandialogref.setData({
        show: this.vanDialog.show,
      });
    },
    /**
     * @description van-dialog 的cancel方法
     */
    handleVanDialogCancel() {
      this.vanDialog.show = false;
    },
    /**
     * @description van-dialog 的confirm方法
     */
    handleVanDialogConfirm() {
      if (this.vanDialog.delete === 'project') {
        this.$emit('remove-project', this.index);
      } else {
        this.$emit('delete-third-target', this.index, this.deletedTargetIndex);
      }
    },
    /**
     * @description 添加三级目标
     */
    handleAddThirdTarget() {
      this.$emit('add-third-target', this.projectObj);
    },
    /**
     * @description 删除三级目标
     * @params targetIndex 目标下标
     */
    handleDeleteThirdTarget(targetIndex) {
      this.handleUpdateWorkingHour();
      this.$emit('delete-third-target', this.index, targetIndex);
      // this.deletedTargetIndex = targetIndex;
      // console.log('删除三级目标');
      // this.vanDialog = {
      //   title: '提示',
      //   message: '是否移除该目标',
      //   show: true,
      //   delete: 'target',
      // };
      // this.$refs.vandialogref.setData({
      //   show: this.vanDialog.show,
      // });
    },
    /**
     * @description 统计工时
     */
    handleUpdateWorkingHour() {
      this.$emit('update-workingHour', this.index);
    },
    /**
     * @description 重新申报
     */
    handleDeclareAgain([val, index]) {
      this.$emit('declare-again', val, index);
    },
    /**
     * @description 更新三级目标
     */
    handleUpdateProjectThirdTargets([val, index]) {
      this.projectObj.projectThirdTargets[index] = val;
    },
    /**
     * @description 获取第三目标的最新数据
     */
    getProjectThirdTargets() {
      this.projectObj.projectThirdTargets =
        this.projectObj.projectThirdTargets.map((el, index) => {
          return this.$refs.projectThirdTargetRef[
            index
          ].getProjectThirdTargetObj ? this.$refs.projectThirdTargetRef[
            index
          ].getProjectThirdTargetObj() : el;
        });
      return this.projectObj;
    },
  },
});
</script>

<style lang="less" scope>
@import './assets/styles/ProjectsLaborHoursItem.less';
</style>
