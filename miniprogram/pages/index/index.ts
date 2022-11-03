// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    userinput: "",
    show_data: new Array(),
    store_data: new Array(),
    save_disable: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  onAddData: function() {
    console.log(this.data.userinput)
    if(this.data.userinput === ""){
      return
    }
    this.data.store_data.push(this.data.userinput);
    this.setData({
      show_data: [this.data.userinput],
    })
    let notes = ""
    for ( var i = 0; i < this.data.show_data.length; i ++) {
      notes += this.data.show_data[i]
      notes += ";"
    }
    wx.request({
      url: 'http://localhost:8081/helloservice/savenotes',
      data : {
        "head": {
          "id": "dannyhkk",
        },
        "notes": notes
      },
      method: 'POST',

      header: {
        'content-type': 'application/json'
      },
      success(res) {
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
      url: '../notes/notes?note=notes'
    })
  },
  onAllDelete() {
    wx.navigateTo({
      url: '../trash/trash',
      events: this.data.store_data,
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
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e: any) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getUserInput(e: any) {
    //console.log("text:" + e.detail.text + ";")
    this.setData({
        userinput: e.detail.text,
        save_disable: e.detail.text === "\n" || false
    })
    /*
    const query = wx.createSelectorQuery()
    query.select('#save_id')
    query.exec(function (res) {
      console.log(res)
    })*/
  }

})
