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
    this.data.x.map((value, index) =>{
      if (value < 0) {
        this.data.x[index] = 0
      }
    })
    this.data.x[list_index] = e.detail.x
    this.setData({
      x: this.data.x
    })
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

  deleteNote(e: any) {
    console.log(e.target.id)
    let new_notes = new Array()
    let new_x = new Array()
    for (let i = 0; i < this.data.notes.length; i ++) {
      if (this.data.notes[i].id != e.target.id) {
        new_notes.push(this.data.notes[i])
        new_x.push(this.data.x[i])
      }
    }
  
    this.setData({
      notes: new_notes,
      x: new_x
    })
    this.saveNotes()
  },

  getlocalDate() {
    let timeNow = new Date()
    return timeNow.getFullYear() + "/" + timeNow.getMonth() + "/" +
      timeNow.getDay() + " " + timeNow.getHours() + ":" + timeNow.getMinutes() + ":"
      + timeNow.getSeconds()
  },

  getNoteId: function() {
   // tmp
   return Date.now().toString(6)
  },

  onAddData: function() {
    if(this.data.userinput === ""){
      return
    }
    let noteIns = {
      time: this.getlocalDate(),
      note: this.data.userinput,
      id: this.getNoteId()
    }
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
    this.saveNotes()
  },
  saveNotes() {
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
    if (this.options.avatarUrl != undefined) {
      this.setData({
        userInfo: {
          avatarUrl: this.options.avatarUrl,
          nickName: this.options.nickName
        },
        hasUserInfo: true
      })
    }
    wx.getStorage({
      key: "open_id",
      success: (res)=>{
        console.log("get store open_id success: " + res.data)
        this.setData({
          openId: res.data
        })
        this.getUserNotes()
      },
      fail: (res)=>{
        this.getUserOpenIdAndNotes()
      }
    })
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserOpenIdAndNotes() {
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
 compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
  
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
  
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
  
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },

  getUserProfile() {
    const version = wx.getSystemInfoSync().SDKVersion
    if (this.compareVersion(version, '2.21.2') >= 0) {
      wx.navigateTo({
        url: "../userprofile/userprofile"
      })
      return
    }
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
