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
    canIUseOpenData: false, // 如需尝试获取用户信息可改为false
    openId: "",
    x: new Array(),
  },
  switchMode() {
    wx.navigateTo({
      url: '../mindmap/mind',
    })
  },
  dragMoveNote(e: any) {
    if (e.detail.source === "") {
      return
    }
    let list_index = parseInt(e.target.id)
    if (this.data.x[list_index] === e.detail.x) {
      return
    }
    console.log("touch: " + e.detail.source + " x: " + e.detail.x)
    this.data.x.map((value, index) =>{
      if (value < 0) {
        this.data.x[index] = 0
      }
    })
    this.data.x[list_index] = e.detail.x
    this.setData({
      x: this.data.x
    })
    console.log(this.data.x)
    return
    if (e.detail.source === "touch-out-of-bounds") {
      if (e.detail.x > 0) {
        console.log("touch x: " + e.detail.x)
        let list_index = 0 + e.target.id
        this.data.x[list_index] = 0
        this.setData({
          x: this.data.x
        })
        return
      }
      if (e.detail.x < 0) {
        console.log("touch x: " + e.detail.x)
        this.setData({
         x: this.data.x
        })
      }
    }
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
          "id": this.data.openId,
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
      url: '../notes/notes?openid=' + this.data.openId
    })
  },
  onAllDelete() {
    /*
    wx.navigateTo({
      url: '../notes/notes',
    })*/
  },
  onLoad() {
    wx.getStorage({
      key: "open_id",
      success: (res)=>{
        console.log("get store open_id success: " + res.data)
        this.setData({
          openId: res.data
        })
      },
      fail: (res)=>{
        console.log("get store open_id failed: " + res.errMsg)
      }
    })
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserNotes() {
    let that = this
    wx.request({
      url: 'https://m.dannyhkk.cn:8088/helloservice/getnotes', //仅为示例，并非真实的接口地址
      data: {
        "head": {
          "id": that.data.openId,
        },
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success (res) {
        console.log("get notes result: " + res.data)
        if (res.data.Head.code === 0) {
          let tmp_notes = JSON.parse(res.data.notes)
          that.setData({
            notes: tmp_notes,
            x: new Array(tmp_notes.length).fill(0)
          })
          that.data.store_data = that.data.notes
        }
      }
    })
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
      }
    })
    console.log("user open id: " + this.data.openId)
    if (this.data.openId != "") {
      this.getUserNotes()
      return
    }
    wx.login({
      success:(res) => {
        console.log(res.code)
        wx.request({
          url: 'https://m.dannyhkk.cn:8088/helloservice/miniauth', //仅为示例，并非真实的接口地址
          data: {
            "code": res.code,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success (res) {
            console.log("miniauth result: " + res.data)
            const result = JSON.parse(res.data.loginCode)
            if (res.data.head.code === 0) {
              that.setData({
                openId: result.openid
              })
              wx.setStorage({
                key: "open_id",
                data: that.data.openId,
                success: ()=>{
                  console.log("save openid success")
                }
              })
              console.log("get user open id: " + that.data.openId)
              that.getUserNotes()
            }
          }
        })
      },
      fail: (res) => {
        console.log(res.errMsg)
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
