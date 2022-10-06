import fs from "fs";
let timestamp = new Date();
function errorHandler(error) {
	try {
		console.log(error)
		let data = `${timestamp}: Error - ${error} \n`;
		fs.appendFileSync("./logs/error.log", data);
	} catch (e) {
		console.log("ERROR: ", e);
	}
}

function messageLogger(type,user, content) {
	try {
		let data;
		if(content.length > 0){
			data = `${timestamp}: ${user} - Type: ${type} Content: ${content}\n`;
		}else{
			data = `${timestamp}: ${user} - Type: ${type} \n`;
		}
		
		fs.appendFileSync("./logs/messageType.log", data);
	} catch (e) {
		console.log("ERROR: ", e);
	}
}


export { errorHandler, messageLogger };
