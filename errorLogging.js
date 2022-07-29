import fs from "fs";
function errorHandler(error) {
	try {
		let timestamp = new Date();
		let data = `${timestamp}: Error - ${error} \n`;
		fs.appendFileSync("./logs/error.log", data);
	} catch (e) {
		console.log("ERROR: ", e);
	}
}

export { errorHandler };
