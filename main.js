

   //const apiKey = "d009034b-26cc-4de6-a810-ccc942e86dfd";

   const inputElement = document.querySelector(".location-entry .search");
   
   const locations = document.getElementById('location-list');
   
   const noMatch = document.getElementById('no-match');
   
   const capitalCityIds = [['352409' , '.london'], ['351351', '.edinburgh'], ['350758', '.cardiff'], ['350347', '.belfast']];
   
   const landmarks = [['url("images/landmarks/england/scene1.jpg")',
                       'url("images/landmarks/england/scene2.jpg")',
                       'url("images/landmarks/england/scene3.jpg")',
                       'url("images/landmarks/england/scene4.jpg")',
                       'url("images/landmarks/england/scene5.jpg")'
                      ],
                      ['url("images/landmarks/scotland/scene1.jpg")',
                       'url("images/landmarks/scotland/scene2.png")',
                       'url("images/landmarks/scotland/scene3.jpeg")',
                       'url("images/landmarks/scotland/scene4.jpg")',
                       'url("images/landmarks/scotland/scene5.jpg")'
                      ],
                      ['url("images/landmarks/cardiff/scene1.jpg")',
                       'url("images/landmarks/cardiff/scene2.jpg")',
                       'url("images/landmarks/cardiff/scene3.jpg")',
                       'url("images/landmarks/cardiff/scene4.jpg")',
                       'url("images/landmarks/cardiff/scene5.jpg")'
                      ],
                      ['url("images/landmarks/belfast/scene1.jpg")',
                       'url("images/landmarks/belfast/scene2.jpg")',
                       'url("images/landmarks/belfast/scene3.jpg")',
                       'url("images/landmarks/belfast/scene4.jpg")',
                       'url("images/landmarks/belfast/scene5.jpg")'
                      ]

                     ];
   var allSites;
   
   var className;
   
   //Input Value
   function searchMatchedLocations() {
   
             let inputValue = inputElement.value;
             
             if (inputValue.length > 3) {
   
                     locations.innerHTML = "";
   
                     noMatch.innerText = "";
   
                     for (let i = 0; i < allSites.Locations.Location.length; i++){
                       
                             var filter = inputValue.toUpperCase();
                             
                             var location = allSites.Locations.Location[i].name;
                                                                                 
                             if(location.toUpperCase().indexOf(filter) > -1) {
                                  
                                  locations.insertAdjacentHTML("beforeend",`<li onclick="getLocationSpecificData(${allSites.Locations.Location[i].id})">${location}</li>`)
                                  
                             }
                       
                     } 
                   
                     if(locations.innerHTML == "") {
   
                       noMatch.innerText = "No-match found!!";
   
                     }
               
             } else {
               locations.innerHTML = "";
               noMatch.innerText = "";
             }
   
   }
   
   
   // All Available UK Sites
   async function getAllSiteList() {
   
           const response = await fetch("http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=d009034b-26cc-4de6-a810-ccc942e86dfd");
           
           allSites = await response.json();
   
           console.log(allSites);
   
           for(let i = 0; i < capitalCityIds.length; i++){
   
               className = capitalCityIds[i][1];
               
               await getLocationSpecificData(capitalCityIds[i][0]);
   
         }
        className = ".other";
   
   }
   
   getAllSiteList();
   
   async function getLocationSpecificData(data){
            
            inputElement.value = "";
            locations.innerHTML = "";
   
            noMatch.innerText = "";
            await fetch(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/${data}?res=3hourly&key=d009034b-26cc-4de6-a810-ccc942e86dfd`).
            then(data => data.json())
            .then(data => getRequiredWeatherData(data));
                 
   }
   
   function getRequiredWeatherData(data) {
   
          var d = new Date();
          var totalTime = d.getHours() * 60 + d.getMinutes();
          var date = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) +"-"+("0" + d.getDate()).slice(-2);
          var todayDate = dateBuilder(date);
          var data1 = data.SiteRep.DV.Location;
          var info = data1.Period[0].Rep;
          var city = data1.name;
          var country = data1.country ;
          let tempArray = [];
          info.forEach(element => {
             tempArray.push(element.T);  
          });
          let maxTemp = Math.max(...tempArray);
          let minTemp = Math.min(...tempArray);
          
         for (let i = 0; i < info.length; i++) {
   
             if (totalTime >= info[i].$ && totalTime < info[i].$ + 180){
                 displayWeather(info[i].T,minTemp, maxTemp, info[i].S, info[i].W, info[i].H, info[i].Pp, city, country, todayDate)
             }
         }
       }
   
   function displayWeather(temp, minTemp, maxTemp, speed, weatherCode, humidity, percipitation, city, country, todayDate) {
   
            if (className === '.other') {

               document.querySelector('.searchedCity').style.display = '';
               document.querySelector('.clear').style.display = '';
               imageSelector(country);

            }
            document.querySelector(`${className} .place-date .location`).innerText = city;
            document.querySelector(`${className} .place-date .country`).innerText = country;
            document.querySelector(`${className} .place-date .date-today`).innerText = todayDate;
   
            let weather = weatherCodeConverter(weatherCode);
            document.querySelector(`${className} .weather-info .temp`).innerHTML=`${temp}<span>&#176c</span>`;
            document.querySelector(`${className} .weather-info .min-max`).innerHTML=`Min ${minTemp}<span>&#176c</span> | Max ${maxTemp}<span>&#176c</span>`;
            document.querySelector(`${className} .weather-info .weather`).innerHTML=`${weather[0]}`;
            document.querySelector(`${className} .weather-info .weather-text`).innerHTML=`${weather[1]}`;
            
            document.querySelector(`${className} .other-info .extras .wind .wind-value`).innerText=`${speed} mph`;
            document.querySelector(`${className} .other-info .extras .humidity .humidity-value `).innerText=`${humidity}%`;
            document.querySelector(`${className} .other-info .extras .percipitation .percipitation-value`).innerText=`${percipitation}%`;

      
   }
   
   function clearBox(){
      
      
      document.querySelector(`.other .place-date .location`).innerText = "";
      document.querySelector(`.other .place-date .country`).innerText = "";
      document.querySelector(`.other .place-date .date-today`).innerText = "";

      
      document.querySelector(`.other .weather-info .temp`).innerHTML = "";
      document.querySelector(`${className} .weather-info .min-max`).innerHTML= "";
      document.querySelector(`${className} .weather-info .weather`).innerHTML= "";
      document.querySelector(`${className} .weather-info .weather-text`).innerHTML= "";

      document.querySelector(`${className} .other-info .extras .wind .wind-value`).innerText= "";
      document.querySelector(`${className} .other-info .extras .humidity .humidity-value `).innerText= "";
      document.querySelector(`${className} .other-info .extras .percipitation .percipitation-value`).innerText= "";
      

      document.querySelector('.searchedCity').style.display = 'none';
      document.querySelector('.clear').style.display = 'none';

   }
   
   function dateBuilder(arg) {
      
            let options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
            let date = new Date(arg);
            return date.toLocaleDateString('en-UK', options);
   
   }
   

   function weatherCodeConverter(code) {
      let returnVal;
       switch (code) {
         case 'NA':
           returnVal = 'Not Available';
           break;
         case "0":
           returnVal = ['<img src="./images/weather-icon/icon1.png" class="weather-icon">', 'Clear Night'];
           break;
         case "1":
            returnVal = ['<img src="./images/weather-icon/icon2.png" class="weather-icon">', 'Sunny Day'];
            break;
         case "2":
            returnVal = ['<img src="./images/weather-icon/icon3.png" class="weather-icon">', 'Partly Cloudy'];
            break;
         case "3":
            returnVal = ['<img src="./images/weather-icon/icon4.png" class="weather-icon">', 'Partly Cloudy'];
            break;
         case "4":
            returnVal = 'Not Used';
            break;
         case "5":
            returnVal = ['<img src="./images/weather-icon/mist.png" class="weather-icon">', 'Mist'];
            break;
         case "6":
            returnVal = ['<img src="./images/weather-icon/fog.png" class="weather-icon">', 'Fog'];
            break;
         case "7":
            returnVal = ['<img src="./images/weather-icon/icon5.png" class="weather-icon">', 'Cloudy'];
            break;
         case "8":
            returnVal = ['<img src="./images/weather-icon/icon6.png" class="weather-icon">', 'Overcast'];
            break;
         case "9":
            returnVal = ['<img src="./images/weather-icon/icon7.png" class="weather-icon">', 'Light Rain Shower'];
            break;
         case "10":
            returnVal = ['<img src="./images/weather-icon/icon8.png" class="weather-icon">', 'Light Rain Shower'];
            break;
         case "11":
              returnVal = ['<img src="./images/weather-icon/drizzle.png" class="weather-icon">', 'Drizzle'];
              break;
         case "12":
            returnVal = ['<img src="./images/weather-icon/drizzle.png" class="weather-icon">', 'Light Rain'];
            break;
         case "13":
            returnVal = ['<img src="./images/weather-icon/icon10.png" class="weather-icon">', 'Heavy Rain Shower'];
            break;
         case "14":
            returnVal = ['<img src="./images/weather-icon/icon11.png" class="weather-icon">', 'Heavy Rain Shower'];
            break;
         case "15":
            returnVal = ['<img src="./images/weather-icon/icon12.png" class="weather-icon">', 'Heavy Rain'];
            break;  
         case "16":
            returnVal = ['<img src="./images/weather-icon/sleet.png" class="weather-icon">', 'Sleet Shower'];
            break; 
         case "17":
            returnVal = ['<img src="./images/weather-icon/sleet.png" class="weather-icon">', 'Sleet Shower'];
            break;
         case "18":
            returnVal = ['<img src="./images/weather-icon/sleet.png" class="weather-icon">', 'Sleet'];
            break;
         case "19":
            returnVal = ['<img src="./images/weather-icon/hail2.png" class="weather-icon">', 'Hail Shower'];
            break;
         case "20":
            returnVal = ['<img src="./images/weather-icon/hail1.png" class="weather-icon">', 'Hail Shower'];
            break;
         case "21":
            returnVal = ['<img src="./images/weather-icon/hail.png" class="weather-icon">', 'Hail'];
            break;
         case "22":
            returnVal = ['<img src="./images/weather-icon/snow1.png" class="weather-icon">', 'Light Snow Shower'];
            break;
         case "23":
            returnVal = ['<img src="./images/weather-icon/snow1.png" class="weather-icon">', 'Light Snow Shower'];
            break; 
         case "24":
            returnVal = ['<img src="./images/weather-icon/snow1.png" class="weather-icon">', 'Light Snow'];
            break; 
         case "25":
            returnVal = ['<img src="./images/weather-icon/snow.png" class="weather-icon">', 'Heavy Snow Shower'];
            break;
         case "26":
            returnVal = ['<img src="./images/weather-icon/snow.png" class="weather-icon">', 'Heavy Snow Shower'];
            break;
         case "27":
            returnVal = ['<img src="./images/weather-icon/snow.png" class="weather-icon">', 'Heavy Snow'];
            break;
         case "28":
            returnVal = ['<img src="./images/weather-icon/thunder1.png" class="weather-icon">', 'Thunder Shower'];
            break;
         case "29":
            returnVal = ['<img src="./images/weather-icon/thunder1.png" class="weather-icon">', 'Thunder Shower'];
            break;
         case "30":
            returnVal = ['<img src="./images/weather-icon/thunder.png" class="weather-icon">', 'Thunder'];
            break;
       }
       return returnVal;
    }

function imageSelector(country){
   let randomNum = Math.floor((Math.random() * 5));
   if(country === 'ENGLAND') {
      document.querySelector('.other .main-info').style.backgroundImage = landmarks[0][randomNum];
   }
   else if (country === 'SCOTLAND') {
      document.querySelector('.other .main-info').style.backgroundImage = landmarks[1][randomNum];
   }
   else if (country === 'WALES') {
      document.querySelector('.other .main-info').style.backgroundImage = landmarks[2][randomNum];
   }
   else {
      document.querySelector('.other .main-info').style.backgroundImage = landmarks[3][randomNum];
   }
}