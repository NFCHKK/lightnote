// index.ts
// 获取应用实例

const app = getApp<IAppOption>()
Page({
  data: {
    userinput: "",
    store_data: new Array(),
    notes: new Array(),
    input_value: "",
    save_disable: true,
    edit_class: "note",
    pageName: "导图",
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: true,
    canIUseOpenData: false // 如需尝试获取用户信息可改为false
  },
  switchMode() {
    wx.navigateTo({
      url: '../mindmap/mind',
    })
  },
  getlocalDate() {
    let timeNow = new Date()
    return timeNow.getFullYear() + "/" + timeNow.getMonth() + "/" +
      timeNow.getDay() + " " + timeNow.getHours() + ":" + timeNow.getMinutes() + ":"
      + timeNow.getSeconds()
  },

  onAddData: function() {
    if(this.data.userinput === ""){
      return
    }
    let noteIns = {time: this.getlocalDate(), note: this.data.userinput}
    this.data.store_data.push(noteIns);
    this.setData({
      notes : this.data.store_data,
      input_value: "",
      userinput: "",
      save_disable: true,
    })
    if (!this.data.hasUserInfo) {
      wx.showModal({
        title: '警告',
        content: '请获取用户名字'
      })
      return
    }
    wx.request({
      url: 'https://m.dannyhkk.cn:8088/helloservice/savenotes', //仅为示例，并非真实的接口地址
      data: {
        "head": {
          "id": this.data.userInfo.nickName,
        },
        "notes":JSON.stringify(this.data.notes),
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success (res) {
        console.log(res.data)
      }
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onAllNotes() {
    wx.navigateTo({
      url: '../notes/notes?nickName=' + this.data.userInfo.nickName
    })
  },
  onAllDelete() {
    wx.navigateTo({
      url: '../notes/notes',
    })
  },
  onLoad() {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let that = this
    wx.getUserProfile({
      desc: '用于拉取用户日志', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        wx.request({
          url: 'https://m.dannyhkk.cn:8088/helloservice/getnotes', //仅为示例，并非真实的接口地址
          data: {
            "head": {
              "id": res.userInfo.nickName,
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
              that.data.store_data = that.data.notes
            }
          }
        })
      }
    })
  },
  onInputFocus() {
    this.setData({
      edit_class: "note1",
    })
  },
  onInputLoseFocus(){
    this.setData({
      edit_class: "note",
    })
  },
  getUserInfo(e: any) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getUserInput(e: any) {
    if (e.detail.cursor === 0) {
      this.setData({
        save_disable: true
      })
    return
    }
    this.setData({
        userinput: e.detail.value,
        save_disable: false
    })
  },
    /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },
})
