const dotenv = require('dotenv');
dotenv.config();
const fetch = require("node-fetch");

const projectData = [];
const baseURL = 'http://api.geonames.org/searchJSON?q=';
const apiKEY = process.env.apiKEY;


const weatherbitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbitURLhist = 'http://api.weatherbit.io/v2.0/history/daily?'
const weatherbitKey = process.env.WEATHERBIT_API_KEY;

const pixabayURL = 'https://pixabay.com/api/?'
const pixabay_API_KEY = process.env.pixabay_API_KEY;

const clientD = [];

const path = require('path')


const express = require('express');

const app = express();


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(express.static('dist'));

console.log(__dirname);

app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
});


const port = 5000;
const server = app.listen(port, listening);
function listening() {
  console.log('server running');
  console.log(`running on localhost: ${port}`);
};

app.get('/client', getClientData);

function getClientData(req, res) {
  res.send(clientD);
};




const getCoordinates = async () => {
  let city = clientD[clientD.length - 1].city;
  const response = await fetch(baseURL + city + "&username=" + apiKEY);
  try {
    const geonamesAr = await response.json();
    const geonamesData = geonamesAr.geonames[0];
    clientD[clientD.length - 1].latitude = geonamesData.lat;
    clientD[clientD.length - 1].longitude = geonamesData.lng;
    clientD[clientD.length - 1].country = geonamesData.countryName;
    console.log('coordinates');
  } catch (error) {
    console.log('error', error);
  }
};

const weatherbit = async () => {
  let weatherReq;
  if (clientD[clientD.length - 1].daysLeft < 17) {
    weatherReq = `${weatherbitURL}lat=${clientD[clientD.length - 1].latitude}&lon=${clientD[clientD.length - 1].longitude}&key=${weatherbitKey}`;
  } else {

    const arrivalInputDate = clientD[clientD.length - 1].arrival;
    const arrivalDay = new Date(arrivalInputDate);
    let arrivalPast = arrivalDay.getFullYear() - 1;
    arrivalDay.setFullYear(arrivalPast);
    console.log(arrivalDay);

    let arrivalM = arrivalDay.getMonth();
    let arrivalMonth = arrivalM + 1;
    let startDay = arrivalDay.getFullYear() + '-0' + arrivalMonth + '-' + arrivalDay.getDate();
    console.log(startDay);

    Date.prototype.addDays = function (d) {
      var time = (d * 24 * 60 * 60 * 1000)
      this.setTime(this.getTime() + time);
      return this;
    };

    const endDate = function run() {
      var a = arrivalDay;
      arrivalDay.addDays(1);
      return a;
    };

    const final = new Date(endDate());
    let m = final.getMonth();
    let month = m + 1;
    let nextDate = final.getFullYear() + '-0' + month + '-' + final.getDate();
    console.log(nextDate);


    weatherReq = `${weatherbitURLhist}lat=${clientD[clientD.length - 1].latitude}&lon=${clientD[clientD.length - 1].longitude}&days=1&key=${weatherbitKey}`;
    console.log(weatherReq);
  };

  const response = await fetch(weatherReq);
  try {
    const weatherObj = await response.json();
    console.log(JSON.stringify(weatherObj));
    clientD[clientD.length - 1].temp = weatherObj.data[0].temp;
    console.log(`Weatherbit data`);
    return weatherObj
  } catch (error) {
    console.log('error', error);
  }
};



const getPixabay = async () => {
  let city = clientD[clientD.length - 1].city;
  let country = clientD[clientD.length - 1].country;
  pixabayReq = `${pixabayURL}key=${pixabay_API_KEY}&q=${city}+${country}&image_type=photo&pretty=true`;
  const response = await fetch(pixabayReq);
  try {
    const pixabayArr = await response.json();
    console.log(pixabayArr);
    clientD[clientD.length - 1].image = pixabayArr.hits[0].webformatURL;

  } catch (error) {
    console.log('error', error);
  }
};


const getCountry = async () => {
  let country = clientD[clientD.length - 1].country;
  pixabayReq = `${pixabayURL}key=${pixabay_API_KEY}&q=${country}&image_type=photo`;
  const response = await fetch(pixabayReq);
  try {
    const pixabayArr = await response.json();
    console.log(pixabayArr);
    clientD[clientD.length - 1].countryImage = pixabayArr.hits[0].webformatURL;
    console.log('image');
  } catch (error) {
    console.log('error', error);
  }
};



app.post('/add', addData);

async function addData(req, res) {

  const newData = {};
  newData.date = req.body.date;
  newData.city = req.body.city;
  newData.daysLeft = req.body.daysLeft;
  newData.arrival = req.body.arrival;

  clientD.push(newData);

  await getCoordinates();
  await weatherbit();
  await getPixabay();
  await getCountry();

  const date = {};
  date.arrival = req.body.arrival;
  date.daysLeft = req.body.daysLeft;
  date.country = clientD[clientD.length - 1].country;
  date.temp = clientD[clientD.length - 1].temp;
  date.image = clientD[clientD.length - 1].image;
  date.countryImage = clientD[clientD.length - 1].countryImage;

  projectData.push(date);


  res.send(projectData);
  console.log(projectData);
};


app.get('/all', getProjectData);

function getProjectData(req, res) {
  res.send(projectData);
};

module.exports = server;

