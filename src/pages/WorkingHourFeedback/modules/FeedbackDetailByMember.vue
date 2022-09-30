<template>
	<view class="FeedbackDetailByMember">
	    <header class="person-card">
            <van-cell class="card-header">
                <view slot="title" style="display: flex;align-items: center;">
                    <van-image round width="100rpx" height="100rpx" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                    <p class="project-userInfo">
                        <view class="userInfo-name">
                            <label>{{project.contactName}}</label>
                            <span>{{project.rankName}}</span>
                        </view>
                        <text class="userInfo-position">{{project.positionName}}</text>
                    </p>
                </view>
                <!-- <view slot="right-icon" style="display: flex;align-items: center;">
                    <van-icon name="notes-o" />
                    <text style="margin-left: 10rpx;" @click="handleOpenCalendar">填报日历</text>
                </view> -->
            </van-cell>
            <view class="card-content">
                <p>
                    <text>{{project.count}}</text>
                    <label>总数</label>
                </p>
                <p>
                    <text>{{project.feedbackCount}}</text>
                    <label>已反馈</label>
                </p>
                <p>
                    <text>{{project.toBeFedBackCount}}</text>
                    <label>待反馈</label>
                </p>
                <!-- <p>
                    <text>15</text>
                    <label>未申报</label>
                </p> -->
                <p>
                    <text>{{project.returnedCount}}</text>
                    <label>已退回</label>
                </p>
            </view>
	    </header>
	    <main>
            <van-tabs :active="tabActive" @change="handleTabsChange">
                <van-tab title="待反馈" class="to-be-feedback" name="1">
                    <ul v-if="projectList.length!=0" class="card-panel">
                        <li class="project-card" v-for="(projectItem, projectKey) in projectList" :key="projectKey" @click="handleNavigate(projectItem, projectKey)">
                            <i class="project-icon" :style="{
                                backgroundImage: `url(${imgStaticUrl}/personal-center/project-icon.png)`,
                            }">{{`项目${projectKey+1}`}}</i>
                            <text class="project-title">{{projectItem.projectManage.projectName}}</text>
                            <text class="card-date">{{`${projectItem.date}期`}}</text>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
                <van-tab title="已反馈" class="feedbacked" name="2">
                    <ul v-if="projectList.length!=0" class="card-panel">
                        <li class="project-card" v-for="(projectItem, projectKey) in projectList" :key="projectKey" @click="handleNavigate(projectItem, projectKey)">
                            <i class="project-icon" :style="{
                                backgroundImage: `url(${imgStaticUrl}/personal-center/project-icon.png)`,
                            }">{{`项目${projectKey+1}`}}</i>
                            <text class="project-title">{{projectItem.projectManage.projectName}}</text>
                            <text class="card-date">{{`${projectItem.date}期`}}</text>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
                <van-tab title="已退回" class="returned" name="3">
                    <ul v-if="projectList.length!=0" class="card-panel">
                        <li class="project-card" v-for="(projectItem, projectKey) in projectList" :key="projectKey" @click="handleNavigate(projectItem, projectKey)">
                            <i class="project-icon" :style="{
                                backgroundImage: `url(${imgStaticUrl}/personal-center/project-icon.png)`,
                            }">{{`项目${projectKey+1}`}}</i>
                            <text class="project-title">{{projectItem.projectManage.projectName}}</text>
                            <text class="card-date">{{`${projectItem.date}期`}}</text>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
                <!-- <van-tab title="未申报" class="undeclared" name="4">
                </van-tab> -->
            </van-tabs>
        </main>
        <van-calendar color="#0091FF" :show="calendarVisible" @close="handleCalendarClose" @confirm="handleCalendarConfirm" />
	</view>
</template>

<script>

export default {
  name: 'FeedbackDetailByMember',
  data() {  
	return {
        imgStaticUrl: this.$imgStaticUrl,
        tabActive: '1',
        project: {},
        projectList: [],
        calendarVisible: false
	}
   },
   components: {
   },
   computed: {
    },
   onShow() {
        this.getFeedbackDetailByMember();
    },
    onLoad(query) {
        console.log('onLoad query', query.params);
        this.project = JSON.parse(query.params);
        this.getFeedbackDetailByMember();
    },
  methods: {
    handleTabsChange(event) {
        this.tabActive = event.detail.name;
        console.log('this.tabActive',this.tabActive);
        this.getFeedbackDetailByMember();
    },
    getFeedbackDetailByMember() {
        this.$http.post({
            url: `/steward-manage/working/working-hour/toExamineByPersonnelOne`,
            data: {
                "contactorId": this.project.contactorId,
                "state": this.tabActive,
                "yearMonth": this.project.yearMonth
            }
        })
        .then(({ data }) => {
            console.log('/steward-manage/working/working-hour/toExamineByPersonnelOne data', data);
            if (data.code == 200) {
                this.projectList = data.data.projectDetailVOS;
                this.project.mailContactorVO = data.data.mailContactorVO;
                this.project.count = data.data.approvalStatisticsVO.count;
                this.project.feedbackCount = data.data.approvalStatisticsVO.feedbackCount;
                this.project.returnedCount = data.data.approvalStatisticsVO.returnedCount;
                this.project.toBeFedBackCount = data.data.approvalStatisticsVO.toBeFedBackCount;
            } else {
                wx.showToast({
                    title: data.msg,
                    icon: 'none',
                });
            }
        });
    },
    handleNavigate(feedbackItem) {
        
        let params = {
            contactorId: this.project.mailContactorVO.id,
            projectId: feedbackItem.projectManage.id,
            state: this.tabActive,
            yearMonth: feedbackItem.date
        }
        console.log('feedbackItem',feedbackItem,params)
        wx.navigateTo({
          url: `/pages/WorkingHourFeedback/modules/FeedbackWrite/FeedbackWrite?params=${JSON.stringify(params)}`
        });
    },
    handleOpenCalendar() {
        this.calendarVisible = true;
    },
    handleCalendarClose() {
        this.calendarVisible = false;
    },
    handleCalendarConfirm(event) {
        console.log('handleCalendarConfirm event', event);
        let date = new Date(event.detail);
        date = `${1900+date.getYear()}-${date.getMonth()+1>9?(date.getMonth()+1):(`0${date.getMonth()+1}`)}-${date.getDate()>9?date.getDate():`0${date.getDate()}`}`;
        console.log('handleCalendarConfirm date', date);
        this.calendarVisible = false;
    },
  }
};
</script>

