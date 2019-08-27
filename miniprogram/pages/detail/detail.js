var $ = require('../../libs/conf.js')
var city = require('../../libs/city.js')
var amapFile = require('../../libs/amap-wx.js')
var userKey = 'dc5ab0f307ccb8b5ad4fbb4733986a94'
Page({
  onLoad(opt) {
    let poilocation = JSON.parse(opt.query).poilocation
    var that = this
    //获取当前位置
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          orig: {
            longitude: res.longitude,
            latitude: res.latitude,
            iconPath: "../../images/mapicon_navi_s.png"
          },
          dest: {
            longitude: poilocation.split(",")[0],
            latitude: poilocation.split(",")[1],
            iconPath: "../../images/mapicon_navi_e.png"
          }
        }, function() {
          that.getRoute(poilocation)
          that.setData({
            markers: [that.data.orig, that.data.dest]
          })
        })
      },
      fail(err) {
        wx.showToast({
          title: '搜索失败，你联网的样子像极了cxk',
          icon: 'none',
          duration: 5000
        })
      }
    })
  },

  getRoute(destination) {
    var that = this
    var myAmapFun = new amapFile.AMapWX({
      key: userKey
    })
    myAmapFun.getDrivingRoute({
      origin: that.data.orig.longitude + ',' + that.data.orig.latitude,
      destination: destination,
      success: function(data) {
        var steps = []
        for (var i in data.paths[0].steps) {
          steps.push(data.paths[0].steps[i].instruction)
        }
        that.setData({
          steps: steps
        })
        var points = []
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';')
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        })
      }
    })
  }
})