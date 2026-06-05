// Bản đồ mã thời tiết của Open-Meteo sang icon + mô tả
const weatherCodes = {
  0: { icon: "☀️", desc: "Trời quang" },
  1: { icon: "🌤️", desc: "Phần lớn quang" },
  2: { icon: "⛅", desc: "Có mây một phần" },
  3: { icon: "☁️", desc: "Nhiều mây" },
  45: { icon: "🌫️", desc: "Sương mù" },
  48: { icon: "🌫️", desc: "Sương đóng băng" },
  51: { icon: "🌦️", desc: "Mưa phùn nhẹ" },
  61: { icon: "🌧️", desc: "Mưa nhỏ" },
  63: { icon: "🌧️", desc: "Mưa vừa" },
  65: { icon: "🌧️", desc: "Mưa to" },
  80: { icon: "🌦️", desc: "Mưa rào nhẹ" },
  95: { icon: "⛈️", desc: "Giông" },
};

// Lấy tọa độ từ tên thành phố dùng Open-Meteo geocoding API
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không thể kết nối API");
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("Không tìm thấy thành phố này!");
  }
  return data.results[0]; // { name, latitude, longitude, country }
}

// Lấy thời tiết từ tọa độ
async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);
  return res.json();
}

function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("error-box").style.display = "none";
  document.getElementById("weather-card").style.display = "none";
}

function showError(msg) {
  document.getElementById("loading").style.display = "none";
  document.getElementById("error-box").style.display = "block";
  document.getElementById("error-msg").textContent = "❌ " + msg;
}

function showWeather(cityInfo, weatherData) {
  document.getElementById("loading").style.display = "none";
  document.getElementById("error-box").style.display = "none";
  document.getElementById("weather-card").style.display = "block";

  const cw = weatherData.current_weather;
  const code = cw.weathercode;
  const info = weatherCodes[code] || { icon: "🌡️", desc: "Không rõ" };

  document.getElementById("card-city").textContent =
    cityInfo.name + ", " + cityInfo.country;
  document.getElementById("card-icon").textContent = info.icon;
  document.getElementById("card-temp").textContent = cw.temperature + "°C";
  document.getElementById("card-feels").textContent = cw.temperature + "°C";
  document.getElementById("card-wind").textContent = cw.windspeed + " km/h";
  document.getElementById("card-desc").textContent = info.desc;
}

async function searchWeather() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) {
    alert("Bạn chưa nhập tên thành phố!");
    return;
  }

  showLoading();

  try {
    const cityInfo = await getCoordinates(city);
    const weatherData = await getWeather(cityInfo.latitude, cityInfo.longitude);
    showWeather(cityInfo, weatherData);
    saveHistory(city);
  } catch (error) {
    showError(error.message);
  }
}

// ===== LỊCH SỬ TÌM KIẾM =====
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory") || "[]");

  // Xóa nếu đã có rồi (không bị trùng)
  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());

  // Thêm vào đầu
  history.unshift(city);

  // Chỉ giữ 5 cái gần nhất
  if (history.length > 5) {
    history = history.slice(0, 5);
  }

  localStorage.setItem("weatherHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory") || "[]");
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  if (history.length === 0) {
    list.innerHTML =
      "<span style='color:#999;font-size:14px'>Chưa có lịch sử</span>";
    return;
  }

  history.forEach((city) => {
    const span = document.createElement("span");
    span.classList.add("history-item");
    span.textContent = city;
    span.onclick = () => {
      document.getElementById("city-input").value = city;
      searchWeather();
    };
    list.appendChild(span);
  });
}

// Cho phép nhấn Enter để tìm
document
  .getElementById("city-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") searchWeather();
  });

// Load lịch sử khi mở trang
renderHistory();
