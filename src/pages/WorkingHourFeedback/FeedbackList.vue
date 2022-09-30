<template>
	<view class="FeedbackList">
	    <header>
            <view class="month-picker">
                <van-icon name="arrow-left" @click="handleLastMonth" />
                <text>{{`${year}年${month}月`}}</text>
                <van-icon name="arrow" @click="handleNextMonth" />
            </view>
            <view class="date-picker" @click="handleOpenCalendar">
                <van-icon name="notes-o" />
                <text>填报日历</text>
            </view>
	    </header>
	    <main>
            <van-tabs :active="tabActive" @change="handleTabsChange">
                <van-tab title="按项目" class="by-project" name="byProject">
                    <ul v-if="feedbackList.length!=0" class="card-panel">
                        <li class="card" v-for="(feedbackItem, feedbackKey) in feedbackList" :key="feedbackKey" @click="handleNavigate(feedbackItem, feedbackKey)">
                            <van-cell class="card-header" is-link>
                                <view slot="title" style="display: flex;align-items: center;">
                                    <i class="project-icon" :style="{
                                        backgroundImage: `url(${imgStaticUrl}/personal-center/project-icon.png)`,
                                    }">{{`项目${feedbackKey+1}`}}</i>
                                    <text class="project-title">{{feedbackItem.projectName}}</text>
                                </view>
                            </van-cell>
                            <view class="card-content">
                                <p>
                                   <text>{{feedbackItem.count}}</text>
                                   <label>总数</label>
                                </p>
                                <p>
                                   <text>{{feedbackItem.feedbackCount}}</text>
                                   <label>已反馈</label>
                                </p>
                                <p>
                                   <text>{{feedbackItem.toBeFedBackCount}}</text>
                                   <label>待反馈</label>
                                </p>
                                <p>
                                   <text>{{feedbackItem.returnedCount}}</text>
                                   <label>已退回</label>
                                </p>
                            </view>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
                <van-tab title="按成员" class="by-member" name="byMember">
                    <ul v-if="feedbackList.length!=0" class="card-panel">
                        <li class="card" v-for="(feedbackItem, feedbackKey) in feedbackList" :key="feedbackKey" @click="handleNavigate(feedbackItem, feedbackKey)">
                            <van-cell class="card-header" is-link>
                                <view slot="title" style="display: flex;align-items: center;">
                                    <van-image round width="100rpx" height="100rpx" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                                    <p class="project-userInfo">
                                        <view class="userInfo-name">
                                            <label>{{feedbackItem.mailContactorVO.contactName}}</label>
                                            <span>{{feedbackItem.mailContactorVO.majorPositionVOS[0].rankName}}</span>
                                        </view>
                                        <text class="userInfo-position">{{feedbackItem.mailContactorVO.majorPositionVOS[0].positionName}}</text>
                                    </p>
                                </view>
                            </van-cell>
                            <view class="card-content">
                                <p>
                                   <text>{{feedbackItem.count}}</text>
                                   <label>总数</label>
                                </p>
                                <p>
                                   <text>{{feedbackItem.feedbackCount}}</text>
                                   <label>已反馈</label>
                                </p>
                                <p>
                                   <text>{{feedbackItem.toBeFedBackCount}}</text>
                                   <label>待反馈</label>
                                </p>
                                <!-- <p>
                                   <text>{{feedbackItem.returnedCount}}</text>
                                   <label>未申报</label>
                                </p> -->
                                <p>
                                   <text>{{feedbackItem.returnedCount}}</text>
                                   <label>已退回</label>
                                </p>
                            </view>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
            </van-tabs>
        </main>
         <van-datetime-picker
            v-if="datetimeVisible"
            class="fixed-bottom"
            type="year-month"
            :value="currentDate"
            :max-date="maxDate"
            @confirm="handleDateConfirm"
            @cancel="handleDateCancel"
        />
	</view>
</template>

<script>

