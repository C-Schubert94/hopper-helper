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
    }
  });
}

getApi(destinationsURL);

ridesArray.sort((a, b) => {
  return b.queue["STANDBY"].waitTime - a.queue["STANDBY"].waitTime;
});

function displayRides(array) {
  array.forEach((key) => {
      const para = document.createElement("p") ;
      const node = document.createTextNode(`${array[key].name} : ${array[key].queue['STANDBY'].waitTime}` )
      const child = document.getElementById('ride');
      para.append(node);
      attractionEl.append(para, child);
  });
}

displayRides(ridesArray);
console.log(ridesArray);
