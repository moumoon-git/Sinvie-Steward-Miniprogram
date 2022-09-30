<template>
  <div class="FeedbackWrite">
    <HeaderBar
      :activeId="activeId"
      :peopleList="peopleList"
      @tabClick="tabClick"
      @showPopup="showPopup"
    ></HeaderBar>

    <!-- 反馈信息 -->
    <Card
      :title="'申报周期：' + feedbackInfo.detail.declarationPeriod || '' + '期'"
    >
      <div class="create-time-box">
        <div>
          <span>提交时间：</span>
          <span>{{ feedbackInfo.detail.submissionTime || '' }}</span>
        </div>
        <div>
          <span>提交成员：</span>
          <span>{{ feedbackInfo.detail.submitMember || '' }}</span>
        </div>
        <div>
          <span>工时总数：</span>
          <span>{{ feedbackInfo.detail.totalTimeConsuming || 0 }}小时</span>
        </div>
      </div>
    </Card>

    <!-- 归属项目 -->
    <div class="project-info">{{ feedbackInfo.detail.projectName }}</div>

    <!-- 反馈列表 -->
    <div class="feedback-list-wrap">
      <Card
        :title="item.thirdTargetName"
        v-for="(item, index) in feedbackInfo.list"
        :key="item.id"
      >
        <div class="feedback-content">
          <div class="feedback-content-header">
            <div>
              <span>工作内容：</span>
              <span>{{ item.workingHour.achievement }}</span>
            </div>
            <div>
              <span>消耗工时：</span>
              <span>{{ item.workingHour.timeConsuming || 0 }}小时</span>
            </div>
            <div>
              <span>工作自评：</span>
              <span>{{
                selfCommentMap[item.workingHour.selfAssessment - 1]
              }}</span>
            </div>
          </div>
          <div class="feedback-content-write">
            <div class="rate-box">
              <div>工作效率：</div>
              <div class="score-res">
                <van-rate
                  :value="item.workingHour.workEfficiency"
                  :size="25"
                  color="#ffd21e"
                  void-icon="star"
                  void-color="#eee"
                  @change="rateChange($event, index, 'workEfficiency')"
                />
                <span>{{
                  efficiencyMap[item.workingHour.workEfficiency - 1]
                }}</span>
              </div>
            </div>
            <div class="rate-box">
              <div>任务完成度：</div>
              <div class="score-res">
                <van-rate
                  :value="item.workingHour.taskCompletion"
                  :size="25"
                  color="#ffd21e"
                  void-icon="star"
                  void-color="#eee"
                  @change="rateChange($event, index, 'taskCompletion')"
                />
                <span>{{
                  completeMap[item.workingHour.taskCompletion - 1]
                }}</span>
              </div>
            </div>
            <div class="rate-box">
              <div>任务满意度：</div>
              <div class="score-res">
                <van-rate
                  :value="item.workingHour.taskSatisfaction"
                  :size="25"
                  color="#ffd21e"
                  void-icon="star"
                  void-color="#eee"
                  @change="rateChange($event, index, 'taskSatisfaction')"
                />
                <span>{{
                  selfCommentMap[item.workingHour.taskSatisfaction - 1]
                }}</span>
              </div>
            </div>
            <div class="comment-box">
              <div>反馈意见：</div>
              <van-field
                :value="item.workingHour.reviewComment"
                rows="2"
                autosize
                type="textarea"
                maxlength="50"
                placeholder="请填写反馈意见"
                show-word-limit
                @change="commentChange($event, index)"
              />
            </div>
            <div class="feedback-bottom">
              <div>
                贡献工时：{{
                  isNaN(item.workingHour.contributingHour)
                    ? '-'
                    : item.workingHour.contributingHour
                }}小时
              </div>
              <div>
                <van-button
                  color="#FF4D4F"
                  plain
                  @click="submitFeedBack(index, '3')"
                  >退回</van-button
                >
                <van-button
                  type="primary"
                  color="#1989FA"
                  @click="submitFeedBack(index, '2')"
                  >反馈通过</van-button
                >
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <Popup
      :popupShow.sync="popupShow"
      :peopleList="peopleList"
      :activeId="activeId"
      @tabClick="tabClick"
    ></Popup>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import HeaderBar from './components/HeaderBar/HeaderBar.vue';
import Card from './components/Card/Card.vue';
import useInit from './useHooks/useInit';
import Popup from './components/Popup/Popup.vue';
export default defineComponent({
  name: 'FeedbackWrite',
  components: {
    HeaderBar,
    Card,
    Popup,
  },
  onLoad(options) {
    // 保存projectId state yearMonth

    const params = JSON.parse(options.params);
    console.log(
      '%c [ params ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      params
    );

    Object.assign(this.pageParams, params);
    console.log(
      '%c [ xxx ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      this.pageParams
    );
    this.initPageData();
  },
  setup(props) {
    const {
      pageParams,
      initPageData,
      peopleList,
      feedbackInfo,
      rateChange,
      submitFeedBack,
      commentChange,
      activeId,
      tabClick,
    } = useInit();
    // 自评map & 任务满意度map
    const selfCommentMap = ['卓越', '优秀', '良好', '一般', '较差'].reverse();
    // 工作效率map
    const efficiencyMap = ['非常低效', '低效', '一般', '正常', '高效'];
    // 任务完成度map
    const completeMap = ['非常低效', '低效', '低于预期', '符合预期', '超预期'];

    const popupShow = ref(false);

    const showPopup = () => {
      console.log(
        '%c [ xxx ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        123123
      );
      popupShow.value = true;
    };

    return {
      pageParams,
      peopleList,
      feedbackInfo,
      selfCommentMap,
      efficiencyMap,
      completeMap,
      rateChange,
      submitFeedBack,
      commentChange,
      tabClick,
      activeId,
      initPageData,
      popupShow,
      showPopup,
    };
  },
});
</script>
<style lang="less" scoped>
.FeedbackWrite {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20rpx;
  font-size: 14px;
  .create-time-box {
    min-height: 223rpx;
    div {
      color: #999999;
      padding-left: 28rpx;
      line-height: 88rpx;
      span:last-child {
        color: #333333;
        margin-left: 40rpx;
      }
    }
  }
  .project-info {
    background: #fff;
    border-bottom: 1px solid #0091ff;
    color: #0091ff;
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    width: 96%;
    margin: 0 auto;
  }

  .feedback-list-wrap {
    // height: calc(100vh - 593rpx);
    // overflow-y: auto;
    .feedback-content {
      color: #333333;
      .feedback-content-header {
        border-bottom: 1px solid #e0dddd;
        div {
          color: #999999;
          padding-left: 28rpx;
          display: flex;
          margin: 30rpx 0;
          span:first-child {
            min-width: 80rpx;
          }
          span:last-child {
            color: #333333;
            margin-left: 40rpx;
            flex: 1;
          }
        }
      }
      .feedback-content-write {
        padding-left: 28rpx;
        .rate-box {
          margin: 20rpx 0;
          .score-res {
            margin-top: 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 20rpx;
          }
        }
        .comment-box {
          margin-top: 20rpx;
          div:first-child {
            margin-bottom: 20rpx;
          }
        }
      }
      .feedback-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 20rpx;
        div:last-child {
          width: 317rpx;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
