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
    } else if (attractions[key].forecast) {
      ridesArray.push(attractions[key]);

      //sorts array in reverse so attractions with the longest
      //standby wait time are at the top
      ridesArray.sort((a, b) => {
        return b.queue["STANDBY"].waitTime - a.queue["STANDBY"].waitTime;
      });
    }
  });

  //Iterates through ridesArray and compares the current hour to
  //The list of forecasts,finds the correct one, and uses that wait time
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
    });
  });

  //Finds the % difference between the current wait time and the forecast
  //If it returns a positive number, then the current is higher than the forecast
  //If it returns a negative number, then the current is lower than the forecast
  function waitPercentDifference(waitTime, forecastedWaitTime) {
    let difference = waitTime / forecastedWaitTime - 1;
    return difference;
  }

  //Iterates through array, identifies which park the ride goes to,
  //Runs waitPercentDifference function, and updates the result for that park
  for (let i = 0; i < ridesForecast.length; i++) {
    if (ridesArray[i].parkId === "75ea578a-adc8-4116-a54d-dccb60765ef9") {
      MKResult =
        MKResult +
        waitPercentDifference(
          ridesArray[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
    if (ridesArray[i].parkId === "47f90d2c-e191-4239-a466-5892ef59a88b") {
      epcotResult =
        epcotResult +
        waitPercentDifference(
          ridesArray[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
    if (ridesArray[i].parkId === "1c84a229-8862-4648-9c71-378ddd2c7693") {
      AKResult =
        AKResult +
        waitPercentDifference(
          ridesArray[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
    if (ridesArray[i].parkId === "288747d1-8b4f-4a64-867e-ea7c9b27bad8") {
      HSResult =
        HSResult +
        waitPercentDifference(
          ridesArray[i].queue["STANDBY"].waitTime,
          ridesForecast[i].FWT
        );
    }
  }

  //Initializes array with results and sorts them in ascending order
  let parksArray = [
    { name: "Magic-Kingdom", result: MKResult },
    { name: "Epcot", result: epcotResult },
    { name: "Animal-Kingdom", result: AKResult },
    { name: "Hollywood-Studios", result: HSResult },
  ];
  parksArray.sort((a, b) => {
    return a.result - b.result;
  });

  for (let i = 0; i < parksArray.length; i++) {
    let title;
    //If the index is 0
    if (
      parksArray[i].name == "Magic-Kingdom" &&
      parksArray.findIndex((x) => x.name == "Magic-Kingdom") === 0
    ) {
      title = document.getElementById("MK-title");
      title.append("🥇");
      console.log("magic kingdom is 1st");
    }
    if (
      parksArray[i].name == "Epcot" &&
      parksArray.findIndex((x) => x.name == "Epcot") === 0
    ) {
      title = document.getElementById("epcot-title");
      title.append("🥇");
      console.log("epcot is 1st");
    }
    if (
      parksArray[i].name == "Animal-Kingdom" &&
      parksArray.findIndex((x) => x.name == "Animal-Kingdom") === 0
    ) {
      title = document.getElementById("AK-title");
      title.append("🥇");
      console.log("animal kingdom is 1st");
    }
    if (
      parksArray[i].name == "Hollywood-Studios" &&
      parksArray.findIndex((x) => x.name == "Hollywood-Studios") === 0
    ) {
      title = document.getElementById("HS-title");
      title.append("🥇");
      console.log("hollywood studios is 1st");
    }

    //If the index is 1
    if (
      parksArray[i].name == "Magic-Kingdom" &&
      parksArray.findIndex((x) => x.name == "Magic-Kingdom") === 1
    ) {
      title = document.getElementById("MK-title");
      title.append("🥈");
      console.log("magic kingdom is 2nd");
    }
    if (
      parksArray[i].name == "Epcot" &&
      parksArray.findIndex((x) => x.name == "Epcot") === 1
    ) {
      title = document.getElementById("epcot-title");
      title.append("🥈");
      console.log("epcot is 2nd");
    }
    if (
      parksArray[i].name == "Animal-Kingdom" &&
      parksArray.findIndex((x) => x.name == "Animal-Kingdom") === 1
    ) {
      title = document.getElementById("AK-title");
      title.append("🥈");
      console.log("animal kingdom is 2nd");
    }
    if (
      parksArray[i].name == "Hollywood-Studios" &&
      parksArray.findIndex((x) => x.name == "Hollywood-Studios") === 1
    ) {
      title = document.getElementById("HS-title");
      title.append("🥈");
      console.log("hollywood studios is 2nd");
    }
    //If the index is 2
    if (
      parksArray[i].name == "Magic-Kingdom" &&
      parksArray.findIndex((x) => x.name == "Magic-Kingdom") === 2
    ) {
      title = document.getElementById("MK-title");
      title.append("🥉");
      console.log("magic kingdom is 3rd");
    }
    if (
      parksArray[i].name == "Epcot" &&
      parksArray.findIndex((x) => x.name == "Epcot") === 2
    ) {
      title = document.getElementById("epcot-title");
      title.append("🥉");
      console.log("epcot is 3rd");
    }
    if (
      parksArray[i].name == "Animal-Kingdom" &&
      parksArray.findIndex((x) => x.name == "Animal-Kingdom") === 2
    ) {
      title = document.getElementById("AK-title");
      title.append("🥉");
      console.log("animal kingdom is 3rd");
    }
    if (
      parksArray[i].name == "Hollywood-Studios" &&
      parksArray.findIndex((x) => x.name == "Hollywood-Studios") === 2
    ) {
      title = document.getElementById("HS-title");
      title.append("🥉");
      console.log("hollywood studios is 3rd");
    }
  }

  //iterates through list of attractions and displays each to
  //the DOM while being sorted to their correct theme park
  for (let i = 0; i < ridesArray.length; i++) {
    //initializes dom element
    let child;

    //creates the p tag for the data to enter into
    const para = document.createElement("p");
    para.classList.add("ride");

    if (
      waitPercentDifference(
        ridesArray[i].queue["STANDBY"].waitTime,
        ridesForecast[i].FWT
      ) < -0.3
    ) {
      para.classList.toggle("shimmer", true);
    }

    //generates the name of the attraction along with the
    //current wait time for it
    const node = document.createTextNode(
      `${ridesArray[i].name} : ${ridesArray[i].queue["STANDBY"].waitTime} minutes`
    );

    //checks if attraction is in magic kingdom
    if (ridesArray[i].parkId == "75ea578a-adc8-4116-a54d-dccb60765ef9") {
      child = document.getElementById("MK-dropdown");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para);
    }

    //checks if attraction is in epcot
    if (ridesArray[i].parkId == "47f90d2c-e191-4239-a466-5892ef59a88b") {
      child = document.getElementById("Epcot-dropdown");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para);
    }

    //checks if attraction is in animal kingdom
    if (ridesArray[i].parkId == "1c84a229-8862-4648-9c71-378ddd2c7693") {
      child = document.getElementById("AK-dropdown");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para);
    }

    //checks if attraction is in hollywood studios
    if (ridesArray[i].parkId == "288747d1-8b4f-4a64-867e-ea7c9b27bad8") {
      child = document.getElementById("HS-dropdown");

      //appends the attraction and wait time into p tag
      para.appendChild(node);

      //appends the p tag into the correct div
      child.appendChild(para);
    }
  }

  // Get the parent element that contains all the park divs
  const parent = document.getElementById("container");

  // Loop through the parksArray and move the corresponding div to the correct position
  for (let i = 0; i < parksArray.length; i++) {
    const park = parksArray[i];
  
    // Get the corresponding div based on the name of the park
    const div = document.getElementById(`${park.name}`);
  
    // Move the div to the correct position based on the order specified in the parksArray
    parent.appendChild(div);
  }
console.log(parent);
  console.log(parksArray);
}

//calls api function where all the magic happens
getApi(liveDataURL);

for (let i = 0; i < 4; i++) {
  const dropButton = document.getElementsByClassName("button")[i];
  const buttonImage = document.getElementsByClassName("button-img")[i];

  dropButton.addEventListener("click", () => {
    buttonImage.classList.toggle("rotate");
  });
}

const magicKingdom = document.getElementById("MK-dropdown");
const epcot = document.getElementById("Epcot-dropdown");
const animalKingdom = document.getElementById("AK-dropdown");
const hollywoodStudios = document.getElementById("HS-dropdown");

const dropButton1 = document.getElementsByClassName("button")[0];
const dropButton2 = document.getElementsByClassName("button")[1];
const dropButton3 = document.getElementsByClassName("button")[2];
const dropButton4 = document.getElementsByClassName("button")[3];

dropButton1.addEventListener("click", () => {
  magicKingdom.classList.toggle("active");
});
dropButton2.addEventListener("click", () => {
  epcot.classList.toggle("active");
});
dropButton3.addEventListener("click", () => {
  animalKingdom.classList.toggle("active");
});
dropButton4.addEventListener("click", () => {
  hollywoodStudios.classList.toggle("active");
});
