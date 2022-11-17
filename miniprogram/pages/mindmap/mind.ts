// pages/mindmap/mind.ts

const F6 = require('@antv/f6-wx')
const TreeGraph = require('@antv/f6-wx/extends/graph/treeGraph')

Page({
  canvas: null,
  ctx: null,
  renderer: '', // mini、mini-native等，F6需要，标记环境
  graph: null,
  itemSelected: null,
  i: 0,
  userinput: "",
  /**
   * Page initial data
   */
  data: {
    canvasWidth: 300,
    canvasHeight: 500,
    pixelRatio: 1,
    forceMini: false,
    inputData: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    F6.registerGraph('TreeGraph', TreeGraph)
    F6.registerBehavior('tree-select-expand', {
      getEvents() {
        return {
          //'node:tap': 'onNodeTap',
          "node:dbltap": 'onNodeDblTap',
        };
      },
      onNodeTap(evt:any) {
        console.log("node tab: " + evt.item.getModel().id)
        
      },
      onNodeDblTap(evt:any) {
        console.log("node db tab: " + evt.item.getModel().id)
      },
    });
    // 同步获取window的宽高
    let that = this
    const query = wx.createSelectorQuery()
    query.select('#mindId').boundingClientRect()
    query.exec(function(res){
      that.setData({
        canvasWidth: res[0].width,
        canvasHeight: res[0].height,
        pixrelRatio: 1,
      })
    })
  },
  handleCanvasInit(e:any) {
    const { ctx, canvas, renderer } = e.detail;
    this.ctx = ctx;
    this.renderer = renderer;
    this.canvas = canvas;
    this.updateChart();
  },
  handleTouch(e:any) {
    this.graph && this.graph.emitEvent(e.detail);
  },
  updateChart() {
    this.graph = new F6.TreeGraph({
      container: this.canvas,
      context: this.ctx,
      renderer: this.renderer,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      pixelRation: this.data.pixelRatio,
      modes: {
        edit: [
          'tree-select-expand',
          'drag-canvas',
          'zoom-canvas'
        ],
      },
      layout: {
        type: 'mindmap',
        direction: 'LR',
        nodeSep: 100,
        rankSep: 200,
        workerEnabled: true,
        preventOverlap: true,
        getHGap: ()=>30,
      },
      defaultNode: {
        type: 'rect',
        size: [25, 10],
        style: {
          'radius': 1
        },
        labelCfg: {
          style: {
            fontSize: 10,
          }
        }
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        size: 1,
      },
    });
    // 注册数据
    this.graph.data({
      id: "root",
      label: "MindMap",
      size: [25, 10],
      labelCfg: {
        style: {
          fontSize: 10,
        }
      }
    });
    this.graph.setMode("edit");
    this.graph.render();
    this.graph.fitView();
    let that = this
    this.graph.on('dbltap', (evt:any) => {
      that.itemSelected = evt.item
      console.log("evt.detail: " + evt.type)
    });
  },
  TestCanvasTap() {
    console.log("test canvas tap")
  },
  AddNode() {
    const node = this.graph.findById("root")
    this.graph.emit('node:dbltap', {
      item: node,
      target: node.getKeyShape(),
      x: 10,
      y: 10
    })
    return
    console.log("item: " + this.itemSelected)
    console.log("input: " + this.userinput)
    if (this.itemSelected === null) {
      return
    }
    if (this.userinput === "") {
      return
    }
    const model = this.itemSelected.getModel()
    console.log(model.id)
    this.graph.addChild({
      id: this.userinput,
      label: this.userinput
    }, model.id)
    this.itemSelected.clearStates("selected")
    this.itemSelected = null
    this.userinput = ""
    this.setData({
      inputData: "",
    })
    //item.refresh()
    //item.enableCapture(true)
  },
  getUserInput(e: any) {
    this.userinput = e.detail.value
  },
  onUnload() {
    this.graph && this.graph.destroy();
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

  },

  onResize(e) {
    console.log("rotate: " + e)
  },
})