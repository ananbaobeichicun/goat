const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
	try {
		return await db.collection("group").where(event.s).update({
			data: event.v
		});
	} catch (e) {
		console.log(e);
	}
}