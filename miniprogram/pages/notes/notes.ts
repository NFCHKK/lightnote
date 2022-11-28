// pages/notes/notes.ts
var log = require("../logs/logs.js")
Page({

  /**
   * Page initial data
   */
  data: {
    notes : new Array(),
    openid: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option) {
    log.info("hello notes")
    this.data.openid = option.openid
    console.log(this.data.openid)
    if (this.data.openid != "") {
      let that = this
      wx.request({
        url: 'https://m.dannyhkk.cn:8088/helloservice/getnotes', //仅为示例，并非真实的接口地址
        data: {
          "head": {
            "id": this.data.openid,
          },
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success (res) {
          console.log(res.data)
          log.info("get notes success")
          if (res.data.Head.code === 0) {
            that.setData({
              notes: JSON.parse(res.data.notes)
            })
          }
        },
        fail (res) {
          console.log("get notes failed: " + res.errMsg)
          log.error("get notes failed: " + res.errMsg)
        }
      })
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})