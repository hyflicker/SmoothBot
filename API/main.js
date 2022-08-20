import express from "express";
import bodyParser from "body-parser";
const app = express();
const router = express.Router();

const port = 3000;

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

router
	.route("/socials/tiktok")
	.get((req, res, next) => {
		res.send("Hello World");
	})
	.post((req, res, next) => {
		console.log(req.body);
	});

app.use(router);
app.listen(port, () => {
	console.log(`Smooth API is now live on Port:${port}!`);
});
