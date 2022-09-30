<template>
  <view class="personal-center">
    <header
      :style="{
        backgroundImage: `url(${imgStaticUrl}/personal-center/personalCenter-banner.png)`,
      }"
    >
      <image
        :src="`${imgStaticUrl}/home/default-head-portrait.png`"
        mode=""
        class="avatar"
      ></image>
      <view class="userInfo">
        <label class="userName">{{ userInfo.contactName||'同学'}}</label>
        <p class="role">{{ userInfo.majorPositionVOS[0].positionName||'暂无职位' }}</p>
      </view>
    </header>
    <main>
      <header class="">
        <van-icon name="setting-o" />
        <label>收藏项目</label>
        <van-button type="info" size="small" @click="handleAddProject">添加项目</van-button>
      </header>

      <view v-if="projectList.length!=0" class="project-container">
        <view class="project" v-for="(projectItem, projectKey) in projectList" :key="projectKey">
          <van-cell>
            <view slot="title">
              <i class="project-icon" :style="{
                backgroundImage: `url(${imgStaticUrl}/personal-center/project-icon.png)`,
              }">{{`项目${projectKey+1}`}}</i>
              <text class="project-title">{{projectItem.projectName}}</text>
            </view>
            <view slot="right-icon">
              <van-icon name="add-o" size="40rpx" @click="handleProjectClick(projectItem.id)"/>
              <van-icon name="delete-o" size="40rpx" @click="handleDeleteProject(projectItem.id)"/>
            </view>
          </van-cell>
          <van-cell v-for="(targetItem, targetKey) in projectItem.projectThirdTargets" :key="targetKey">
            <view slot="title">
              <text class="project-content">{{targetItem.thirdTargetName}}</text>
            </view>
            <van-icon slot="right-icon" name="cross" class="custom-icon" @click="handleDeleteTarget(projectItem.id, targetItem.id)"/>
          </van-cell>
        </view>
      </view>
      <van-empty v-else description="暂无数据" />
    </main>
    <van-action-sheet :show="actionSheetVisible" :title="actionSheetTitle" @close="handleActionSheetClose">
      <block v-if="projectVisible">
        <van-cell v-for="(projectItem, projectKey) in actionSheetProjectList" :key="projectKey"
          class="project-title" :title="projectItem.projectName" is-link  @click="handleProjectClick(projectItem.id)" />
      </block>

      <view v-if="!projectVisible" class="target-list">
        <van-checkbox-group :value="checkResult" @change="handleCheckChange">
          <van-cell-group>
            <van-cell
              v-for="(targetItem, targetKey) in targetList" :key="targetKey"
              :title="targetItem.thirdTargetName"
              value-class="value-class"
              clickable
              :data-index="targetKey"
            >
              <van-checkbox
                :class="targetKey"
                :name="targetItem.id"
              />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </view>

      <view v-if="!projectVisible" class="button-operation">
        <van-button type="default" size="small" @click="handleActionSheetClose">取消</van-button>
        <van-button type="info" size="small" @click="submit">确定</van-button>
      </view>
    </van-action-sheet>
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import { defineComponent } from 'vue';
import config from '@/static/config/index.js';
import store from '@/store';
import Dialog from '@/wxcomponents/vant/dist/dialog/dialog';

