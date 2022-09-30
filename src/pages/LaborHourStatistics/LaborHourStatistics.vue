<template>
  <view class="LaborHourStatistics">
    <view class="LaborHourStatistics__header">
      <view class="LaborHourStatistics__header__top">
        <van-icon
          name="arrow-left"
          class="color-666"
          @click="handleToggleMonth('cut')"
        />
        <text class="color-333">{{ `${year}年${month}月` }}</text>
        <van-icon
          name="arrow"
          class="color-666"
          @click="handleToggleMonth('plus')"
        />
      </view>
      <view class="LaborHourStatistics__header__bottom">
        <view class="LaborHourStatistics__header__item">
          <text class="count">{{ projectCount }}</text>
          <text>项目总数</text>
        </view>
        <view class="LaborHourStatistics__header__item">
          <text class="count">{{ timeConsuming }}</text>
          <text>总工时</text>
        </view>
      </view>
    </view>
    <view class="LaborHourStatistics__body">
      <Loading v-if="isLoading" />
      <template v-else>
        <template v-if="projects.length > 0">
          <view
            v-for="(item, index) in projects"
            :key="item.id"
            class="projects"
          >
            <view class="projects__header">
              <view class="projects__header__left">
                <image
                  :data-project-index="`项目${index + 1}`"
                  mode="widthFix"
                  src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-bg.svg"
                  class="project-index-bg"
                ></image>
                <view class="project-name">{{ item.projectName }}</view></view
              >
              <view class="projects__header__right">
                工时：
                <text class="projects__header__right__count">{{
                  item.timeConsuming
                }}</text>
              </view>
            </view>
            <view class="projects__body">
              <view
                v-for="target in item.projectThirdTargets"
                :key="target.id"
                class="target"
              >
                <view class="target__left">
                  {{ target.thirdTargetName }}
                </view>
                <view class="target__right">
                  工时：
                  <text>{{ target.timeConsuming }}</text>
                  <text>{{ target.proportion }}</text>
                </view>
              </view>
            </view>
          </view>
        </template>
        <view v-else class="LaborHourStatistics__body--empty">
          <image
            data-content="暂无数据"
            mode="aspectFit"
            src="http://120.24.173.36:9000/sinvie/sinvie-steward/applet/laborHourReport/icon-empty.svg"
            class="empty"
          ></image>
        </view>
      </template>
    </view>
  </view>
</template>
<script>
import { defineComponent } from 'vue';
import { getStatistics } from './assets/js/api';
import { addZero } from './assets/js/useHook';
import Loading from '../../components/loading/loading.vue';
export default defineComponent({
  name: 'LaborHourStatistics',
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: true,
      projectCount: 0, // 项目总数
      timeConsuming: 0, // 项目工时
      projects: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    };
  },
  mounted() {
    this.handleGetStatistics();
  },
  methods: {
    handleToggleMonth(type) {
      if (type === 'cut') {
        if (this.month === 1) {
          this.month = 12;
          this.year -= 1;
        } else {
          this.month -= 1;
        }
      } else {
        if (this.month === 12) {
          this.month = 1;
          this.year += 1;
        } else {
          this.month += 1;
        }
      }
      this.handleGetStatistics();
    },
    async handleGetStatistics() {
      this.isLoading = true;
      this.projectCount = 0;
      this.timeConsuming = 0;
      this.projects = [];
      const result = await getStatistics(`${this.year}-${addZero(this.month)}`);
      console.log(result);
      if (result.data.code === 200) {
        this.isLoading = false;
        const { projectCount, timeConsuming, projects } = result.data.data;
        this.projectCount = projectCount || 0;
        this.timeConsuming = timeConsuming || 0;
        this.projects = projects || [];
      } else {
        wx.showToast({
          title: '获取统计失败！',
          icon: 'error',
        });
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="less" scoped>
@import './assets/styles/LaborHourStatistics.less';
</style>