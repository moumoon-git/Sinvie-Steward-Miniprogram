<script>
import config from './static/config/index.js';
export default {
  onLaunch() {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate, '是否有新版本');
    });

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
    });
    console.log('App Launch');
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
};
</script>

<style>
@import "/wxcomponents/vant/dist/common/index.wxss";
page {
	/* --tabs-default-color:rgb(246, 246, 246);
		  --tabs-nav-background-color:rgb(246, 246, 246); */
	--tabs-bottom-bar-color: rgb(0, 145, 255);
	--text-color-primary: #0090fe;
	--text-color-gray: #455a64;
}
/*每个页面公共css */
.container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	padding: 200rpx 0;
	height: 100%;
}

@font-face {
  font-family: "YouSheBiaoTiHei";
  src: url("http://120.24.173.36:9000/sinvie/sinvie-steward/applet/font/YouSheBiaoTiHei.ttf");
}
</style>
