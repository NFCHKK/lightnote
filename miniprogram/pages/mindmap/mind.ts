// pages/mindmap/mind.ts

import * as F6 from '@antv/f6-wx';
import force from '@antv/f6-wx/extends/layout/forceLayout';

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
    pixelRatio: 0.2,
    forceMini: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    F6.registerLayout('TreeGraph', force);
    // 同步获取window的宽高
    let that = this
    const query = wx.createSelectorQuery()
    query.select('#mindId').boundingClientRect()
    query.exec(function(res){
      console.log(res[0].top);
      that.setData({
        canvasWidth: res[0].width,
        canvasHeight: res[0].height,
        pixrelRatio: 0.2,
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
    const data = {
      nodes: [
        { id: 'node0', size: 50 },
        { id: 'node1', size: 30},
        { id: 'node2', size: 30},

        { id: 'node3', size: 20},
        { id: 'node4', size: 20},

        { id: 'node5', size: 10},
        { id: 'node6', size: 10},
      ],
      edges: [
        { source: 'node0', target: 'node1', id: 'edge1' },
        { source: 'node0', target: 'node2', id: 'edge2' },

        { source: 'node1', target: 'node3', id: 'edge3' },
        { source: 'node1', target: 'node4', id: 'edge4' },

        { source: 'node3', target: 'node5', id: 'edge5' },
        { source: 'node3', target: 'node6', id: 'edge6' },
      ],
    };
    this.graph = new F6.Graph({
      container: this.canvas,
      context: this.ctx,
      renderer: this.renderer,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      pixelRation: this.data.pixelRatio,
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      layout: {
        type: 'TreeGraph',
      },
      defaultNode: {
        size: 15,
      },
    });

    // 注册数据
    this.graph.data(data);
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