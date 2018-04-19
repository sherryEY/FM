// components/playerComponent/playerComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    audioType: {
      type: String,
      value: " "
    },
    alignValue: {
      type: String,
      value: " "
    },
    audioTitle: {
      type: String,
      value: " "
    },
    audioAuthor: {
      type: String,
      value: " "
    },
    audioReader: {
      type: String,
      value: " "
    },
    description: {
      type: String,
      value: "暂无文本",
      observer: function(newValue,oldValue){
        let utils = require("../../utils/util.js")
        this.setData({
          nodes: utils.textFormat(utils.textAnalysis(newValue))
        })
        if(this.data.showLyric){
          this.hideAudio()
        }
      }
    },
    playState: {
      type: Boolean,
      value: false
    },
    bgColor: {
      type: String,
      value: ""
    },
    progressTime: {
      type: Number,
      value: 0
    },
    time: {
      type: String,
      value: "00:00"
      // observer: function (newValue, oldValue) {
      //   let utils = require("../../utils/util.js")
      //   this.setData({
      //     maxTime: newValue
      //   })
      // }
    },
    isLike: {
      type: Boolean,
      value: false
    },
    playOrder: {
      type: Number,
      value: 1
    },
    progressValue: {
      type: Number,
      value: 0
    },
    isNew: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    image: {
      playingImg: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTE0MzU5NjY3MzMyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijk3MDYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTI4LjAwMDI0IDEwOS41Njc5MzJDMTI4LjAwMDI0IDQ5LjA4Nzk2OSAxNzYuNjQwMjEgMCAyMzcuNjk2MTcxIDAgMjk4LjMwNDEzNCAwIDM0Ny41MjAxMDMgNDkuNDA3OTY5IDM0Ny41MjAxMDMgMTA5LjU2NzkzMnY4MDQuODYzNDk2QTEwOS40Mzk5MzIgMTA5LjQzOTkzMiAwIDAgMSAyMzcuNjk2MTcxIDEwMjMuOTk5MzYgMTA5Ljg4NzkzMSAxMDkuODg3OTMxIDAgMCAxIDEyOC4wMDAyNCA5MTQuNDMxNDI4VjEwOS41Njc5MzJ6IG01NDguNTQzNjU3IDBjMC02MC40Nzk5NjIgNDguNzAzOTctMTA5LjU2NzkzMiAxMDkuNzU5OTMyLTEwOS41Njc5MzJDODQ2Ljg0Nzc5MSAwIDg5NS45OTk3NiA0OS40MDc5NjkgODk1Ljk5OTc2IDEwOS41Njc5MzJ2ODA0Ljg2MzQ5NkExMDkuNDM5OTMyIDEwOS40Mzk5MzIgMCAwIDEgNzg2LjMwMzgyOSAxMDIzLjk5OTM2YTEwOS44ODc5MzEgMTA5Ljg4NzkzMSAwIDAgMS0xMDkuNzU5OTMyLTEwOS41Njc5MzJWMTA5LjU2NzkzMnoiIHAtaWQ9Ijk3MDciIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=",
      playImg: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTE0MjgxNjI1ODcyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4NTIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODk1LjggNTY0LjJMMjIwLjcgOTUxLjRjLTQwLjYgMjQuMy05NC02LTk0LTUyLjVWMTI0YzItNDUuMyA1Ni4xLTc0LjkgOTcuNS01Mi4yTDg5Ni4zIDQ1OWM0MC42IDI0LjMgNDAuNiA4MC43LTAuNSAxMDUuMnoiIHAtaWQ9IjE4NTMiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=",
      listImg: "../../src/img/img-list.png",
      nextImg: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+ PHN2ZyB0PSIxNTE0MzQ3Njg4NjQ1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwMDYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI + PGRlZnM + PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjEzLjMzMzMzMyAxMDIuNGw1MjkuMDY2NjY3IDM0MS4zMzMzMzNjMjEuMzMzMzMzIDEyLjggMzguNCAyNS42IDQ2LjkzMzMzMyA0Mi42NjY2NjdWMHMxNzAuNjY2NjY3IDM4LjQgMTcwLjY2NjY2NyAxMjh2NzY4YzAgODkuNi0xNjYuNCAxMjgtMTcwLjY2NjY2NyAxMjhWNTcxLjczMzMzM2MtOC41MzMzMzMgMTcuMDY2NjY3LTI1LjYgMjkuODY2NjY3LTQ2LjkzMzMzMyA0Mi42NjY2NjdMMjEzLjMzMzMzMyA5NTUuNzMzMzMzYy04MS4wNjY2NjcgNDYuOTMzMzMzLTE0OS4zMzMzMzMgOC41MzMzMzMtMTQ5LjMzMzMzMy04NS4zMzMzMzN2LTY4Mi42NjY2NjdjMC05My44NjY2NjcgNjguMjY2NjY3LTEzMi4yNjY2NjcgMTQ5LjMzMzMzMy04NS4zMzMzMzN6IiBwLWlkPSIxMDA3IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg + PC9zdmc + ",
      prevImg: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTE0MzQ3Njc4NTc5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4NTkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODEwLjY2NjY2NyA5MjEuNmwtNTI5LjA2NjY2Ny0zNDEuMzMzMzMzYy0yMS4zMzMzMzMtMTIuOC0zOC40LTI1LjYtNDYuOTMzMzMzLTQyLjY2NjY2N1YxMDI0cy0xNzAuNjY2NjY3LTM4LjQtMTcwLjY2NjY2Ny0xMjhWMTI4YzAtODkuNiAxNjYuNC0xMjggMTcwLjY2NjY2Ny0xMjh2NDUyLjI2NjY2N2M4LjUzMzMzMy0xNy4wNjY2NjcgMjUuNi0yOS44NjY2NjcgNDYuOTMzMzMzLTQyLjY2NjY2N2w1MjkuMDY2NjY3LTM0MS4zMzMzMzNjODEuMDY2NjY3LTQ2LjkzMzMzMyAxNDkuMzMzMzMzLTguNTMzMzMzIDE0OS4zMzMzMzMgODUuMzMzMzMzdjY4Mi42NjY2NjdjMCA5My44NjY2NjctNjguMjY2NjY3IDEzMi4yNjY2NjctMTQ5LjMzMzMzMyA4NS4zMzMzMzN6IiBwLWlkPSIxODYwIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+",
      likeImgA: "../../src/img/heart.png",
      likeImgB: "../../src/img/blank-heart.png",
      order: ["../../src/img/random.png",
      "../../src/img/order.png",
      "../../src/img/single.png"]
    },
    aniShow: {},
    aniHide: {},
    aniLeave: {},
    showLyric: false,
    nodes: [],
    maxTime: 100
  },
  /**
   * 组件的方法列表
   */
  methods: {
    playClick: function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      //如果当前正在播放就暂停音频
      if (!this.properties.playState){
        this.triggerEvent('playAudio', myEventDetail, myEventOption)
      }
      //如果当前没有播放则开始播放音频
      else{
        this.triggerEvent('pauseAudio', myEventDetail, myEventOption)
      }
    },
    playNext: function() {
      this.triggerEvent("playNext")
    },
    playPrev: function () {
      this.triggerEvent("playPrev")
    },
    isLike: function() {
      this.triggerEvent("isLikeClick")
    },
    goToList: function(type) {
      var myEventDetail = {}
      var myEventOption = {}
      this.triggerEvent("goToList", myEventDetail, myEventOption)
    },
    goToFind: function() {
      var myEventDetail = {}
      var myEventOption = {}
      this.triggerEvent("goToFind", myEventDetail, myEventOption)
    },
    sliderMove: function(event){
      var myEventDetail = event.detail
      var myEventOption = {}
      this.triggerEvent("sliderMove", myEventDetail, myEventOption)
    },
    changePlayOrder: function(event){
      var myEventDetail = {}
      var myEventOption = {}
      this.triggerEvent("changePlayOrder", myEventDetail, myEventOption)
    },
    showLyric: function(){
      let i = 1
      if (!this.data.showLyric) {
        i = 0
      }
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      this.animation = animation
      animation.opacity(i).step()
      this.setData({
        aniShow: animation.export()
      })
    },
    leaveBtn: function(){
      let i = 1000
      if (!this.data.showLyric){
        i = 0
      }
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      this.animation = animation
      animation.translateY(i).step()
      this.setData({
        aniLeave: animation.export()
      })
    },
    hideAudio: function(){
      this.setData({
        showLyric: !this.data.showLyric
      })
      let i = 0 
      if(!this.data.showLyric){
        i = 1
      }
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      this.animation = animation
      animation.opacity(i).step()
      this.setData({
        aniHide: animation.export()
      })
      this.showLyric()
      this.leaveBtn()
    },
  },
  attached: function() {
    // let utils = require("../../utils/util.js")
    // this.setData({
    //   maxTime: utils.getTimer(this.properties.time),
    //   nodes: this.textFormat(this.textAnalysis(this.properties.description))
    // })

  },
  ready: function() {
    // console.log(this.properties.time)
    // console.log(this.properties.description)
  }
})