<style lang="less">	
    page {
        background: #F5F5F5;
        height: 100%;
        overflow: hidden;
    }
	.FeedbackDetailByMember {
		height: 100%;
		display: block;
		padding: 0rpx;
		box-sizing: border-box;
		&>header {
			box-sizing: border-box;
            margin: 20rpx;
            &.person-card {
                background: #FFFFFF;
                border-radius: 10rpx;
                .card-header {
                    border-bottom: 1rpx solid #DDDDDD;
                    .van-cell {
                        display: flex;
                        align-items: center;
                        border-radius: 10rpx;
                    }
                    .project-icon {
                        display: inline-block;
                        width: 100rpx;
                        height: 40rpx;
                        background-size: 100rpx 40rpx;
                        background-repeat: no-repeat;
                        color: #F4D57B;
                        font-weight: 800;
                        font-size: 12px;
                        line-height: 40rpx;
                        text-align: center;
                    }
                    .project-title {
                        font-weight: 800;
                        font-size: 14px;
                        margin-left: 10rpx;
                    }
                    .project-userInfo {
                        margin-left: 20rpx;
                        .userInfo-name {
                            font-weight: 800;
                            color: #333333;
                            display: flex;
                            align-items: center;
                            span {
                                height: 36rpx;
                                line-height: 34rpx;
                                margin-left: 10rpx;
                                color: #FF7A45;
                                background: rgba(255, 187, 150, 0.3);
                                padding: 0rpx 12rpx;
                                border-radius: 18rpx;
                                font-size: 12px;
                            }
                        }
                        .userInfo-position {
                            color: #999999;
                            font-size: 12px;
                        }
                    }
                }
                .card-content {
                    display: flex;
                    justify-content: center;
                    padding: 30rpx 0rpx;
                    p {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        text {
                            font-size: 20px;
                            font-weight: 800;
                        }
                        label {
                            font-size: 12px;
                        }
                        &:nth-of-type(1) {
                            text {
                                color: #0091FF;
                            }
                        }
                        &:nth-of-type(2) {
                            text {
                                color: #0BD295;
                            }
                        }
                        &:nth-of-type(3) {
                            text {
                                color: #FDB428;
                            }
                        }
                        &:nth-of-type(4), &:nth-of-type(5) {
                            text {
                                color: #F66E6E;
                            }
                        }
                        &:not(:last-of-type) {
                            &::after {
                                display: inline-block;
                                content: '';
                                width: 1rpx;
                                height: 93rpx;
                                background: rgba(221,221,221,0.5);
                                position: absolute;
                                right: 0%;
                                top: 0%;
                            }
                        }
                    }
                }
            }
		}
		&>main {
            height: calc(100% - 272rpx);
            display: block;
            padding: 0rpx;
            .card-panel {
                max-height: 100%;
                overflow: auto;
                padding: 20rpx;
                box-sizing: border-box;
                .project-card {
                    background: #FFFFFF;
                    border-radius: 10rpx;
                    margin-bottom: 20rpx;
                    height: 90rpx;
                    display: flex;
                    align-items: center;
                    padding: 20rpx;
                    box-sizing: border-box;
                    .project-icon {
                        display: inline-block;
                        width: 100rpx;
                        height: 40rpx;
                        background-size: 100rpx 40rpx;
                        background-repeat: no-repeat;
                        color: #F4D57B;
                        font-weight: 800;
                        font-size: 12px;
                        line-height: 40rpx;
                        text-align: center;
                    }
                    .project-title {
                        font-weight: 800;
                        font-size: 14px;
                        margin-left: 10rpx;
                    }   
                    .card-date {
                        color: #999999;
                        margin-left: auto;
                        margin-right: 0rpx;
                        font-size: 12px;
                    }
                }
            }
        }
        van-tabs {
            height: 100%;
            van-sticky {
                border-top: 3rpx solid #EEEEEE;
            }
            .van-tabs.van-tabs--line {
                height: 100%;
                .van-tabs__content {
                    height: calc(100% - 88rpx);
                }
            }
            .van-tab__pane.van-tab__pane--active {
                height: 100%;
            }
            van-tab {
                height: 100%;
            }
        }
	}
</style>