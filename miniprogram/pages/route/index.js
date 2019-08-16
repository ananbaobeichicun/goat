Page({
    call(e) {
        console.log(e)
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.telnum
        })
    },
	onLoad(opt){
		this.setData({
			res: JSON.parse(opt.res).data
		})
		console.log(this.data.res)
	}
})