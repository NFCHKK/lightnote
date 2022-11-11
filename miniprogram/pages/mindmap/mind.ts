// pages/mindmap/mind.ts

const F6 = require('@antv/f6-wx')
const TreeGraph = require('@antv/f6-wx/extends/graph/treeGraph')
import treeData from './data'

Page({
  canvas: null,
  ctx: null,
  renderer: '', // mini、mini-native等，F6需要，标记环境
  graph: null,
  /**
   * Page initial data
   */
  data: {
    canvasWidth: 300,
    canvasHeight: 500,
    pixelRatio: 1,
    forceMini: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    F6.registerGraph('TreeGraph', TreeGraph)
    // 同步获取window的宽高
    let that = this
    const query = wx.createSelectorQuery()
    query.select('#mindId').boundingClientRect()
    query.exec(function(res){
      console.log(res[0].top);
      that.setData({
        canvasWidth: res[0].width,
        canvasHeight: res[0].height,
        pixrelRatio: 1,
      })
    })
    /*const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();
    console.log(windowWidth, windowHeight)
    this.setData({
      canvasWidth: windowWidth,
      canvasHeight: windowHeight,
      pixelRatio,
    });*/
  },
  handleCanvasInit(e:any) {
    console.log("init: " + e)
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
        default: [
          {
            type: "collapse-expand",
          },
          'drag-nodes',
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
        size: [50, 20],
        style: {
          'radius': 5
        }
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        size: 1,
      },
    });

    // 注册数据
    this.graph.data(treeData);
    this.graph.render();
    this.graph.fitView();
  },
  drawMind() {
    this.updateChart()
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

  }
})