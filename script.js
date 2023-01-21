const destinationsURL =
  "https://api.themeparks.wiki/v1/entity/waltdisneyworldresort/live";
const attractionEl = document.getElementById("attractions");
const body = document.body;
let ridesArray = [];


async function getApi(url) {
  const response = await fetch(url);
  let data = await response.json();
  let attractions = data.liveData;
  console.log(attractions);
    Object.keys(attractions).forEach((key) => {
        if (attractions[key].queue === undefined) {
          return;
        } else if(attractions[key].queue['STANDBY'] === undefined){
            return;
        } else if(attractions[key].queue['STANDBY'].waitTime === null){
            return;
        } else {
          //console.log(`${attractions[key].name} : ${attractions[key].queue['STANDBY'].waitTime}`);
          const para = document.createElement("p") ;

          


          const node = document.createTextNode(`${attractions[key].name} : ${attractions[key].queue['STANDBY'].waitTime}` )
          const child = document.getElementById('ride');
          para.appendChild(node);
          
          attractionEl.appendChild(para, child);
        }
      });
      
}

getApi(destinationsURL);


