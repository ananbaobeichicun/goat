const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
	try {
		return await db.collection(event.c).where(event.s).remove();
	} catch(e) {
		console.log(e);
	}
}