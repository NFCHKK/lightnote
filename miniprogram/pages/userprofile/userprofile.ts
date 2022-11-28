// pages/userprofile.ts
Page({

  /**
   * Page initial data
   */
  data: {
      avatarUrl: "",
      nickName: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },
  onChooseAvatar(e:any) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  onInputNickName(e:any) {
    console.log(e)
      this.setData({
        nickName:e.detail.value
      })
  },
  onConfirm() {
    const info = {
      userInfo: {
        avatarUrl: this.data.avatarUrl,
        nickName: this.data.nickName,
      },
      tm: Date.now()/1000
    }
    try {
      let value = JSON.stringify(info)
      console.log("user info: " + value)
      wx.setStorageSync("avatar", value)
    } catch(error) {
      console.log("store user info error")
    }
    wx.navigateTo({
      url: "../index/index?avatarUrl=" + this.data.avatarUrl +"&nickName=" + this.data.nickName
    })
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