// Elements for the weather application logic.
const currentLocationText = document.querySelector("#location-name");
const searchInputField = document.querySelector("#search-location");
const locationForm = document.querySelector("#form");

// Elements that are needed to change the values
const locationContainer = document.querySelector("#location-name");
const dateContainer = document.querySelector("#date");
const temperatureContainer = document.querySelector("#temp-val");
const weatherStatusContainer = document.querySelector("#weather-status"); 
const windSpeedContainer = document.querySelector("#wind-speed");
const humidityContainer = document.querySelector("#humidity");

locationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    let location = searchInputField.value;
    console.log(`Location entered: ${location}`);

    const weatherData = await getWeatherData(location);
    displayWeatherData(weatherData, location);
})

// Get the weather data from the API
const getWeatherData = async (location) => {
    console.log(`Fetching weather data for: ${location}`);
    const apiKey = "64b1c9cc9454302e855eb321f5925037";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    console.log(`URL: ${url}`);

    if (!location) return {};

    else {
        const response = await fetch(url)
        const data = await response.json();
        return data;
    }

}
   
// Get the current Date
const getDateToday = () => {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let wordMonth = null;

    switch (month) {
        case 1: {
            wordMonth = "January"
            break;
        }
        case 2: {
            wordMonth = "February"
            break;
        }
        case 3: {
            wordMonth = "March"
            break;
        }
        case 4: {
            wordMonth = "April"
            break;
        }
        case 5: {
            wordMonth = "May"
            break;
        }
        case 6: {
            wordMonth = "June"
            break;
        }
        case 7: {
            wordMonth = "July"
            break;
        }
        case 8: {
            wordMonth = "August"
            break;
        }
        case 9: {
            wordMonth = "September"
            break;
        }
        case 10: {
            wordMonth = "October"
            break;
        }
        case 11: {
            wordMonth = "November"
            break;
        }
        case 12: {
            wordMonth = "December"
            break;
        }
            
    }

    return `${day} ${wordMonth}`;
}

// Get the time at the searched location
const getTime = (data) => {
    const timezoneOffset = data.timezone;

    // Get the current UTC time in milliseconds
    const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    
    // Calculate the local time using the timezone offset
    const localTime = new Date(utcTime + timezoneOffset * 1000);

    return localTime.getHours();
}

// Displays the weather at the UI.
const displayWeatherData = (data) => {
    // If there is no weather data
    if (data === null || Object.keys(data).length === 0) {
        locationContainer.textContent = data.name;
        dateContainer.textContent = getDateToday();
        temperatureContainer.textContent = "0";
        weatherStatusContainer.textContent = "Null";
        windSpeedContainer.textContent = "0";
        humidityContainer.textContent = "0";
    }

    // If there is data
    else {
        locationContainer.textContent = data.name;
        dateContainer.textContent = getDateToday();
        temperatureContainer.textContent = Math.floor(data.main.temp - 273.15);
        weatherStatusContainer.textContent = customWeatherStatus(data.weather[0].main, getTime(data));
        windSpeedContainer.textContent = data.wind.speed;
        humidityContainer.textContent = data.main.humidity;
    }
}

// Change website background 
const changeStyle = (statusId) => {

    let statusList = ["sunny", "cloudy", "evening", "rainy"];

    const bodyElement = document.querySelector("body");
    const locationSection = document.querySelector("#location");
    const locationMarker = document.querySelector(".fa-map-marker");
    const svg = document.querySelectorAll("svg")
    const hFour = document.querySelectorAll("h4")
    const date = document.querySelector("#date-container");
    const temp = document.querySelector("#temperature");
    const image = document.querySelector("#weather-img");

    // Clearing all the theme classes
    statusList.forEach((status) => {
        bodyElement.classList.remove(`body-${status}`);
        locationSection.classList.remove(`location-${status}`);
        locationMarker.classList.remove(`icon-location-${status}`);
        currentLocationText.classList.remove(`icon-location-${status}`);
        date.classList.remove(`h4-date-temp-weather-${status}`);
        temp.classList.remove(`h4-date-temp-weather-${status}`);
        hFour[0].classList.remove(`h4-date-temp-weather-${status}`);
        hFour[1].classList.remove(`h4-date-temp-weather-${status}`);
        weatherStatusContainer.classList.remove(`h4-date-temp-weather-${status}`);
        svg[0].classList.remove(`svg-${status}`);
        svg[1].classList.remove(`svg-${status}`);
    })

    let dateToday = new Date();

    // Adding the necessary theme and changes
    bodyElement.classList.add(`body-${statusId}`);
    locationSection.classList.add(`location-${statusId}`);
    locationMarker.classList.add(`icon-location-${statusId}`);
    currentLocationText.classList.add(`icon-location-${statusId}`);
    date.classList.add(`h4-date-temp-weather-${statusId}`);
    date.dateTime = `${dateToday.getFullYear()}-${dateToday.getMonth() + 1}-${dateToday.getDate()}`;
    temp.classList.add(`h4-date-temp-weather-${statusId}`);
    hFour[0].classList.add(`h4-date-temp-weather-${statusId}`);
    hFour[1].classList.add(`h4-date-temp-weather-${statusId}`);
    weatherStatusContainer.classList.add(`h4-date-temp-weather-${statusId}`);
    svg[0].classList.remove(`svg-${statusId}`);
    svg[1].classList.remove(`svg-${statusId}`);
    image.src = `resources/${statusId}.png`;
}

// Custom values to display 
const customWeatherStatus = (statusId, time) => {
    console.log("Time today: " + time)
    console.log("Status: " + statusId)
    if (
        statusId === "Thunderstorm" 
        || statusId === "Drizzle"
        || statusId === "Rain"
        || statusId === "Snow"
    ) {
        changeStyle("rainy");
        return "Rainy";
    }
    else if (
        statusId === "Mist" 
        || statusId === "Smoke"
        || statusId === "Haze"
        || statusId === "Fog"
        || statusId === "Clouds"
    ) {
        changeStyle("cloudy");
        return "Cloudy";
    }
    else {
        if (statusId === "Clear" && time < 17 && time > 5) {
            changeStyle("sunny");
            return "Sunny"
        }
        else {
            changeStyle("evening");
            return "Night";
        }
    }
}

// Change UI based on on weather status
window.onload = async () => {
    const weatherData = await getWeatherData("Manila");
    displayWeatherData(weatherData);
}
