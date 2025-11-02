const form = document.querySelector(".container form");
const input = document.querySelector(".container input");
const msg = document.getElementById("weather-msg");
const resultsGrid = document.getElementById("resultsGrid");

form.addEventListener(`submit`, (e) => {
  e.preventDefault();
  getWeatherDataFromAPI();
});

const getWeatherDataFromAPI = async () => {
  const lang = "tr";
  const units = "metric";
  const API_KEY = "467e7d408d6b300647c85a18706d38d0";
  const inputValue = input.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${API_KEY}&lang=${lang}&units=${units}`;
  console.log(url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP Error!");
    }
    const data = await response.json();

    const { name, weather, main, sys, wind, coord } = data;
    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const sunrise = sys.sunrise;
    const sunset = sys.sunset;

    const sunriseDate = new Date(sunrise * 1000);
    const sunsetDate = new Date(sunset * 1000);

    const sunriseTime = sunriseDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const sunsetTime = sunsetDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const cityNameH5 = resultsGrid.querySelectorAll(
      ".weather-city .card-title"
    );

    console.log(cityNameH5.innerText);
    const cityNameH5Array = Array.from(cityNameH5);
    if (cityNameH5Array.length > 0) {
      const filteredArray = cityNameH5Array.filter(
        (item) => item.innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `Zaten ${name} şehri için arama yaptınız.`;
        setTimeout(() => {
          msg.innerText = "";
        }, 5000);
        form.reset();
        return;
      }
    }

    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 weather-city";

    col.innerHTML = `
    <div class="card shadow-sm border-0 rounded-4">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="card-title mb-0 fw-bold">
              ${name} </h5> <h5> <span class="text-secondary fs-6">(${
      sys.country
    })</span></h5>
            
            <small class="text-muted">${weather[0].description}</small>
          </div>
          <img src= "${iconUrl}" alt= "${name}-icon">
        </div>

        <h2 class="fw-bold mb-2">${Math.round(main.temp)}°C</h2>
        <p class="mb-0 text-info">Hissedilen sıcaklık: ${Math.round(
          main.feels_like
        )}°C</p>
        <hr>
        <div class="row text-center">
          <div class="col">
            <i class="bi bi-wind text-primary"></i>
            <div class="small">${wind.speed} km/h</div>
          </div>
          <div class="col">
            <i class="bi bi-droplet text-info"></i>
            <div class="small">${main.humidity}%</div>
          </div>
          <div class="col">
            <i class="bi bi-geo-alt text-danger"></i>
            <div class="small">${coord.lat}, ${coord.lon}</div>
          </div>
        </div>
        <hr>
<div class="row text-center">
          <div class="col">
          <i class="bi bi-sunset text-warning"></i>
            <div class="small">Gün Doğumu: ${sunriseTime}</div>
          </div>
          <div class="col">
          <i class="bi bi-sunrise text-warning"></i>
          
          <div class="small">Gün Batımı: ${sunsetTime}</div>
          </div>
          </div>
        </div>
      </div>
    </div>
  `;

    resultsGrid.prepend(col);
  } catch (error) {
    console.log(`Hata:`, error.message);
    msg.innerText = `404 (Şehir bulunamadı!)`;

    setTimeout(() => {
      msg.innerText = "";
    }, 5000);
  }

  form.reset();
};
