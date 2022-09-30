/*
 * @Descripttion: 
 * @version: 
 * @Date: 2022-03-30 17:43:09
 * @LastEditTime: 2022-04-16 18:11:55
 */
export default () => {
    const innerAudioContext = uni.createInnerAudioContext();
    wx.setInnerAudioOption({ obeyMuteSwitch: false});
    // 播放语音
    const handleVoicePlay = (item) => {
        innerAudioContext.stop();//音频停止
        innerAudioContext.autoplay = true;
        innerAudioContext.obeyMuteSwitch = false;
        innerAudioContext.src = item.url;
        if (item.isPlay) {
            innerAudioContext.play();
            innerAudioContext.onEnded(() => {
                //音频自然播放结束事件
                item.isPlay = false;
                innerAudioContext.src = "";
            });
        } else {
            innerAudioContext.stop();//音频停止
            innerAudioContext.onEnded(() => {
                //音频自然播放结束事件
                item.isPlay = false;
            });
        }
        console.log(item.isPlay,'item.isPlay')
    }
    // 处理语音长度
    const handleWidth = (length) => {
        console.log(length, "处理语音长度");
        length = length - 1;
        let Lmin = 100;
        let Lmax = 315;
        let barCanChangeLen = Lmax - Lmin;
        // 11秒以内的语音
        if (length < 11) {
            // VoicePlayTimes 为10秒时，正好为可变长度的一半
            return (
                Lmin + length * 0.05 * barCanChangeLen + "rpx");
        } else {
            // 12-60秒的语音
            return (
                Lmin +
                0.5 * barCanChangeLen +
                (length - 10) * 0.01 * barCanChangeLen +
                "rpx");
        }
    }

    return {
        handleVoicePlay,
        handleWidth
    }

}