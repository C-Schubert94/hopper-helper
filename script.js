//URL for accessing the themeparks api for live data
const liveDataURL =
  "https://api.themeparks.wiki/v1/entity/waltdisneyworldresort/live";

//initializing empty array for the rides to be added to  
let ridesArray = [];

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

      //sorts array in reverse so attractions with the longest
      //standby wait time are at the top
      ridesArray.sort((a, b) => {
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
      `${key.name} : ${key.queue["STANDBY"].waitTime}`
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
}

//calls api function where all the magic happens
getApi(liveDataURL);

//random console log just in case I need to see something
console.log(ridesArray);
