<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-08 09:33:38
 * @LastEditTime: 2022-05-27 13:52:14
-->
<template>
  <image
    @click.stop="handlePreviewImage"
    :style="style"
    :src="src"
    :mode="mode"
  ></image>
</template>
<script>
export default {
  props: {
    style: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
  },
  methods: {
    // 预览图片
    handlePreviewImage() {
      wx.previewImage({
        current: this.src, // 当前显示图片的http链接
        urls: [this.src], // 需要预览的图片http链接列表
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
