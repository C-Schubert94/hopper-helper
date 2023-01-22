const destinationsURL =
  "https://api.themeparks.wiki/v1/entity/waltdisneyworldresort/live";
const attractionEl = document.getElementById("attractions");
const body = document.body;
let ridesArray = [];

async function getApi(url) {
  const response = await fetch(url);
  let data = await response.json();
  let attractions = data.liveData;
  Object.keys(attractions).forEach((key) => {
    if (attractions[key].queue === undefined) {
      return;
    } else if (attractions[key].queue["STANDBY"] === undefined) {
      return;
    } else if (attractions[key].queue["STANDBY"].waitTime === null) {
      return;
    } else {
      //console.log(`${attractions[key].name} : ${attractions[key].queue['STANDBY'].waitTime}`);

      ridesArray.push(attractions[key]);
      ridesArray.sort((a, b) => {
        return b.queue["STANDBY"].waitTime - a.queue["STANDBY"].waitTime;
      });
    }
  });
    ridesArray.forEach((key) => {
    let child;
    const para = document.createElement("p");
    const node = document.createTextNode(
      `${key.name} : ${key.queue["STANDBY"].waitTime}`
    );
        if(key.parkId == "75ea578a-adc8-4116-a54d-dccb60765ef9"){
            child = document.getElementById("Magic-Kingdom");
            para.appendChild(node);
            child.appendChild(para, child);
        }
        if(key.parkId == "47f90d2c-e191-4239-a466-5892ef59a88b"){
            child = document.getElementById("Epcot");
            para.appendChild(node);
            child.appendChild(para, child);
        } 
        if(key.parkId == "1c84a229-8862-4648-9c71-378ddd2c7693"){
            child = document.getElementById("Animal-Kingdom");
            para.appendChild(node);
            child.appendChild(para, child);
        } 
        if(key.parkId == "288747d1-8b4f-4a64-867e-ea7c9b27bad8"){
            child = document.getElementById("Hollywood-Studios");
            para.appendChild(node);
            child.appendChild(para, child);
        } 



  });
}

getApi(destinationsURL);

// async function displayRides(array) {

// }

// displayRides(ridesArray);
console.log(ridesArray);
