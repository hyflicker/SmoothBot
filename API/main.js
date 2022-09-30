import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
const app = express();
const router = express.Router();

const port = 3009;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use((req, res, next) => {
// 	res.status(404);

// 	// respond with json
// 	if (req.accepts("json")) {
// 		res.status(404);
// 		res.send({ error: 404 });
// 		return;
// 	}

// 	// default to plain-text. send()
// 	res.type("txt").send("Not found");
// });
app.use(router);

router
	.route("/socials/tiktok")
	.get((req, res, next) => {
		res.send("Hello World");
	})
	.post((req, res, next) => {
		console.log(req.body);
	});

router
	.route("/socials/discord/bot")
	.post((req,res,next) => {
		decrypt(req.body.data)

		res.sendStatus(200)
	})


// function decrypt (data){
// 	console.log(data)
// 	const algorithm = "aes-192-cbc";
//     const initVector = crypto.randomBytes(16);
// 	const Securitykey = crypto.randomBytes(32);
// 	const decipher = crypto.createDecipheriv(algorithm,Securitykey,initVector);
// 	const decryptedData = decipher.update(data,"hex","utf-8");
// 	return decryptedData += decipher.final("utf8");
// }	
app.listen(port, () => {
	console.log(`Smooth API is now live on Port:${port}!`);
});


function decrypt(data){
	return crypto.createCipheriv()
}