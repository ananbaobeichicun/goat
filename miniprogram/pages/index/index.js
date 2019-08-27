var $ = require('../../libs/conf.js');
var city = require('../../libs/city.js');
var amapFile = require('../../libs/amap-wx.js');
var userKey = 'dc5ab0f307ccb8b5ad4fbb4733986a94';
Page({
    data: {
        //城市下拉
        citySelected: '广州市',
        city: '广州市',
        cityData: {},
        hotCityData: [],
        _py: ["hot", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
        //搜索列表
        inputVal: '',
        searchList: [],
        cityListShow: false,
        inputListShow: false,
        hidden: true,
        showPy: '★',
        //搜索历史记录
        historyListShow: true,
        historyList: []
    },
    onLoad: function() {
        var that = this;
        var myCity = wx.getStorageSync("myCity");
        console.log(myCity);
        this.setData({
            historyList: wx.getStorageSync("historyList").length > 0 ? wx.getStorageSync("historyList") : []
        });

        this.setData({
            //citySelected: myCity,
            city: myCity,
            latitude: wx.getStorageSync("latitude"),
            longitude: wx.getStorageSync("longitude"),
            sname: "我的位置",
            saddress: ''
        });

        this.setData({
            cityData: city.all,
            hotCityData: city.hot
        });
    },

	colorfulEgg() {
		wx.showModal({
			title: "彩蛋",
			content: "ya被发现了，偷偷卖个广告",
			showCancel: false
		})
	},

    select(event) {
        var query = event.currentTarget.dataset;
        wx.navigateTo({
            url: '../detail/detail?query=' + JSON.stringify(query)
        });
        //历史记录
        var history = $.saveHistory(wx.getStorageSync("historyList"), query);
        this.setData({
            historyList: history
        });
        wx.setStorageSync("historyList", history);
    },

    //打开城市列表
    openCityList: function() {
        this.setData({
            cityListShow: true,
            inputListShow: false,
            historyListShow: false
        });
    },

    //选择城市
    selectCity: function(e) {
        var dataset = e.currentTarget.dataset;
        this.setData({
            citySelected: dataset.fullname,
            cityListShow: false,
            inputListShow: false,
            historyListShow: true,
            location: {
                latitude: dataset.lat,
                longitude: dataset.lng
            }
        });
    },
    touchstart: function(e) {
        this.setData({
            index: e.currentTarget.dataset.index,
            Mstart: e.changedTouches[0].pageX
        });
    },
    touchmove: function(e) {
        var history = this.data.historyList;
        var move = this.data.Mstart - e.changedTouches[0].pageX;
        history[this.data.index].x = move > 0 ? -move : 0;
        this.setData({
            historyList: history
        });
    },
    touchend: function(e) {
        var history = this.data.historyList;
        var move = this.data.Mstart - e.changedTouches[0].pageX;
        history[this.data.index].x = move > 100 ? -180 : 0;
        this.setData({
            historyList: history
        });
    },
    //获取文字信息
    getPy: function(e) {
        this.setData({
            hidden: false,
            showPy: e.target.id,
        })
    },

    setPy: function(e) {
        this.setData({
            hidden: true,
            scrollTopId: this.data.showPy
        })
    },

    //滑动选择城市
    tMove: function(e) {
        var y = e.touches[0].clientY,
            offsettop = e.currentTarget.offsetTop;

        //判断选择区域,只有在选择区才会生效
        if (y > offsettop) {
            var num = parseInt((y - offsettop) / 12);
            this.setData({
                showPy: this.data._py[num]
            })
        };
    },

    //触发全部开始选择
    tStart: function() {
        this.setData({
            hidden: false
        })
    },

    //触发结束选择
    tEnd: function() {
        this.setData({
            hidden: true,
            scrollTopId: this.data.showPy
        })
    },
    //清空历史记录
    clearHistory: function() {
        var that = this;
        wx.showActionSheet({
            itemList: ['清空'],
            itemColor: '#DD4F43',
            success: function(res) {
                if (res.tapIndex == 0) {
                    that.setData({
                        historyList: []
                    });
                    wx.setStorageSync("historyList", []);
                }
            }
        })
    },
    //删除某一条
    del: function(e) {
        var that = this;
        wx.showActionSheet({
            itemList: ['删除'],
            itemColor: '#DD4F43',
            success: function(res) {
                if (res.tapIndex == 0) {
                    var index = e.currentTarget.dataset.index,
                        history = that.data.historyList;
                    history.splice(index, 1);
                    that.setData({
                        historyList: history
                    });
                    wx.setStorageSync("historyList", history);
                }
            }
        });
    },

    //搜索关键字
    keyword(e) {
        var that = this;
        var keywords = e.detail.value;
        var myAmapFun = new amapFile.AMapWX({
            key: 'dc5ab0f307ccb8b5ad4fbb4733986a94'
        });
        myAmapFun.getInputtips({
            keywords: keywords,
            location: '',
            success: function(data) {
                if (data && data.tips) {
                    that.setData({
                        searchList: data.tips
                    });

                    //炒鸡无敌硬核的强行判断打表卖广告
                    if (e.detail.value == '广附' || e.detail.value == '广大附中') {
                        console.log(e.detail.value)
                        //在控制台还copy不了，手敲的
                        that.data.searchList.push({
                            id: "B0FFH9I9OJ",
                            name: "广州大学附属中学广德实验学校",
                            district: "广东省江门市蓬江区",
                            location: "113.011646,22.605701",
                            address: "杜阮镇",
                        })
                        that.data.searchList.push({
                            id: "B0FFF0FPLK",
                            name: "广州大学附属中学(大学城校区)",
                            district: "广东省广州市番禺区",
                            location: "113.387292, 23.045656",
                            address: "大学城南三路31号"
                        })
                        that.setData({
                            searchList: that.data.searchList
                        })
                        console.log(that.data.searchList)
                    }
                }
            }
        })
    },

    //输入
    input(e) {
        if (e.detail.value == '') {
            this.setData({
                inputVal: e.detail.value,
                inputListShow: false,
                cityListShow: true,
                historyListShow: true
            });
        } else {
            this.setData({
                inputVal: e.detail.value,
                inputListShow: true,
                cityListShow: true,
                historyListShow: false
            });
            this.keyword(e);
        }
    },

    f() {
        this.setData({
            inputVal: '广附'
        });
        this.input({
            detail: {
                value: '广附'
            }
        })
    },

    //清除输入框
    clear: function() {
        this.setData({
            inputVal: '',
            inputListShow: false,
            historyListShow: true
        })
    }
})