// pages/notes/notes.ts
Page({

  /**
   * Page initial data
   */
  data: {
    notes : new Array(),
    nickName: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option) {
    this.data.nickName = option.nickName
    if (this.data.nickName != "") {
      let that = this
      wx.request({
        url: 'https://m.dannyhkk.cn:8088/helloservice/getnotes', //仅为示例，并非真实的接口地址
        data: {
          "head": {
            "id": this.data.nickName,
          },
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success (res) {
          console.log(res.data)
          if (res.data.Head.code === 0) {
            that.setData({
              notes: JSON.parse(res.data.notes)
            })
          }
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