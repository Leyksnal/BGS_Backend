require("./utils/db");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: `This is a dedicated server for BGS Projects running on port ${port} with a status code of 101EW1`});
});

app.use('/api/admin', require('./route/userRouter'))
app.use('/api/admin/access', require('./route/galleryRouter'))

app.listen(port, () => {
	console.log(`"server is now running...!" ${port}`);
});
