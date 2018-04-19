//index.js
//获取应用实例

const app = getApp()


Page({
  data: {
    bg_color: [
      'background-image: -webkit-linear-gradient(bottom,rgba(144,165,218,0.6) 0%,rgba(87,115,165,0.6) 100%);background- image: linear-gradient(top, rgba(144,165,218,0.6) 0%,rgba(87,115,165,0.6) 100%);',
      'background-image: -webkit-linear-gradient(bottom,rgba(140,134,163,0.6) 0%,rgba(208,144,159,0.6) 100%);background- image: linear-gradient(top, rgbargba(140,134,163,0.6) 0%,rgba(208,144,159,0.6) 100%);',
      'background-image: -webkit-linear-gradient(bottom,rgba(144,197,205,0.6) 0%,rgba(212,229,165,0.6) 100%);background- image: linear-gradient(top,rgba(144,197,205,0.6) 0%,rgba(212,229,165,0.6) 100%);',
      'background-image: -webkit-linear-gradient(bottom,rgba(175,144,134,0.6) 0%,rgba(244,176,155,0.6) 100%);background- image: linear-gradient(top,rgba(175,144,134,0.6) 0%,rgba(244,176,155,0.6) 100%);'
    ],
    audioList: [],
    channelList: [
        { id: "1", channel_name: "听书" },
        { id: "2", channel_name: "听诗" },
        { id: "3", channel_name: "讲座" },
        { id: "4", channel_name: "人物" }
    ],
    progressList: [0,0,0,0],
    play_state: [false,false,false,false],
    currentType: 0,
    playOrder: 1,
    tag: null,
    progressList: [0,0,0,0],
    timeList: ["00:00", "00:00", "00:00", "00:00"],
    bgImg: 'https://fm.bjnews.com.cn/upload/bgimg/img-1.jpg',
    isNew: 0
  },
  onPauseAudio: function(event){
    this.setData({
      play_state: [false, false, false, false]
    })
    clearTimeout(this.data.tag)
    this.setData({
      tag: null
    })
    wx.pauseBackgroundAudio();
  },
  onPlayAudio: function (event) { 
    let utils = require('../../utils/util.js')
    let eventType = parseInt(event.target.dataset.type)
    let currentItem = "play_state[" + eventType + "]"
    let progressItem = "progressList[" + eventType + "]"
    let timeItem = "timeList["+eventType+"]"
    let _this = this
    let oneSec = 1 / utils.getTimer(this.data.timeList[eventType]) * 100
    let src, title, img
    // 监听音乐自然播放结束
    var musicEnd = function () {
      _this.setData({
        [timeItem]: _this.data.audioList[eventType].audio_time,
        [progressItem]: 0
      })
      //随机播放
      if (_this.data.playOrder == 0) {
        //获取随机音频
        wx.request({
          url: "https://fm.bjnews.com.cn/api/getrandone",
          data: {
            channel_id: eventType,
            session_id: wx.getStorageSync("session_id")
          },
          success: res => {
            //列表中不止一曲音乐
            if (res.data.data.length != 0 && res.data.data.audio_url) {
              _this.setData({
                [currentItem]: res.data.data
              })
            }
            let pages = getCurrentPages();
            if (pages.length > 1 && pages[pages.length - 1].data.playing) {
              pages[pages.length - 1].setData({
                playing: true
              })
            }
            if (pages.length > 1 && pages[pages.length - 1].data.currentAudio) {
              pages[pages.length - 1].setData({
                currentAudio: "id" + res.data.data.id
              })
            }
            _this.onPlayAudio(event)
          }
        })
      }
      //顺序播放
      else if (_this.data.playOrder == 1) {
        _this.onPlayNext(event)
      }
      //单曲循环
      else {
        _this.onPlayAudio(event)
      }
    }
    let time = function() {
      //清除定时器
      clearTimeout(_this.data.tag)
      if (utils.getTimer(_this.data.timeList[eventType]) <= 0){
        _this.setData({
          [timeItem]: "00:00",  //获取当前剩余时间
          [progressItem]: _this.data.progressList[eventType] + oneSec //计算一秒钟所占百分比
        })
      }else{
        _this.setData({
          [timeItem]: utils.setTimer(utils.getTimer(_this.data.timeList[eventType]) - 1),  //获取当前剩余时间
          [progressItem]: _this.data.progressList[eventType] + oneSec //计算一秒钟所占百分比
        })
      }
      _this.setData({
        tag: setTimeout(time, 1000)
      })
    }
    //获取音频播放路径
    src = _this.data.audioList[eventType].audio_url
    //获取音频标题  
    title = _this.data.audioList[eventType].title
    img = _this.data.audioList[eventType].pic_url
    // 开始播放音乐
    wx.playBackgroundAudio({
      dataUrl: src,
      title: title,
      coverImgUrl: img,
      success: function () {
        _this.setData({
          [currentItem]: true
        })
      },
      fail: function(){
        console.log("播放失败")
      }
    })
    //监听音乐播放
    wx.onBackgroundAudioPlay(function () {
      let timer
      clearTimeout(timer)
      //创建一个定时器
      timer = setTimeout(function(){
        time()
      },1000)
      _this.setData({
        [currentItem]: true
      })
    })
    // 监听音乐暂停
    wx.onBackgroundAudioPause(function () {
      //清除定时器
      clearTimeout(_this.data.tag)
      _this.setData({
        tag: null,
        play_state: [false, false, false, false]
      })   
    })
    // 监听音乐停止
    wx.onBackgroundAudioStop(function () {
      if (utils.getTimer(_this.data.timeList[eventType]) <= 1){
        musicEnd()
        clearTimeout(_this.data.tag)
        return
      }
      //清除定时器
      clearTimeout(_this.data.tag)
      _this.setData({
        play_state: [false, false, false, false],
        progressList: [0,0,0,0],
        timeList: [_this.data.audioList[0].audio_time, _this.data.audioList[1].audio_time, _this.data.audioList[2].audio_time, _this.data.audioList[3].audio_time]
      })
    })
  },
  onPlayPrev: function(event) {
    this.stopPlay()
    let eventType = parseInt(event.target.dataset.type)
    let currentItem = "audioList[" + eventType + "]"
    let progressItem = "progressList[" + eventType + "]"
    let timeItem = "timeList[" + eventType + "]"
    let _this = this
    //获取上一首
    wx.request({
      url: "https://fm.bjnews.com.cn/api/getadjacentone",
      data: {
        channel_id: eventType + 1,
        type: "up",
        session_id: wx.getStorageSync("session_id"),
        id: parseInt(event.target.dataset.id)
      },
      success: res => {
        // console.log(res)
        //当前为列表中第一首时，获取列表中的最后一首
        if(!res.data.data.id && res.data.data.length == 0){
          wx.request({
            url: "https://fm.bjnews.com.cn/api/getlastfromlist",
            data: {
              channel_id: eventType + 1,
              session_id: wx.getStorageSync("session_id")
            },
            success: res => {
              _this.setData({
                [currentItem]: res.data.data,
                [timeItem]: res.data.data.audio_time,
              })
              // console.log(_this.data.timeList)
              _this.onPlayAudio(event)
            }
          })
        }
        //当前不是第一首
        else{
          _this.setData({
            [currentItem]: res.data.data,
            [timeItem]: res.data.data.audio_time,
          })
          // console.log(_this.data.timeList)
          _this.onPlayAudio(event)
        }
        _this.setData({
          [progressItem]: 0
        })
      }
    })
  },
  onPlayNext: function(event) {
    this.stopPlay()
    let eventType = parseInt(event.target.dataset.type)
    let currentItem = "audioList[" + eventType + "]"
    let progressItem = "progressList[" + eventType + "]"
    let timeItem = "timeList[" + eventType + "]"
    let _this = this
    //获取下一首
    wx.request({
      url: "https://fm.bjnews.com.cn/api/getadjacentone",
      data: {
        channel_id: eventType + 1,
        type: "down",
        session_id: wx.getStorageSync("session_id"),
        id: parseInt(event.target.dataset.id)
      },
      success: res => {
        //当前为列表中最后一首时，获取列表中的第一首
        if (!res.data.data.id && res.data.data.length == 0) {
          wx.request({
            url: "https://fm.bjnews.com.cn/api/list",
            data: {
              channel_id: eventType + 1,
              last_sort: 0,
              session_id: wx.getStorageSync("session_id")
            },
            success: res => {
              this.setData({
                [timeItem]: res.data.data.audio_time,
                [currentItem]: res.data.data[0] //list中的第一首歌赋值给audioList
              })
              let pages = getCurrentPages();
              if (pages.length > 1 && pages[pages.length - 1].data.playing) {
                pages[pages.length - 1].setData({
                  playing: true
                })
              }
              if (pages.length > 1 && pages[pages.length - 1].data.currentAudio) {
                pages[pages.length - 1].setData({
                  currentAudio: "id" + res.data.data.id
                })
              }
              _this.onPlayAudio(event)
            }
          })
        }
        //当前不是最后一首
        else {
          _this.setData({
            [timeItem]: res.data.data.audio_time,
            [currentItem]: res.data.data
          })
          let pages = getCurrentPages();
          if (pages.length > 1 && pages[pages.length - 1].data.playing) {
            pages[pages.length - 1].setData({
              playing: true
            })
          }
          if (pages.length > 1 && pages[pages.length - 1].data.currentAudio) {
            pages[pages.length - 1].setData({
              currentAudio: "id" + res.data.data.id
            })
          }
          _this.onPlayAudio(event)
        }
        _this.setData({
          [progressItem]: 0
        })
      }
    })
  },
  isLikeClick: function (event) {
    let eventType = parseInt(event.target.dataset.type)
    let currentItem = "audioList[" + eventType + "].is_fav"
    wx.request({
      url: "https://fm.bjnews.com.cn/api/fav",
      data: {
        id: event.target.dataset.id,
        session_id: wx.getStorageSync("session_id")
      },
      success: res => {
        // console.log(res)
        if(res.data.data.active == 'del'){
          this.setData({
            [currentItem]: 0
          })
        } else if (res.data.data.active == 'add'){
          this.setData({
            [currentItem]: 1
          })
        }
      }
    })
  },
  onGoToList: function(event) {
    let playing = false
    let fromType = parseInt(event.target.dataset.type)
    if(this.data.play_state.indexOf(true) != -1){
      playing = true
    }
    wx.navigateTo({
      url: "../list/list?fromType=" + fromType + "&fromId=id" + event.target.dataset.id + "&playing=" + playing
    })
  },
  onGoToFind: function(event){
    let playing = false
    if (this.data.play_state.indexOf(true) != -1) {
      playing = true
    }
    wx.navigateTo({
      url: "../find/find?playing=" + playing
    })
  },
  stopPlay: function() {
    wx.stopBackgroundAudio()
  },
  changePlayOrder: function(){
    if(this.data.playOrder == 2){
      this.setData({
        playOrder: 0
      })
      return
    }
    this.setData({
      playOrder: this.data.playOrder+1
    })
  },
  compare: function(prop) {
    return function(obj1,obj2){
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
  hideTips: function(){
    this.setData({
      isNew: 0
    })
  },
  homePage: function(options){
    let _this = this
    let eventType = parseInt(options.fromType)
    wx.request({
      url: "https://fm.bjnews.com.cn/api/homepage",
      data: {
        session_id: wx.getStorageSync("session_id")
      },
      success: res => {
        //如果第一次获取到的homepage为空，说明当前的session_id是无效的。
        if(res.data.data.length == 0){
          //登录
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              // console.log(res)
              if (res.code) {
                wx.request({
                  url: "https://fm.bjnews.com.cn/api/sessionid",
                  data: {
                    code: res.code
                  },
                  success: res => {
                    wx.setStorageSync("session_id", res.data.data.session_id)
                    _this.homePage(options)
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          })
        }
        //当前获取的数据不为空
        else{
          res.data.data.sort(_this.compare("channel_id"))
          this.setData({
            audioList: res.data.data.sort(_this.compare("channel_id"))
          })
          this.setData({
            timeList: [this.data.audioList[0].audio_time, this.data.audioList[1].audio_time, this.data.audioList[2].audio_time, this.data.audioList[3].audio_time]
          })
        }
        //如果是从其它页面跳转过来的
        if (options.fromType) {
          let event = {
            target: {
              dataset: {
                type: eventType - 1,
                id: parseInt(options.fromId)
              }
            }
          }
          //swiper显示current
          this.setData({
            currentType: eventType - 1
          })
          // 在audioList中修改当前类别的audio信息
          let currentItem = "audioList[" + (eventType - 1) + "]"
          // 获取需要修改的音频详情
          wx.request({
            url: "https://fm.bjnews.com.cn/api/detail",
            data: {
              session_id: wx.getStorageSync("session_id"),
              id: parseInt(options.fromId)
            },
            success: res => {
              // 将该音频详情替换audioList中对应栏目音频
              _this.setData({
                [currentItem]: res.data.data
              })
              _this.onPlayAudio(event)
            }
          })
        }
        wx.hideLoading()
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  //事件处理函数
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    getApp().getBgImg()
    this.setData({
      bgImg: getApp().globalData.bgImg,
      isNew: getApp().globalData.isNew
    })
    let _this = this
    let eventType = parseInt(options.fromType)
    //如果当前有session_id，则直接请求首页四条数据
    setTimeout(function(){
      _this.homePage(options)
    },1000)
  },
  onLaunch: function () {

  },
  onShow: function() {
    
  },
  onShareAppMessage: function(from,target) {
    return {
      title: '有时FM',
      success: function(res){
        wx.showModal({
          title: '您已成功分享有时FM',
          content: '',
          showCancel: true,
          cancelText: '关闭',
          cancelColor: '',
          confirmText: '',
          confirmColor: '',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res){
        wx.showModal({
          title: '您已取消分享',
          content: '',
          showCancel: true,
          cancelText: '关闭',
          cancelColor: '',
          confirmText: '',
          confirmColor: '',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }
  }
})
