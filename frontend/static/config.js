const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	master_key: process.env.API_KEY,
};
