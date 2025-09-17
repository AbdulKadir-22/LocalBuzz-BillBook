const dotenv = require('dotenv')
dotenv.config();
const connectDB = require('./config/db');
connectDB();


// const connectDB = require('./config/db');
const app = require('./index'); 

app.get("/", (req, res) => {
  res.send(`This is me from backend`);
});

const PORT = process.env.PORT || 3000;
const appName = process.env.APP_NAME;

app.listen(PORT, () => {
  console.log(`${appName} running on http://localhost:${PORT}`);
});