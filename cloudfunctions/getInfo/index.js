const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
	return cloud.getWXContext().OPENID;
}