// pages/home/home.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
// const host = app.globalData.host
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    filePath : '', //录音文件临时存放地址
    isSpeech: false, // 底部是否转化为语音 or 文本
    scrollHeight: 0,
    toView: '',
    windowHeight: 0,
    windowWidth: 0,
    pxToRpx: 2,
    msg: '',  //底部初始化文本应该有的字符串
    emotionBox: false,
    emotions: [],
    speechText: '按住 说话',
    changeImageUrl: '/images/voice.png',
    speechIcon: '/images/speech0.png',
    defaultSpeechIcon: '/images/speech0.png',
    emotionIcon: '/images/emotion.png',
    playingSpeech: ''
  },

  //底部喇叭转化键盘函数
  changeType: function () {
    if (this.data.isSpeech) {
      this.setData({
        isSpeech: false,
        changeImageUrl:  '/images/voice.png'
      });
    } else {
      this.setData({
        isSpeech: true,
        changeImageUrl:  '/images/keyinput.png',
        emotionBox: false,
        scrollHeight: (this.data.windowHeight - 50) * this.data.pxToRpx
      });
    }
  },
  //底部按住说话 or 输入框
  sendMessage(e) {
    this.setData({
      msg: e.detail.value,
    })
  },
  //开始录音
  startRecord: function () {
    var that=this
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    wx.authorize({
      scope: 'scope.record',
      success() {
        console.log("录音授权成功");
        //第一次成功授权后 状态切换为2
        that.setData({
          status: 2,
        })
        recorderManager.start(options);
        recorderManager.onStart(() => {
          console.log('recorder start')
        });
        //错误回调
        recorderManager.onError((res) => {
          console.log(res);
        })
      },
      fail() {
        console.log("第一次录音授权失败");
        wx.showModal({
          title: '提示',
          content: '您未授权录音，功能将无法使用',
          showCancel: true,
          confirmText: "授权",
          confirmColor: "#52a2d8",
          success: function (res) {
            if (res.confirm) {
              //确认则打开设置页面（重点）
              wx.openSetting({
                success: (res) => {
                  console.log(res.authSetting);
                  if (!res.authSetting['scope.record']) {
                    //未设置录音授权
                    console.log("未设置录音授权");
                    wx.showModal({
                      title: '提示',
                      content: '您未授权录音，功能将无法使用',
                      showCancel: false,
                      success: function (res) {
 
                      },
                    })
                  } else {
                    //第二次才成功授权
                    console.log("设置录音授权成功");
                    that.setData({
                      status: 2,
                    })
              
                    recorderManager.start(options);
                    recorderManager.onStart(() => {
                      console.log('recorder start')
                    });
                    //错误回调
                    recorderManager.onError((res) => {
                      console.log(res);
                    })
                  }
                },
                fail: function () {
                  console.log("授权设置录音失败");
                }
              })
            } else if (res.cancel) {
              console.log("cancel");
            }
          },
          fail: function () {
            console.log("openfail");
          }
        })
      }
    })
  },
  // 松开按钮之后结束
  stopRecord: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('停止录音', res.tempFilePath)
      this.setData({
        filePath: res.tempFilePath,
        speechText: '按住 说话'
      })
      innerAudioContext.src = res.tempFilePath
      //把语音传输到服务器翻译，把返回的字符串赋值
      this.setData({
      msg: "文件已传输",
      isSpeech:false
      })
    })

  },
  //播放语音
  play: function() {
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.play()
  },


  // 点击发送后的按钮
  send: function() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})