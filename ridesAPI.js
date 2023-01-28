//URL for accessing the themeparks api for live data
const liveDataURL =
  "https://api.themeparks.wiki/v1/entity/waltdisneyworldresort/live";

//gets current date and time
let currentDate = new Date();
let cDay = currentDate.getDate();
let cMonth = currentDate.getMonth() + 1;
let cYear = currentDate.getFullYear();

//initializing empty array for the rides to be added to
let ridesArray = [];
let ridesForecast = [];
let ridesArrayClone = [];
let MKResult = 0;
let epcotResult = 0;
let AKResult = 0;
let HSResult = 0;

//declaring function to fetch api for live data
async function getApi(url) {
  const response = await fetch(url);
  let data = await response.json();

  //accesses the rides and attractions and accesses the live data
  //portion of Walt Disney World Resort
  let attractions = data.liveData;

  //iterates through list of attractions and filters out any
  //shows, restaurants, and anything without a normal
  //standby queue
  Object.keys(attractions).forEach((key) => {
    if (attractions[key].queue === undefined) {
      return;
    } else if (
      attractions[key].entityType == "RESTAURANT" ||
      attractions[key].entityType == "SHOW"
    ) {
      return;
    } else if (attractions[key].queue["STANDBY"] === undefined) {
      return;
    } else if (attractions[key].queue["STANDBY"].waitTime === null) {
      return;
    } else {
      //adds attraction to array
      ridesArray.push(attractions[key]);

      if (attractions[key].forecast) {
        ridesArrayClone.push(attractions[key]);
      }

      //sorts array in reverse so attractions with the longest
      //standby wait time are at the top
      ridesArray.sort((a, b) => {
        return b.queue["STANDBY"].waitTime - a.queue["STANDBY"].waitTime;
      });
      ridesArrayClone.sort((a, b) => {
        return b.queue["STANDBY"].waitTime - a.queue["STANDBY"].waitTime;
      });
    }
  });

  //iterates through list of attractions and displays each to
  //the DOM while being sorted to their correct theme park
  ridesArray.forEach((key) => {
    //initializes dom element
    let child;

    //creates the p tag for the data to enter into
    const para = document.createElement("p");

    //generates the name of the attraction along with the
    //current wait time for it
    const node = document.createTextNode(
      `${key.name} : ${key.queue["STANDBY"].waitTime} minutes`
    );

    //checks if attraction is in magic kingdom
    if (key.parkId == "75ea578a-adc8-4116-a54d-dccb60765ef9") {
      child = document.getElementById("Magic-Kingdom");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para, child);
    }

    //checks if attraction is in epcot
    if (key.parkId == "47f90d2c-e191-4239-a466-5892ef59a88b") {
      child = document.getElementById("Epcot");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para, child);
    }

    //checks if attraction is in animal kingdom
    if (key.parkId == "1c84a229-8862-4648-9c71-378ddd2c7693") {
      child = document.getElementById("Animal-Kingdom");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para, child);
    }

    //checks if attraction is in hollywood studios
    if (key.parkId == "288747d1-8b4f-4a64-867e-ea7c9b27bad8") {
      child = document.getElementById("Hollywood-Studios");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para, child);
    }
  });
  Object.keys(ridesArray).forEach((key) => {
    if (ridesArray[key].forecast === undefined) {
      return;
    }
    ridesArray[key]["forecast"].forEach((time) => {
      let hour = new Date(time.time);
      hour = hour.getHours();

      if (hour === currentDate.getHours()) {
        ridesForecast.push({ name: ridesArray[key].name, FWT: time.waitTime });
      }
      //console.log(hour)
    });
  });

  //Finds the % difference between the current wait time and the forecast
  //If it returns a positive number, then the current is higher than the forecast
  //If it returns a negative number, then the current is lower than the forecast
  function waitPercentDifference(waitTime, forecastedWaitTime) {
    let difference = waitTime / forecastedWaitTime - 1;
    return difference;
  }

  for (let i = 0; i < ridesForecast.length; i++) {
    if (ridesArray[i].parkId === "75ea578a-adc8-4116-a54d-dccb60765ef9") {
      MKResult =
        MKResult +
        waitPercentDifference(
          ridesArrayClone[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
    if (ridesArray[i].parkId === "47f90d2c-e191-4239-a466-5892ef59a88b") {
      epcotResult =
        epcotResult +
        waitPercentDifference(
          ridesArrayClone[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
    if (ridesArray[i].parkId === "1c84a229-8862-4648-9c71-378ddd2c7693") {
      AKResult =
        AKResult +
        waitPercentDifference(
          ridesArrayClone[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
    if (ridesArray[i].parkId === "288747d1-8b4f-4a64-867e-ea7c9b27bad8") {
      HSResult =
        HSResult +
        waitPercentDifference(
          ridesArrayClone[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
  }

  let parksArray = [MKResult,epcotResult,AKResult,HSResult,]
  parksArray.sort((a,b) => {
    return a-b;
  })

  console.log(parksArray);
  console.log(MKResult);
  console.log(epcotResult);
  console.log(AKResult);
  console.log(HSResult);
  console.log(ridesForecast);
  console.log(ridesArrayClone);
  console.log(ridesArray);

  //calls api function where all the magic happens
  
  //random console log just in case I need to see something
}

getApi(liveDataURL);