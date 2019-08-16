var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
    data: {
        height: "400",
        perimeter: []
    },

    onLoad: function(e) {
        qqmapsdk = new QQMapWX({
            key: 'WIHBZ-4CSKF-FF2JN-NHEA5-NBCDF-M3BK5'
        });
    },

    search: function(e) {
		this.nearby_search(e.target.dataset.type);
    },

    nearby_search: function(keyword) {
        var that = this;
        qqmapsdk.search({
            keyword: keyword,
            location: that.data.poi,
            success(res) {
            	var obj = JSON.stringify(res)
                console.log("obj=", res)
                wx.navigateTo({
					url: '../route/index?res=' + JSON.stringify(res)
				})
            },
            fail(res) {
                console.log("fail=", res);
            }
        });
    }
})