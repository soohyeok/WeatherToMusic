const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./config/connection');
const baseRouter = require('./routes/base');
const dataRouter = require('./routes/data');
const cors = require('cors');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname,'public')));

app.use(baseRouter);
app.use(dataRouter);

app.use(cors({
	origin: 'http://localhost:5000'
}))

const port =
	process.env.PORT !== undefined ? parseInt(process.env.PORT) : 5000;

app.listen(port, () => {
	console.log(`API runnig on ${port}`);
});

module.exports = app;