export default {
  name: 'FeedbackList',
  data() {  
	return {
        imgStaticUrl: this.$imgStaticUrl,
        tabActive: 'byProject',
        feedbackList: [],
        year: '',
        month: '',
        datetimeVisible: false,
        currentDate: new Date().getTime(),
        maxDate: new Date().getTime(),
	}
   },
   components: {
   },
   computed: {
    },
   onShow() {
        this.getFeedbackList();
    },
    onLoad() {
        let date = new Date();
        this.year = 1900+date.getYear();
        this.month = date.getMonth()+1>9?(date.getMonth()+1):(`0${date.getMonth()+1}`);
    },
  methods: {
    handleTabsChange(event) {
        this.tabActive = event.detail.name;
        console.log('this.tabActive',this.tabActive);
        this.getFeedbackList();
    },
    getFeedbackList() {
        if (this.tabActive == 'byProject') {
            this.$http.post({
                url: `/steward-manage/working/working-hour/toExamineByProject`,
                data: {
                    "yearMonth": `${this.year}-${this.month}`
                }
            })
            .then(({ data }) => {
                console.log('/steward-manage/working/working-hour/toExamineByProject data', data);
                if (data.code == 200) {
                    this.feedbackList = data.data;
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                    });
                }
            });
        } else if(this.tabActive == 'byMember') {
            this.$http.post({
                url: `/steward-manage/working/working-hour/toExamineByPersonnel`,
                data: {
                    "yearMonth": `${this.year}-${this.month}`
                }
            })
            .then(({ data }) => {
                console.log('/steward-manage/working/working-hour/toExamineByPersonnel data', data);
                if (data.code == 200) {
                    this.feedbackList = data.data;
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                    });
                }
            });
        }
    },
    handleNavigate(feedbackItem, index) {
        let params = {};
        if (this.tabActive == 'byProject') {
            params.index = index+1;
            params.projectId = feedbackItem.projectId;
            params.projectName = feedbackItem.projectName;
            wx.navigateTo({
                url: `/pages/WorkingHourFeedback/modules/FeedbackDetailByProject?params=${JSON.stringify(params)}`
            });
        } else if(this.tabActive == 'byMember') {
            params.contactorId = feedbackItem.mailContactorVO.id;
            params.contactName = feedbackItem.mailContactorVO.contactName;
            params.rankName = feedbackItem.mailContactorVO.majorPositionVOS[0].rankName;
            params.positionName = feedbackItem.mailContactorVO.majorPositionVOS[0].positionName;
            params.yearMonth = `${this.year}-${this.month}`;
            wx.navigateTo({
                url: `/pages/WorkingHourFeedback/modules/FeedbackDetailByMember?params=${JSON.stringify(params)}`
            });
        }
        
    },
    handleLastMonth() {
        if(this.month == 1) {
            this.month = 12;
            this.year-=1;
        } else {
            this.month = Number(this.month)-1>9?(Number(this.month)-1):(`0${Number(this.month)-1}`);
        }
        this.getFeedbackList();
    },
    handleNextMonth() {
        if(this.month == 12) {
            this.month = `01`;
            this.year+=1;
        } else {
            this.month = Number(this.month)+1>9?(Number(this.month)+1):(`0${Number(this.month)+1}`);
        }
        this.getFeedbackList();
    },
    handleOpenCalendar() {
        this.datetimeVisible = true;
    },
    handleDateConfirm(event) {
        console.log('handleDateConfirm event', event);
        this.datetimeVisible = false;
        let date = new Date(event.detail);
        this.year = date.getFullYear();
        this.month = date.getMonth()+1>9?(date.getMonth()+1):(`0${date.getMonth()+1}`);
        console.log('handleDateConfirm year month', this.year,this.month);
        this.getFeedbackList();
    },
    handleDateCancel() {
        this.datetimeVisible = false;
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
	.FeedbackList {
		height: 100%;
		display: block;
		padding: 0rpx;
		box-sizing: border-box;
		&>header {
            background: #FFF;
			box-sizing: border-box;
            padding: 0rpx 36rpx;
            height: 100rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            position: relative;
            .month-picker {
                font-weight: 800;
                text {
                    margin: 0rpx 20rpx;
                }
            }
            .date-picker {
                position: absolute;
                right: 36rpx;
                font-size: 14px;
                text {
                    margin-left: 10rpx;
                }
            }
		}
		&>main {
            height: calc(100% - 100rpx);
            display: block;
            padding: 0rpx;
            box-sizing: border-box;
            .card-panel {
                max-height: 100%;
                overflow: auto;
                box-sizing: border-box;
                padding: 20rpx;
                list-style: none;
                .card {
                    background: #FFFFFF;
                    border-radius: 10rpx;
                    margin-bottom: 20rpx;
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
                            &:nth-of-type(4),&:nth-of-type(5) {
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
        .fixed-bottom {
            width: 100%;
            position: fixed;
            left: 0;
            bottom: 0;
        }
	}
</style>