// pages/notes/notes.ts
Page({

  /**
   * Page initial data
   */
  data: {
    notes : new Array()
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option) {
    console.log(option)
    this.setData({
    notes: [{time: "2022/10/06 15:13:28", note: "this is a test note 1"},
    {time: "2022/10/06 15:13:28",note: "this is a test note 2"}]
    })
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