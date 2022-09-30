<template>
  <van-popup
    :show="show"
    round
    position="bottom"
    @click-overlay="handleClickOverlay"
  >
    <!-- 日历 -->
    <van-calendar
      ref="calendar"
      :poppable="false"
      :row-height="80"
      color="#0091FF"
      class="laborHourReport-calendar"
      @close="handleClickOverlay"
      @confirm="handleConfirm"
    >
      <template #title>
        <view class="calendar-title">填报日历</view>
        <view class="calendar-text-wrapper">
          <view
            v-for="item in list"
            :key="item.name"
            :class="['calendar-text', `calendar-text--${item.className}`]"
            >{{ item.name }}</view
          >
        </view>
      </template>
      <template #subtitle>
        <view class="calendar-month">
          <van-icon
            name="arrow-left"
            class="color-666"
            @click="handleToggleMonth('cut')"
          />
          <text class="color-666">{{ `${year}年${month}月` }}</text>
          <van-icon
            name="arrow"
            class="color-666"
            @click="handleToggleMonth('plus')"
          />
        </view>
      </template>
    </van-calendar>
  </van-popup>
</template>

<script>
import { defineComponent } from 'vue';

import { dailyState, getDailyWorkingHours } from '../../assets/js/api.js';
import { addZero, daysInMonth } from '../../assets/js/useHook.js';
export default defineComponent({
  name: 'Calendar',
  props: {
    show: {
      type: Boolean,
      default: false,
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
    return {
      list: [
        {
          name: '已反馈',
          className: 'feedbacked',
        },
        {
          name: '待反馈',
          className: 'unfeedbacked',
        },
        {
          name: '未申报',
          className: 'undeclare',
        },
        {
          name: '已退回',
          className: 'returned',
        },
      ],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
      todayYear: new Date().getFullYear(),
      todayMonth: new Date().getMonth() + 1,
      todayDate: new Date().getDate(),
      enableMonthList: [], // 可以切换的月份
      defaultDate: new Date(),
    };
  },
  watch: {
    show: {
      handler(newVal) {
        if (newVal) {
          this.handleDailyState();
          // this.year = this.laborHoursDayList[this.activeDateIndex].year;
          // this.month = Number(
          //   this.laborHoursDayList[this.activeDateIndex].month
          // );
          this.year = this.todayYear;
          this.month = this.todayMonth;
        }
      },
    },
  },
  computed: {
    minDate() {
      return new Date(`${this.year}/${this.month}/1`);
    },
    maxDate() {
      if (this.todayYear === this.year && this.todayMonth === this.month) {
        return new Date(`${this.year}/${this.month}/${this.date}`);
      } else {
        const days = daysInMonth(this.year, this.month);
        return new Date(`${this.year}/${this.month}/${days}`);
      }
    },
  },
  methods: {
    /**
     * @description 确定
     */
    handleConfirm(event) {
      this.$emit('confirm', event.detail);
    },
    handleToggleMonth(type) {
      const enableMonthList = this.enableMonthList.map((el) => `${el.year}/${el.month}`);
      let year = this.year;
      let month = this.month;
      if (type === 'cut') {
        if (month === 1) {
          year = 12;
          month -= 1;
        } else {
          month -= 1;
        }
      } else {
        if (month === 12) {
          month = 1;
          year += 1;
        } else {
          month += 1;
        }
      }
      if (enableMonthList.includes(`${year}/${month}`)) {
        this.year = year;
        this.month = month;
        this.handleDailyState();
      }
    },
    /**
     * @description 获取所选月份的每日审批状态
     */
    async handleDailyState() {
      const days = daysInMonth(this.year, this.month);
      // 获取所选月份的每日审批状态
      const result = await dailyState(`${this.year}-${addZero(this.month)}`);
      // 根据月份获取每日填报工时
      const {data} = await getDailyWorkingHours(`${this.year}-${addZero(this.month)}`);
      if (result.data.code === 200) {
        // 1：待反馈，2：已反馈，3：已退回
        this.$refs.calendar.setData({
          minDate: this.minDate,
          maxDate: this.maxDate,
          formatter: (day) => {
            if (result.data.data[1] && result.data.data[1].includes(day.text)) {
              // 待反馈
              day = {
                ...day,
                bottomInfo: `${data.data[Number(day.text) - 1]}小时`,
                className: 'unfeedbacked-day',
              };
            } else if (
              result.data.data[2] &&
              result.data.data[2].includes(day.text)
            ) {
              console.log(day)
              // 已反馈
              day = {
                ...day,
                bottomInfo: `${data.data[Number(day.text) - 1]}小时`,
                className: 'feedbacked-day',
              };
            } else if (
              result.data.data[3] &&
              result.data.data[3].includes(day.text)
            ) {
              // 已退回
              day = {
                ...day,
                bottomInfo: '已退回',
                className: 'returned-day',
              };
            } else {
              // 未申报
              if (this.year === this.todayYear && this.month === this.todayMonth && this.todayDate < day.text) {
                // 未来
                day = {
                  ...day,
                  className: 'future-day',
                };
              } else {
                day = {
                  ...day,
                  bottomInfo: '未申报',
                  className: 'undeclare-day',
                };
              }
            }

            if (
              this.year === this.todayYear &&
              Number(this.month) === this.todayMonth &&
              this.todayDate === day.text
            ) {
              day = {
                ...day,
                text: '今天',
                className: day.className + ' today',
              };
            }
            return day;
          },
        });
        this.$refs.calendar.reset();
      } else {
      }
    },
    handleClickOverlay() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="less">
@import './styles/calendar.less';
</style>