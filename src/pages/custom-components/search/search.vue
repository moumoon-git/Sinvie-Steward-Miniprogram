<template>
  <view>
  	<!-- 搜索框内容 -->
  	<header>
  	  <van-search
  	    :value="search"
  	    shape="round"
  	    placeholder="请搜索关键字"
  	    @search="onSearch"
  	  />
  	  <label @click="handleCancel">取消</label>
  	</header>
  	<!-- 主体内容 -->
  	<main>
  	  <section class="search-record-header">
  	    <label class="search-record-header__title">搜索记录</label>
  	    <i v-if="!isDeleteVisible && searchRecordList.length!=0&&searchResultList.length==0" class="search-record-header__delete" @click="showDeleteIcon"></i>
		<label v-if="isDeleteVisible && searchRecordList.length!=0&&searchResultList.length==0" class="search-record-header__all-clear" @click="allClear">全部清空</label>
		<label v-if="isDeleteVisible && searchRecordList.length!=0&&searchResultList.length==0" class="search-record-header__complete" @click="complete">完成</label>
  	  </section>
  	  <ul v-if="searchRecordList.length!=0&&searchResultList.length==0" class="search-record-content">
  	    <li v-for="(recordItem, recordIndex) in searchRecordList" :key="recordIndex" >
  	      <label @click="selectRecord(recordItem)">{{ recordItem }}</label>
  	      <i v-if="isDeleteVisible" @click="deleteSearchRecord(recordIndex)"></i>
  	    </li>
  	  </ul>
	  <block v-if="searchRecordList.length==0&&searchResultList.length==0">
	  	<van-empty description="暂无搜索记录" />
	  </block>
	  <view v-if="searchResultList.length!=0" class="search-result-content">
	  	<text v-for="(resultItem,resultIndex) in searchResultList" :key="resultIndex" @click="handleWatchDetail(resultItem.id)">
			{{searchType=='notification'?resultItem.title:resultItem.name}}
		</text>
	  </view>
  	</main>
  </view>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Search',
  data() {
    return {
		search: '', // 搜索框内容
		searchRecordList: [], //搜索记录列表
		isDeleteVisible: false, // 是否显示搜索记录删除按钮
		searchResultList: [], // 搜索结果
		searchType: '',// search组件类型
		status:'' // tab选中值
    };
  },
  computed: {
	proxySearch: {
	      get() {
	        return this.search;
	      },
	      set(newValue) {
			console.log("this.searchComponentInfo newValue",this.searchComponentInfo,newValue);
	        const tempSearchRecordList = wx.getStorageSync(this.searchComponentInfo.storage)?JSON.parse(decodeURIComponent(wx.getStorageSync(this.searchComponentInfo.storage))):[];
	        const set = new Set(tempSearchRecordList);   
	        set.add(newValue);
	        const tempArray = [...set];
			this.search = newValue;
			console.log("this.search",this.search)
	        if(!newValue) {
	        	return ;
	        }
	        wx.setStorageSync(this.searchComponentInfo.storage, encodeURIComponent(JSON.stringify(tempArray)));
	      }
	},
	searchComponentInfo() {
		switch(this.searchType) {
			case 'inspection':
				return {
					storage:'inspectionRecordList',
					request: {
						url: '/investigation/investigationTask/listForSearchBar',
						data : {
							keyword: this.search,
							limit: 1000,
							status: this.status,
						},
					},
					navigateTo: (id)=>{
						return {
							url: `/pages/cityManagementInspection/inspection/modules/inspection-detail/inspection-detail?id=${id}`,
							success: function(res) {
								// 通过eventChannel向被打开页面传送数据
								res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
							}
						}
					},
					method: 'POST'
				}
				break;
			case 'workOrderManagement':
				return {
					storage:'workOrderManagementRecordList',
					request: {
						url: '/work/workSheet/wechatList',
						data : {
							"page":1,
							"limit":1000,
							"groupIds":[],
							"startTime":"",
							"endTime":"",
							"module":"",
							"property":"",
							"stats":0,
							"type":"",
							"search":this.search
						}
					},
					navigateTo: (id)=>{
						return {
							url: `/pages/publicPage/workOrderManagement/modules/workOrderManagement-detail?id=${id}`
						}	
					},
					method: 'POST'
				}
				break;
			case 'notification':
				return {
					storage:'notificationRecordList',
					request: {
						url: `/appManagement/smallRoutine/noticeList?noticeType=${this.status}&title=${this.search}&contactId=${wx.getStorageSync('userId')}`
					},
					navigateTo: (id)=>{
						return {
							url: `/pages/publicPage/notification/modules/notification-detail?id=${id}`
						}
					},
					method: 'GET'
				}
				break;
		}
	}
  },
  onLoad(options){
  	this.searchType = options.searchType;
	if(options.status) {
		this.status = options.status;
	}
  },
  mounted(){
	this.searchRecordList = wx.getStorageSync(this.searchComponentInfo.storage)?JSON.parse(decodeURIComponent(wx.getStorageSync(this.searchComponentInfo.storage))) : [];
  },
  methods: {
    // 点击显示搜索记录删除按钮
    showDeleteIcon() {
      this.isDeleteVisible = !this.isDeleteVisible;
    },
    // 确定搜索
    onSearch(event) {
		this.proxySearch = event.detail;
		let request=this.searchComponentInfo.method=='GET'?this.$http.get(this.searchComponentInfo.request):this.$http.post(this.searchComponentInfo.request)
		request.then(({data}) => {
			console.log(data)
			if(data.code === 0) {
				switch(this.searchType) {
					case 'inspection':
						if(data.list.length==0) {
							wx.showToast({
								title: '暂无数据',
								icon: 'error'
							});
							this.searchResultList= [];
						} else {
							this.searchResultList = data.list;
						}
					break;
					case 'workOrderManagement':
						if(data.page.list.length==0) {
							wx.showToast({
								title: '暂无数据',
								icon: 'error'
							});
							this.searchResultList= [];
						} else {
							this.searchResultList = data.page.list;
						}
					break;
					case 'notification':
						if(data.page.length==0) {
							wx.showToast({
								title: '暂无数据',
								icon: 'error'
							});
							this.searchResultList= [];
						} else {
							this.searchResultList = data.page;
						}
					break;
				}
			} else {
				wx.showToast({
					title: data.msg,
					icon: 'error'
				});
			}
		})
    },
    // 删除搜索记录
    deleteSearchRecord(index) {
      this.searchRecordList.splice(index, 1);
	  wx.setStorageSync(this.searchComponentInfo.storage, encodeURIComponent(JSON.stringify(this.searchRecordList)));
    },
	// 全部清空搜索记录
	allClear() {
		this.searchRecordList = [];
		wx.setStorageSync(this.searchComponentInfo.storage, encodeURIComponent(JSON.stringify(this.searchRecordList)));
	},
	// 完成操作
	complete() {
		this.isDeleteVisible = false;
	},
	// 选中搜索记录
	selectRecord(item) {
		this.proxySearch=item;
		this.onSearch({detail:item});
	},
	// 查看巡查信息详情
	handleWatchDetail(id) {
		uni.navigateTo(this.searchComponentInfo.navigateTo(id));
	},
	handleCancel() {
		wx.navigateBack({
			delta: 1
		});
	}
  },
});
</script>
<style lang='less' scoped>
  header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    label {
      color: #0091FF;
	  position: relative;
	  left: -14rpx;
    }
    van-search {
      padding: 0rem;
      width: 85%;
      .van-cell {
        display: flex;
        align-items: center;
      }
      .van-search__content {
        background: #F2F2F2;
      }
      .van-field__control::-webkit-input-placeholder{
        color: #999999;
      }
    }
  }
  main {
    .search-record-header {
        margin: 40rpx 0rpx;
        padding: 0rpx 5%;
        position: relative;
        display: flex;
        align-items: center;
      .search-record-header__title {
        color: #333333;
        font-weight: 800;
      }
      .search-record-header__delete {
		width: 28rpx;
		height: 30rpx;
		background: url(https://z3.ax1x.com/2021/10/20/5BTcJP.png) no-repeat;
		background-size: contain;
		position: absolute;
		right: 4%;
      }
	  .search-record-header__all-clear {
		color: #666666;
		font-size: 28rpx;
		position: absolute;
		right: 16%;
	  }
	  .search-record-header__complete {
	  	color: #0091FF;
		font-size: 28rpx;
		position: absolute;
		right: 4%;
	  }
    }
    .search-record-content {
        padding: 0rem 4%;
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        li {
            position: relative;
            margin: 2.5% 1.5%;
            label {
              color: #7E7E7E;
              background: #F8F8F8;
              border-radius: 1rem;
              padding: 10rpx 30rpx;
              white-space: nowrap;
            }
            i {
			  width: 20rpx;
			  height: 20rpx;
			  background: url(https://z3.ax1x.com/2021/10/20/5BTrdA.png) no-repeat;
			  background-size: contain;
			  position: absolute;
			  top: -14rpx;
			  right: -2rpx;
            };
        }
    }
	.no-search-record-content {
		text-align: center;
		margin-top: 100rpx;
		text {
			color: #666666;
		}
	}
	.search-result-content {
		text {
			display: block;
			color: #666666;
			margin: 0rpx 8%;
			border-bottom: 1rpx solid #DDDDDD;
			padding: 30rpx 0rpx;
		}
	}
  }
</style>