export default defineComponent({
  name: 'personalCenter',
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      defaultAvatar: this.$imgStaticUrl + '/home/user-icon.png',
      name: store.state.userInfo.userName,
      role: store.state.userInfo.role,
      actionSheetVisible: false,
      actionSheetTitle: '请选择工时项目',
      projectList: [],
      actionSheetProjectList: [],
      targetList: [],
      projectVisible: true,
      checkResult: [],
      projectId: '',
      userInfo: {}
    };
  },
  computed: {
    avatar() {
      let img = store.state.userInfo.avatar;
      return img
        ? img.startsWith('http')
          ? img
          : config.fileHost + img
        : null;
    },
  },
  onShow() {
    this.getCollectionProject();
  },
  onLoad() {
  },
  methods: {
    handleProjectClick(id) {
      console.log('handleProjectClick id', id);
      this.actionSheetVisible = true;
      this.projectVisible = false;
      this.actionSheetTitle = '请选择目标列表';
      this.projectId = id;
      this.checkResult = [];
      this.getTargetByProject();
    },
    handleCheckChange(event) {
      console.log('handleCheckChange event', event);
      this.checkResult = event.detail;
    },
    handleActionSheetClose() {
      this.actionSheetVisible = false;
      this.projectVisible = true;
      this.actionSheetTitle = '请选择工时项目';
    },
    handleAddProject() {
      this.actionSheetVisible = true;
      this.getCommonProject();
    },
    getCollectionProject() {
      this.$http.post({
        url: '/steward-manage/project/commonUseThirdTarget/personalCenter',
        data: {
          endTime: '',
          pageNum: 1,
          pageSize: 1000,
          search: '',
          startTime: ''
        },
      })
      .then(({ data }) => {
        console.log('/steward-manage/project/commonUseThirdTarget/personalCenter data', data);
        if (data.code == 200) {
          this.projectList = data.data.projectManages.records;
          this.userInfo = data.data.mailContactor;
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
          });
        }
      });
    },
    getCommonProject() {
      this.$http.post({
        url: '/steward-manage/project/commonUseThirdTarget/common/project/list'
      })
      .then(({ data }) => {
        console.log('/steward-manage/project/commonUseThirdTarget/common/project/list data', data);
        if (data.code == 200) {
          this.actionSheetProjectList = data.data;
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
          });
        }
      });
    },
    getTargetByProject() {
      this.$http.get({
        url: `/steward-manage/project/commonUseThirdTarget/common/project/target/list?projectId=${this.projectId}`
      })
      .then(({ data }) => {
        console.log('/steward-manage/project/commonUseThirdTarget/common/project/target/list data', data);
        if (data.code == 200) {
          if(data.data.length==0) {
            wx.showToast({
              title: '暂无该项目目标',
              icon: 'error',
            });
            this.targetList = [];
            return ;
          }
          this.targetList = data.data;
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
          });
        }
      });
    },
    submit() {
      this.$http.post({
        url: `/steward-manage/project/commonUseThirdTarget/addItemOrAction`,
        data: {
          projectId: this.projectId,
          thirdTargetIds: this.checkResult
        }
      })
      .then(({ data }) => {
        console.log('/steward-manage/project/commonUseThirdTarget/addItemOrAction data', data);
        if (data.code == 200) {
          this.handleActionSheetClose();
          this.getCollectionProject();
          wx.showToast({
            title: '添加成功',
            icon: 'success',
          });
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
          });
        }
      });
    },
    handleDeleteProject(id) {
      Dialog.confirm({
        title: '提示',
        message: '是否删除该项目',
      })
      .then(() => {
        this.$http.post({
          url: `/steward-manage/project/commonUseThirdTarget/deleteItem`,
          data: JSON.stringify([id])
        })
        .then(({ data }) => {
          console.log('/steward-manage/project/commonUseThirdTarget/deleteItem data', data);
          if (data.code == 200) {
            this.getCollectionProject();
            wx.showToast({
              title: '删除项目成功',
              icon: 'success',
            });
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
            });
          }
        });
      })
      .catch(() => {
        // on cancel
      });
    },
    handleDeleteTarget(projectId,targetId) {
      Dialog.confirm({
        title: '提示',
        message: '是否删除该目标',
      })
      .then(() => {
        this.$http.post({
          url: `/steward-manage/project/commonUseThirdTarget/deleteAction`,
          data: {
            projectId: projectId,
            ids: [targetId]
          }
        })
        .then(({ data }) => {
          console.log('/steward-manage/project/commonUseThirdTarget/deleteAction data', data);
          if (data.code == 200) {
            this.getCollectionProject();
            wx.showToast({
              title: '删除目标成功',
              icon: 'success',
            });
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
            });
          }
        });
      })
      .catch(() => {
        // on cancel
      });
    },
  },
});
</script>

<style lang="less">
page {
    background: #F5F5F5;
    height: 100%;
    overflow: hidden;
}
.personal-center {
  background: #F5F5F5;
  height: 100%;
  overflow: hidden;
  &>header {
    width: 95%;
    height: 180rpx;
    margin: 30rpx auto;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    position: relative;
    background-size: 713rpx 180rpx;
    .avatar {
      margin-left: 36rpx;
      width: 108rpx;
      height: 108rpx;
      border-radius: 50%;
    }
    .userInfo {
      margin-left: 20rpx;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      .userName {
        margin-bottom: 10rpx;
        font-weight: 800;
      }
      .role {
      }
    }
  }
  main {
    height: calc(100% - 240rpx);
    &>header {
      display: flex;
      align-items: center;
      margin: auto auto 20rpx auto;
      box-sizing: border-box;
      padding: 0rpx 3%;
      label {
        margin-left: 10rpx;
      }
      van-button {
        margin-left: auto;
        margin-right: 0rpx;
      }
    }
    .project-container {
      max-height: calc(100% - 80rpx);
      overflow: auto;
      .project {
        margin-bottom: 20rpx;
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
        .van-icon-delete-o {
          margin-left: 20rpx;
        }
        .project-content {
          color: #666666;
        }
      }
    }
  }
  van-action-sheet {
    .target-list {
      max-height: 530rpx;
      overflow: auto;
    }
    .project-title {
      font-weight: 800;
    }
    .value-class {
      flex: none !important;
    }
    .button-operation {
      display: flex;
      padding: 30rpx 0rpx;
      van-button:first-of-type {
        margin-left: auto;
      }
      van-button:last-of-type {
        margin-left: 20rpx;
        margin-right: 35rpx;
      }
    }
  }
}
</style>
