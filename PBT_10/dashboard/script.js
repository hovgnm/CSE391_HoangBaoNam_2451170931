// ===== CÁC HÀM RENDER WIDGET =====

function renderWeather(data) {
  const cw = data.current_weather;
  const codes = {
    0: "☀️ Trời quang",
    1: "🌤️ Phần lớn quang",
    2: "⛅ Có mây",
    3: "☁️ Nhiều mây",
    45: "🌫️ Sương mù",
    61: "🌧️ Mưa nhỏ",
    63: "🌧️ Mưa vừa",
    80: "🌦️ Mưa rào",
    95: "⛈️ Giông",
  };
  const desc = codes[cw.weathercode] || "🌡️ Không rõ";

  document.getElementById("content-weather").innerHTML = `
        <div class="weather-info">
            <div class="temp-big">${cw.temperature}°C</div>
            <div class="desc">${desc}</div>
            <div class="detail">💨 Gió: ${cw.windspeed} km/h</div>
            <div class="detail">🧭 Hướng gió: ${cw.winddirection}°</div>
            <div class="detail">📍 Hà Nội, Việt Nam</div>
        </div>
    `;
  setStatus("weather", "success", "✅ OK");
}

function renderUsers(data) {
  const users = data.results;
  const list = users
    .map(
      (u) => `
        <li>
            <div class="avatar">${u.name.first[0]}${u.name.last[0]}</div>
            <div class="user-info">
                <strong>${u.name.first} ${u.name.last}</strong>
                <small>${u.email}</small>
                <small>📍 ${u.location.city}, ${u.location.country}</small>
            </div>
        </li>
    `,
    )
    .join("");

  document.getElementById("content-users").innerHTML =
    `<ul class="user-list">${list}</ul>`;
  setStatus("users", "success", "✅ OK");
}

function renderCountry(data) {
  const country = data[0];
  const pop = (country.population / 1_000_000).toFixed(1);
  const area = country.area.toLocaleString();
  const capital = country.capital?.[0] || "—";
  const langs = Object.values(country.languages || {}).join(", ");
  const flag = country.flag;

  document.getElementById("content-country").innerHTML = `
        <div class="country-info">
            <div class="country-flag">${flag}</div>
            <div class="country-row"><span>Tên chính thức</span><span>${country.name.official}</span></div>
            <div class="country-row"><span>Thủ đô</span><span>${capital}</span></div>
            <div class="country-row"><span>Dân số</span><span>${pop} triệu</span></div>
            <div class="country-row"><span>Diện tích</span><span>${area} km²</span></div>
            <div class="country-row"><span>Ngôn ngữ</span><span>${langs}</span></div>
        </div>
    `;
  setStatus("country", "success", "✅ OK");
}

function renderError(widgetName, msg) {
  document.getElementById(`content-${widgetName}`).innerHTML = `
        <div class="widget-error">
            <p>❌ Không tải được dữ liệu</p>
            <p style="font-size:12px;color:#999;margin-top:5px">${msg}</p>
        </div>
    `;
  setStatus(widgetName, "error", "❌ Lỗi");
}

function setStatus(widgetName, type, text) {
  const el = document.getElementById(`status-${widgetName}`);
  el.textContent = text;
  el.className = `widget-status ${type}`;
}

function setLoading(widgetName) {
  setStatus(widgetName, "loading", "⏳ Đang tải");
  document.getElementById(`content-${widgetName}`).innerHTML = `
        <div class="skeleton" style="height:40px;margin-bottom:8px"></div>
        <div class="skeleton" style="height:16px;margin-bottom:8px"></div>
        <div class="skeleton" style="height:16px;margin-bottom:8px"></div>
        <div class="skeleton" style="height:16px;"></div>
    `;
}

// ===== LOAD DASHBOARD =====
async function loadDashboard() {
  const btn = document.getElementById("btn-refresh");
  btn.disabled = true;
  btn.textContent = "⏳ Đang tải...";

  // Reset loading state cho từng widget
  setLoading("weather");
  setLoading("users");
  setLoading("country");
  document.getElementById("load-time").textContent = "";

  const startTime = Date.now();

  // Gọi 3 API song song, dùng Promise.allSettled để 1 cái lỗi không ảnh hưởng cái khác
  const results = await Promise.allSettled([
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=21.03&longitude=105.85&current_weather=true",
    ).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

    fetch("https://randomuser.me/api/?results=4&nat=vn,fr,us,jp").then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

    fetch("https://restcountries.com/v3.1/name/vietnam?fullText=true").then(
      (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      },
    ),
  ]);

  const elapsed = Date.now() - startTime;

  // Xử lý từng kết quả riêng lẻ
  const [weatherResult, usersResult, countryResult] = results;

  if (weatherResult.status === "fulfilled") {
    renderWeather(weatherResult.value);
  } else {
    renderError("weather", weatherResult.reason.message);
  }

  if (usersResult.status === "fulfilled") {
    renderUsers(usersResult.value);
  } else {
    renderError("users", usersResult.reason.message);
  }

  if (countryResult.status === "fulfilled") {
    renderCountry(countryResult.value);
  } else {
    renderError("country", countryResult.reason.message);
  }

  document.getElementById("load-time").textContent =
    `⚡ Tải xong trong ${elapsed}ms`;

  btn.disabled = false;
  btn.textContent = "🔄 Refresh All";
}

// Chạy lần đầu khi mở trang
loadDashboard();
