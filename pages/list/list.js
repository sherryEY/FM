// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [
      { id: "1", channel_name: "听书" },
      { id: "2", channel_name: "听诗" },
      { id: "3", channel_name: "讲座" },
      { id: "4", channel_name: "人物" }
    ],
    list: [
      
    ],
    currentChannel: "channel",
    currentAudio: "audio",
    playing: false,
    scrollTop: 0,
    bgImg: ""
  },
  //上拉加载更多
  loadMore: function(){
    //收藏列表
    if (this.data.currentChannel == "channel_like") {
      wx.request({
        url: "https://fm.bjnews.com.cn/api/favlist",
        data: {
          last_id: this.data.list[this.data.list.length - 1].id,
          session_id: wx.getStorageSync("session_id")
        },
        success: res => {
          // console.log(res)
          if (res.data.data) {
            this.setData({
              list: this.data.list.concat(res.data.data)
            })
          }
        }
      })
    }
    else {
      wx.request({
        url: "https://fm.bjnews.com.cn/api/list",
        data: {
          channel_id: parseInt(this.data.currentChannel.split("_")[1])+1,
          last_sort: this.data.list[this.data.list.length - 1].sort,
          session_id: wx.getStorageSync("session_id")
        },
        success: res => {
          // console.log(res)
          this.setData({
            list: this.data.list.concat(res.data.data)
          })
          // console.log(this.data.list)
        }
      })
    }
  },
  // tab切换
  tabClick: function(event) {
    wx.showLoading({
      title: '加载中……'
    })
    // console.log(event)
    this.setData({
      currentChannel: "channel_" + event.target.dataset.type,
      scrollTop: 0
    })
    //收藏列表
    if (event.target.dataset.type == "like"){
      wx.request({
        url: "https://fm.bjnews.com.cn/api/favlist",
        data: {
          last_id: 0,
          session_id: wx.getStorageSync("session_id")
        },
        success: res => {
          // console.log(res)
          if(res.data.data){
            this.setData({
              list: res.data.data
            })
            wx.hideLoading()
          }
        }
      })
    }
    else{
      wx.request({
        url: "https://fm.bjnews.com.cn/api/list",
        data: {
          channel_id: parseInt(event.target.dataset.type)+1,
          last_sort: 0,
          session_id: wx.getStorageSync("session_id")
        },
        success: res => {
          // console.log(res)
          wx.hideLoading()
          this.setData({
            list: res.data.data
          })
        }
      })
    }
  },
  gotoPlay: function(event){
    wx.reLaunch({
      url: "../index/index?fromType="+ event.currentTarget.dataset.type + "&fromId=" + event.currentTarget.dataset.id
    })
  },
  gotoBack: function(){
    wx.navigateBack()
  },
  compare: function (prop) {
    return function (obj1, obj2) {
      let val1 = obj1[prop]
      let val2 = obj2[prop]
      if (val2 < val1) {
        return 1
      }
      else if (val2 > val1) {
        return -1
      }
      else {
        return 0
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中……',
    })
    this.setData({
      bgImg: getApp().globalData.bgImg
    })
    let _this = this
    this.setData({
      currentChannel: "channel_" + options.fromType
    })
    wx.request({
      url: "https://fm.bjnews.com.cn/api/list",
      data: {
        channel_id: parseInt(options.fromType) + 1,
        last_sort: 0,
        session_id: wx.getStorageSync("session_id")
      },
      success: res => {
        // console.log(res)
        wx.hideLoading()
        this.setData({
          list: res.data.data
        })
      }
    })
    if(options.playing == "true"){
      this.setData({
        playing: true,
        currentAudio: options.fromId
      })
      // console.log(this.data.currentAudio)
    }
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
        play_state: [false, false, false, false]
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