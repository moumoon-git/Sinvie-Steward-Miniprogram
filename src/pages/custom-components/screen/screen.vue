<template>
  <view>
<!-- 	<section class="tag-panel">
		<text class="tag-title">工单类型</text>
		<view class="tag-wrap">
			<view class="tag" :class="{'tag-active':orderTypeActive==1}">全部</view>
			<view class="tag">人员预警</view>
			<view class="tag">车辆预警</view>
			<view class="tag">校园风险</view>
			<view class="tag">物业风险</view>
			<view class="tag">违规预警</view>
			<view class="tag">视频监控</view>
			<view class="tag">风险排查</view>
			<view class="tag">自定义工单</view>
		</view>
	</section> -->
	<section class="cell-panel">
		<van-cell title="工单类别" :value="orderProperty.name" :is-link="!orderProperty.id" @click.self="handleCellClick">
			<view slot="right-icon">
			    <van-icon name="clear" @click.self="handleClearOrderProperty" />
			</view>
		</van-cell>
	</section>
	<van-picker
		v-if="pickerVisible"
		show-toolbar
		:columns="columns"
		title="工单类别"
		value-key="name"
		@cancel="handlePickerCancel"
		@confirm="handlePickerConfirm"
		@change="handlePickerChange"
	/>
	<footer>
		<view class="reset-btn" @click="handleReset">重置</view>
		<view class="submit-btn" @click="handleSubmit">确定</view>
	</footer>
  </view>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'screen',
  props: {

  },
  data() {
    return {
		orderTypeActive: '', // 工单类型
		orderStatusActive: '', // 工单状态
		columns: [],
		pickerVisible: false,
		orderProperty: {
			id: '',
			name: '请选择工单类别'
		}
    };
  },
  computed: {
  },
  onLoad(options){
	this.getOrderPropertyColumns();
	if(options.orderProperty) {
		this.orderProperty = JSON.parse(options.orderProperty);
	}
  },
  methods: {
	getOrderPropertyColumns() {
		this.$http.get({
			url: '/work/workProperty/listAll'
		}).then(({data}) => {
			console.log('/work/workProperty/listAll data', data);
			if(data.code == 0) {
				// this.columns = data.data;
				data.data.forEach(element => {
					if(!element.children) {
						element.children=[]
					}
				});
				this.columns = [
					{
						values: data.data,
						className: 'column1',
						defaultIndex: 0
					},
					{
						values: data.data[0].children,
						className: 'column2',
						defaultIndex: 0
					},
				]
			}
		});
	},
	handlePickerChange(event) {
		console.log('handlePickerChange event',event);
		const { picker, value, index } = event.detail;
    	picker.setColumnValues(1, value[0].children);
	},
	handleCellClick() {
		this.pickerVisible = true;
	},
	handleClearOrderProperty() {
		this.orderProperty = {
			id: '',
			name: '请选择工单类别'
		};
	},
	// 工单类别选择器确认
	handlePickerConfirm(event) {
		console.log(event);
		const value = event.detail.value[event.detail.value.length-1]?event.detail.value[event.detail.value.length-1]:event.detail.value[event.detail.value.length-2]
		this.orderProperty = value;
		this.pickerVisible = false;
	},
	// 工单类别选择器取消
	handlePickerCancel(event) {
		this.pickerVisible = false;
	},
	// 重置
	handleReset() {
		this.orderProperty = {
			id: '',
			name: '请选择工单类别'
		};
	},
	// 确定
	handleSubmit() {
		// 获取当前小程序的页面栈
		let pages = getCurrentPages();
		// 数组中索引上一个页面
		let previousPage = pages[pages.length - 2];
		previousPage.data.orderProperty = this.orderProperty;
		wx.navigateBack({
			url: `../../workOrderManagement/workOrderManagement`
		});
	}
  },
});
</script>
<style lang='less' scoped>
	.tag-panel {
		box-sizing: border-box;
		padding: 0rpx 40rpx;
		margin-top: 40rpx;
		.tag-title {
			display: block;
			font-weight: 800;
			color: #333333;
			font-size: 36rpx;
		}
		.tag-wrap {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 30rpx;
			.tag {
				color: #333333;
				background: #F5F5F5;
				white-space: nowrap;
				width: 210rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				margin-bottom: 20rpx;
				&.tag-active {
					color: #0091FF;
					background: rgba(0, 145, 255, 0.12);
				}
			}
		}
	}
	.cell-panel {
		margin-top: 40rpx;
	}
	/deep/ .van-cell {
		.van-cell__title {
			font-weight: 800;
		}
		.van-cell__value {
			margin-right: 10rpx;
		}
	}
	/deep/ .van-picker {
		position: fixed;
		bottom: 0%;
		width: 100%;
		z-index: 996;
		.van-picker__toolbar {
			border-top: 1rpx solid #ecf2f2;
		}
	}
	footer {
		position: fixed;
		bottom: 0%;
		width: 100%;
		display: flex;
		.reset-btn,.submit-btn {
			width: 50%;
			text-align: center;
			padding: 30rpx 0rpx;
			font-weight: 800;
		}
		.reset-btn {
			color: #0091FF;
			background: #E8F2FC;
		}
		.submit-btn {
			color: #FFFFFF;
			background: #0091FF;
		}
	}
</style>
