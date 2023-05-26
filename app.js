const express=require("express");
const https = require("https");
const bodyParser=require("body-parser");
var validUrl = require('valid-url');
const urlExists = require("url-exists");
const app=express();




app.use(bodyParser.urlencoded({extended:true}));



// app.use((req, res, next) => {
//     res.status(404).send(
//         "<h1>Page not found on the server</h1>")
// })





app.get("/",function(req,res){

  res.sendFile(__dirname + "/index.html");

});





//
// app.all('*', (req, res) => {
//   res.status(404).send('<h1>404! Page not found</h1>');
// });


app.post("/",function(req,res){

  const query =req.body.cityName;
  const apiKey="77d0ed93c38c7499e88b40d87f823f9d";
  const unit="metric";
  const url ="https://api.openweathermap.org/data/2.5/weather?q="+ query +"&units="+ unit+"&appid="+ apiKey;


  urlExists(url, function(err, exists) {
    if (exists) {
      https.get(url,function(response){


        console.log(response.statusCode);


        response.on("data",function(data){

          const weatherData=JSON.parse(data)
          const feels_like=weatherData.main.feels_like;
          const minTemp=weatherData.main.temp_min;
          const maxTemp=weatherData.main.temp_max;

          const pressure=weatherData.main.pressure;
          const temp=weatherData.main.temp
          const weatherDescription=weatherData.weather[0].description
          const icon = weatherData.weather[0].icon
          const imageURL="https://openweathermap.org/img/wn/"+ icon + "@2x.png"




          res.write( "<h1>The temperature in "+ query + " is " + temp + " degrees Celcius .</h1>");
          res.write(" <h1>The weather is currently "+weatherDescription + "<h1/>");

          res.write(" <h1>The Pressure is currently "+ pressure + " pascal <h1/>");
          res.write(" <h1>The temprature feels like "+ feels_like + " degree Celcius <h1/>");
          res.write(" <h1>The minimum temperature of the day is  "+ minTemp + " degree Celcius <h1/>");
          res.write(" <h1>The maximum temperature of the day is  "+ maxTemp + " degree Celcius <h1/>");
          res.write("<img src=" + imageURL +">");
          res.send()
        })
      })
    } else {
      res.send('Please enter valid city name !');
    }
  });
})






app.listen(3000,function(){
  console.log("Server is running on port 3000. ");
})
