//app.js
App({
  login: () => {
    if (wx.getStorageSync("session_id")) return;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        if(res.code){
          wx.request({
            url: "https://fm.bjnews.com.cn/api/sessionid",
            data: {
              code: res.code
            },
            success: res => {
           
              console.log(res.data.data)
              // this.globalData.isNew = res.data.data.is_new
              wx.setStorageSync("session_id", res.data.data.session_id)
            }
          })
        }else{
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  getBgImg: function(){
    let arr = [3, 7, 8, 9, 11, 13, 15, 17, 18, 19, 20, 21, 22, 23, 23, 25, 27, 29, 31, 33, 37, 39, 41, 43]
    let idx = parseInt(Math.random() * 24)
    this.globalData.bgImg = "https://fm.bjnews.com.cn/upload/bgimg/img-" + arr[idx] + ".jpg"
    // wx.request({
    //   url: 'https://fm.bjnews.com.cn/api/getbgimg',
    //   success: res => {
    //     if(res.data.data.length != 0){
    //       this.globalData.bgImg = res.data.data[1]
    //     }
    //   }
    // })
  },
  onLaunch: function () {
    this.getBgImg()
    this.login()
  },
  globalData: {
    userInfo: null,
    bgImg: "",
    isNew: 0
  }
})