// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_color: [
      'background-image: -webkit-linear-gradient(top,rgba(144,165,218,1) 0%,rgba(87,115,165,1) 100%);background-image: linear-gradient(bottom, rgba(144,165,218,1) 0%,rgba(87,115,165,1) 100%);',
      'background-image: -webkit-linear-gradient(top,rgba(140,134,163,1) 0%,rgba(208,144,159,1) 100%);background-image: linear-gradient(bottom, rgbargba(140,134,163,1) 0%,rgba(208,144,159,1) 100%);',
      'background-image: -webkit-linear-gradient(top,rgba(144,197,205,1) 0%,rgba(212,229,165,1) 100%);background-image: linear-gradient(bottom,rgba(144,197,205,1) 0%,rgba(212,229,165,1) 100%);',
      'background-image: -webkit-linear-gradient(top,rgba(202,185,178,1) 0%,rgba(244,176,155,1) 100%);background-image: linear-gradient(bottom,rgba(202,185,178,1) 0%,rgba(244,176,155,1) 100%);'
    ],
    positionList: [
      [
        "left:20rpx;top:90rpx;animation-duration:5s;animation-delay: 0.2s;",
        "left:50%;top:-10rpx;margin-left:-120rpx;animation-duration:5.5s;",
        "right:20rpx;top:90rpx;animation-duration:5.9s;",
        "left:0;top:350rpx;animation-duration:6.2s;animation-delay: 0.3s;",
        "left:260rpx;top:300rpx;animation-duration:6.3s;",
        "right:0;top:350rpx;animation-duration:5.8s;",
        "left:130rpx;top:570rpx;animation-duration:4.8s;",
        "right:130rpx;top:570rpx;animation-duration:7s;"
      ],
      [
        "left:50%;top:20rpx;margin-left:-120rpx;animation-duration:6s;",
        "left:0;top:240rpx;animation-duration:5s;",
        "left:50%;margin-left:-120rpx;top:280rpx;animation-duration:5.5s;",
        "right:0;top:240rpx;animation-duration:6.5s;",
        "left:120rpx;top:520rpx;animation-duration:7s;",
        "right:120rpx;top:520rpx;animation-duration:5s;animation-delay: 0.5s;"
      ],
      [
        "left:125rpx;top:40rpx;animation-duration:5s;",
        "right:125rpx;top:40rpx;animation-duration:5.6s;",
        "left:0rpx;top:280rpx;animation-duration:6s;animation-delay: 0.3s;",
        "right:0rpx;top:280rpx;animation-duration:6.3s;animation-delay: 0.5s;",
        "left:125rpx;top:520rpx;animation-duration:6.8s;",
        "right:125rpx;top:520rpx;animation-duration:7s;",
        "left:50%;margin-left:-120rpx;top:280rpx;animation-duration:6.5s;"
      ],
      [
        "left:50rpx;top:50rpx;animation-duration:5s;",
        "left:310rpx;top:20rpx;animation-duration:5.2s;animation-delay: 0.5s;",
        "left:0rpx;top:320rpx;animation-duration:5.4s;",
        "right:0rpx;top:160rpx;animation-duration:5.6s;animation-delay: 1s;",
        "left:70rpx;top:560rpx;animation-duration:5.8s;",
        "left:470rpx;top:560rpx;animation-duration:6s;animation-delay: 1.5s;",
        "left:290rpx;top:330rpx;animation-duration:6.2s;",
      ],
      [
      "left:5rpx;top:0rpx;animation-duration:5.2s;animation-delay: 0.5s;",
      "left:270rpx;top:40rpx;animation-duration:5.6s;animation-delay: 1s;",
      "left:40rpx;top:280rpx;animation-duration:6s;animation-delay: 1.5s;",
      "right:0rpx;top:160rpx;animation-duration:5.8s;",
      "left:70rpx;top:540rpx;animation-duration:5.4s;",
      "left:445rpx;top:580rpx;animation-duration:5s;",
      "left:320rpx;top:350rpx;animation-duration:6.2s;",
      ],
      [
        "right:5rpx;top:0rpx;animation-duration:6.2s;",
        "right:270rpx;top:40rpx;animation-duration:5s;",
        "right:40rpx;top:280rpx;animation-duration:5.8s;",
        "left:0rpx;top:160rpx;animation-duration:6s;animation-delay: 1.5s;",
        "right:70rpx;top:540rpx;animation-duration:5.4s;",
        "right:445rpx;top:580rpx;animation-duration:5.2s;animation-delay: 0.5s;",
        "right:320rpx;top:350rpx;animation-duration:5.6s;animation-delay: 1s;",
      ],
      [
        "right:5rpx;top:0rpx;animation-duration:5.8s;",
        "right:270rpx;top:40rpx;animation-duration:5.2s;animation-delay: 0.5s;",
        "right:40rpx;top:280rpx;animation-duration:5.8s;",
        "left:0rpx;top:160rpx;animation-duration:5.6s;animation-delay: 1s;",
        "right:70rpx;top:540rpx;animation-duration:5.4s;",
        "right:445rpx;top:580rpx;animation-duration:6s;",
        "right:320rpx;top:350rpx;animation-duration:6.2s;",
      ]
    ],
    list: [
  
    ],
    playing: false,
    aniShow: null,
    randomNum: 0
  },
  gotoPlay: function(event){
    // console.log(event)
    wx.reLaunch({
      url: "../index/index?fromType=" + event.currentTarget.dataset.type + "&fromId=" + event.currentTarget.dataset.id
    })
  },
  gotoBack: function () {
    wx.navigateBack()
  },
  changeOne: function(){
    let _this = this
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    this.animation = animation
    animation.opacity(0).step()
    this.setData({
      aniShow: animation.export()
    })
    setTimeout(function(){
      wx.request({
        url: "https://fm.bjnews.com.cn/api/tags",
        success: res => {
          _this.setData({
            randomNum: parseInt(Math.random() * _this.data.positionList.length)
          })
          let positionItem = "positionList["+_this.data.randomNum+"]"
          _this.setData({
            [positionItem]: _this.data.positionList[_this.data.randomNum].sort(_this.randomSort)
          })
          let animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease'
          })
          _this.animation = animation
          animation.opacity(1).step()
          _this.setData({
            list: res.data.data,
            aniShow: animation.export()
          })
        }
      })
    },200)
  },
  randomSort: function(a, b) {
    return Math.random() > 0.5 ? -1 : 1;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    if (options.playing == "true") {
      this.setData({
        playing: true
      })
    }
    wx.request({
      url: "https://fm.bjnews.com.cn/api/tags",
      success: res => {
        // console.log(res)
        _this.setData({
          randomNum: parseInt(Math.random() * _this.data.positionList.length)
        })
        this.setData({
          list: res.data.data
        })
      }
    })

    //监听音乐播放
    wx.onBackgroundAudioPlay(function () {
      _this.setData({
        playing: true
      })
    })
    //监听音乐暂停
    wx.onBackgroundAudioPause(function () {
      let pages = getCurrentPages();
      let currPage = pages[0]; //首页
      currPage.setData({
        play_state: [false,false,false,false]
      })
      _this.setData({
        playing: false
      })
    })
    //监听音乐停止
    wx.onBackgroundAudioStop(function () {
      let pages = getCurrentPages();
      let currPage = pages[0]; //首页
      currPage.setData({
        play_state: [false, false, false, false]
      })
      _this.setData({
        playing: false
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})