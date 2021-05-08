import React, { useState } from "react";
import Websocket from "react-websocket";

function Weather() {
  const [cities, setCities] = useState([]);
  const [cityMap, setCityMap] = useState({});
  const getTableContent = (arr) => {
    const iterateItem = (item) => {
      return item.map(function (city, j) {
        return (
          <tr>
            <td>{city.name}</td>
            <td style={getColor(city.aqi.toFixed(2))}>{city.aqi.toFixed(2)}</td>
            <td>{getTimeDiff(city.updatedAt)}</td>
          </tr>
        );
      });
    };
    return (
      <>
        <Websocket
          url="ws://city-ws.herokuapp.com"
          onMessage={handleData.bind(this)}
        />
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Current AQI</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>{iterateItem(arr)}</tbody>
        </table>
      </>
    );
  };

  function handleData(data) {
    let result = JSON.parse(data);
    for (const city of result) {
      const dt = new Date();
      cityMap[city.city] = {
        name: city.city,
        aqi: city.aqi,
        updatedAt: dt.toString(),
      };
    }
    setCityMap(cityMap);
    setCities(Object.values(cityMap));
  }

  function getTimeDiff(lastUpdatedAt) {
    let d1 = new Date(lastUpdatedAt);
    let d2 = new Date();
    console.log("d1", d1, "d2", d2);

    let difference = Math.abs(d1 - d2); //to get absolute value
    //calculate for each one
    let Mins = Math.floor((difference / (1000 * 60)) % 60);
    let Seconds = Math.floor((difference / 1000) % 60);
    console.log("mins", Mins, "seconds", Seconds);
    if (Mins === 1) {
      return "A minute ago";
    }
    if (Mins === 0) {
      if (Seconds === 1) {
        return "A minute ago";
      }
      return "A Few seconds ago";
    }
    return d1.getHours() + ":" + d1.getMinutes();
  }

  function getColor(aqi) {
    if (aqi > 0 && aqi <= 50) {
      return { color: "#63a950", "font-weight": "bold" };
    } else if (aqi > 50 && aqi <= 100) {
      return { color: "#a3c854", "font-weight": "bold" };
    } else if (aqi > 100 && aqi <= 200) {
      return { color: "#fbee35", "font-weight": "bold" };
    } else if (aqi > 200 && aqi <= 300) {
      return { color: "#ee9b33", "font-weight": "bold" };
    } else if (aqi > 300 && aqi <= 400) {
      return { color: "#e34832", "font-weight": "bold" };
    }
    return { color: "#b03624", "font-weight": "bold" };
  }

  return getTableContent(cities);
}
export default Weather;
