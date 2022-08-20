import * as mysql from "mysql2";
import "dotenv/config";

export const db = mysql.createPool({
	host: "localhost",
	user: process.env.dbUser,
	password: process.env.dbPass,
	database: process.env.db,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});
