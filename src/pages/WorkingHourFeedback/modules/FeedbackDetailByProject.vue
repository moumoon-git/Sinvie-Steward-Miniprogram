<template>
	<view class="FeedbackDetailByProject">
	    <header class="project-card">
            <van-cell class="card-header" is-link>
                <view slot="title">
                    <i class="project-icon" :style="{
                    backgroundImage: `url(${imgStaticUrl}/personal-center/project-icon.png)`,
                    }">{{`项目${project.index}`}}</i>
                    <text class="project-title">{{project.projectName}}</text>
                </view>
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
                <p>
                    <text>{{project.returnedCount}}</text>
                    <label>已退回</label>
                </p>
            </view>
	    </header>
	    <main>
            <van-tabs :active="tabActive" @change="handleTabsChange">
                <van-tab title="待反馈" class="to-be-feedback" name="1">
                    <ul v-if="personList.length!=0" class="card-panel">
                        <li class="person-card" v-for="(personItem, personKey) in personList" :key="personKey" @click="handleNavigate(personItem)">
                            <van-image round width="100rpx" height="100rpx" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                            <p>
                                <view class="card-name">
                                    <label>{{personItem.mailContactorVO.contactName}}</label>
                                    <span>{{personItem.mailContactorVO.majorPositionVOS[0].rankName}}</span>
                                </view>
                                <text class="card-position">{{personItem.mailContactorVO.majorPositionVOS[0].positionName}}</text>
                            </p>
                            <text class="card-date">{{personItem.date+'期'}}</text>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
                <van-tab title="已反馈" class="feedbacked" name="2">
                    <ul v-if="personList.length!=0" class="card-panel">
                        <li class="person-card" v-for="(personItem, personKey) in personList" :key="personKey" @click="handleNavigate(personItem)">
                            <van-image round width="100rpx" height="100rpx" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                            <p>
                                <view class="card-name">
                                    <label>{{personItem.mailContactorVO.contactName}}</label>
                                    <span>{{personItem.mailContactorVO.majorPositionVOS[0].rankName}}</span>
                                </view>
                                <text class="card-position">{{personItem.mailContactorVO.majorPositionVOS[0].positionName}}</text>
                            </p>
                            <text class="card-date">{{personItem.date+'期'}}</text>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
                <van-tab title="已退回" class="returned" name="3">
                    <ul v-if="personList.length!=0" class="card-panel">
                        <li class="person-card" v-for="(personItem, personKey) in personList" :key="personKey" @click="handleNavigate(personItem)">
                            <van-image round width="100rpx" height="100rpx" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                            <p>
                                <view class="card-name">
                                    <label>{{personItem.mailContactorVO.contactName}}</label>
                                    <span>{{personItem.mailContactorVO.majorPositionVOS[0].rankName}}</span>
                                </view>
                                <text class="card-position">{{personItem.mailContactorVO.majorPositionVOS[0].positionName}}</text>
                            </p>
                            <text class="card-date">{{personItem.date+'期'}}</text>
                        </li>
                    </ul>
                    <van-empty v-else description="暂无数据" />
                </van-tab>
            </van-tabs>
        </main>
	</view>
</template>

<script>

export default {
  name: 'FeedbackDetailByProject',
  data() {  
	return {
        imgStaticUrl: this.$imgStaticUrl,
        tabActive: '1',
        project: {},
        personList: []
	}
   },
   components: {
   },
   computed: {
    },
   onShow() {
        this.getFeedbackDetailByProject();
    },
    onLoad(query) {
        console.log('onLoad query', query.params);
        this.project = JSON.parse(query.params);
        this.getFeedbackDetailByProject();
    },
  methods: {
    handleTabsChange(event) {
        this.tabActive = event.detail.name;
        console.log('this.tabActive',this.tabActive);
        this.getFeedbackDetailByProject();
    },
    getFeedbackDetailByProject() {
        this.$http.post({
            url: `/steward-manage/working/working-hour/toExamineByProjectOne`,
            data: {
                "projectId": this.project.projectId,
                "state": this.tabActive,
            }
        })
        .then(({ data }) => {
            console.log('/steward-manage/working/working-hour/toExamineByProjectOne data', data);
            if (data.code == 200) {
                this.personList = data.data.projectDetailVOS;
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
            contactorId: feedbackItem.mailContactorVO.id,
            projectId: this.project.projectId,
            state: this.tabActive,
            yearMonth: feedbackItem.date
        }
        wx.navigateTo({
          url: `/pages/WorkingHourFeedback/modules/FeedbackWrite/FeedbackWrite?params=${JSON.stringify(params)}`
        });
    }
  }
};
</script>

<style lang="less">	
    page {
        background: #F5F5F5;
        height: 100%;
        overflow: hidden;
    }
	.FeedbackDetailByProject {
		height: 100%;
		display: block;
		padding: 0rpx;
		box-sizing: border-box;
		&>header {
			box-sizing: border-box;
            margin: 20rpx;
            &.project-card {
                background: #FFFFFF;
                border-radius: 10rpx;
                .card-header {
                    border-bottom: 1rpx solid #DDDDDD;
                    .van-cell {
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
                }
                .card-content {
                    display: flex;
                    justify-content: center;
                    padding: 30rpx 0rpx;
                    p {
                        display: flex;
                        flex-direction: column;
                        width: 25%;
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
                        &:nth-of-type(4) {
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
                .person-card {
                    margin-bottom: 20rpx;
                    display: flex;
                    align-items: center;
                    background: #FFFFFF;
                    border-radius: 6px;
                    padding: 20rpx;
                    box-sizing: border-box;
                    &>p {
                        margin-left: 20rpx;
                        .card-name {
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
                        .card-position {
                            color: #999999;
                            font-size: 12px;
                        }
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