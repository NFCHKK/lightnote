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
    pageName: "笔记",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  treeData: {
    id: '1',
    label: 'label',
    children: [
      {
        id: '1-1',
        label: 'label1-1',
        children: [
          {
            id: '1-1-1',
            label: 'label1-1-1',
            value: 50,
          },
          {
            id: '1-1-2',
            label: 'label1-1-2',
            value:30,
          }
        ]
      },
      {
        id: '1-2',
        label: 'label1-2',
        children: [
          {
            id: '1-2-1',
            label: 'label1-2-1',
            value: 40
          },
          {
            id: '1-2-2',
            label: "label1-2-2",
            value: 10,
          }
        ]
      }
    ]
  },
 

  switchMode() {
    if (this.data.pageName === "笔记") {
      this.setData({
        pageName: "导图",
      })
      return
    }
    if (this.data.pageName === "导图") {
      this.setData({
        pageName: "笔记",
      })
    }
  },
  drawMind() {

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
    //  send note json
    /*wx.request({
      url: 'http://127.0.0.1:8081/helloservice/savenotes',
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
    })*/
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
      url: '../notes/notes',
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
  }
})
