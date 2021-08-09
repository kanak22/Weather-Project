require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req,res){
  res.render("index");
});

app.post("/", function(req,res){

  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";

  const url="https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units="+unit;
  https.get(url, function(response){
    console.log(response.statusCode);

  response.on("data", function(data){
    var constData = JSON.parse(data);
    var temp = constData.main.temp;
    var feel = constData.main.feels_like;
    var desc = constData.weather[0].description;
    var icon = constData.weather[0].icon;
    var imageUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

    res.render("output", {description: desc, City: query, Temp: temp, url: imageUrl })
  });

  });
});

app.listen(process.env.PORT || 3000,function(){
  console.log("server is up at port 3000");
});
