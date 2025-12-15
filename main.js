// ===============================
// 全域設定
// ===============================
let chart = null;
const API_BASE = "https://stonks-backend-pnai.onrender.com";

// ===============================
// 主功能
// ===============================
function analyze() {
  const input = document.getElementById("stockInput");
  if (!input) return;

  const stock = input.value.trim().toUpperCase();
  if (!stock) {
    alert("請輸入股票代號");
    return;
  }

  localStorage.setItem("preferredStock", stock);

  loadRealStock(stock);
  loadSentiment(stock);
}

// ===============================
// 真實股票資料（Yahoo Finance）
// ===============================
async function loadRealStock(symbol) {
  try {
    const res = await fetch(`${API_BASE}/price/${symbol}`);
    if (!res.ok) throw new Error("Invalid symbol");

    const data = await res.json();
    const labels = data.date;
    const prices = data.close;

    document.getElementById("price").innerText =
      `${symbol} 最新收盤價：${prices[prices.length - 1]}`;

    drawChart(labels, prices);
    renderExplain(prices);
  } catch (err) {
    document.getElementById("price").innerText =
      "找不到該股票代碼，請重新輸入";

    document.getElementById("sentiment").innerHTML = "";
    document.getElementById("explain").innerHTML = "";

    if (chart) {
      chart.destroy();
      chart = null;
    }
  }
}

// ===============================
// Chart.js（真實歷史股價）
// ===============================
function drawChart(labels, prices) {
  const canvas = document.getElementById("priceChart");
  if (!canvas) return;

  if (chart) {
    chart.destroy();
    chart = null;
  }

  chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "歷史收盤價（Yahoo Finance）",
          data: prices,
          borderWidth: 2,
          tension: 0.25
        }
      ]
    }
  });
}

// ===============================
// 新聞情緒（穩定退化）
// ===============================
// async function loadSentiment(symbol) {
//   try {
//     const res = await fetch(`${API_BASE}/sentiment/${symbol}`);
//     const data = await res.json();

//     if (!data.available) {
//       document.getElementById("sentiment").innerText =
//         "新聞情緒資料目前無法取得";
//       return;
//     }

//     document.getElementById("sentiment").innerHTML =
//       `看多比例：${data.bullishPercent ?? "N/A"}<br>` +
//       `看空比例：${data.bearishPercent ?? "N/A"}<br>` +
//       `新聞分數：${data.companyNewsScore ?? "N/A"}`;
//   } catch {
//     document.getElementById("sentiment").innerText =
//       "新聞情緒資料目前無法取得";
//   }
// }
async function loadSentiment(symbol) {
  // 假資料（每次呼叫會有小變化，Demo 好看）
  const mockData = {
    bullishPercent: Math.floor(Math.random() * 30) + 50, // 50–79%
    bearishPercent: Math.floor(Math.random() * 20) + 10, // 10–29%
    companyNewsScore: (Math.random() * 0.6 - 0.3).toFixed(2)
  };

  document.getElementById("sentiment").innerHTML =
    `看多比例：${mockData.bullishPercent}%（模擬）<br>` +
    `看空比例：${mockData.bearishPercent}%（模擬）<br>` +
    `新聞分數：${mockData.companyNewsScore}（模擬）`;
}


// ===============================
// 白話解讀
// ===============================
function renderExplain(prices) {
  if (!prices || prices.length < 2) return;

  const last = prices[prices.length - 1];
  const before = prices[prices.length - 2];
  const trend = last > before ? "略為上行" : "稍微下降";

  document.getElementById("explain").innerHTML =
    `近期價格走勢呈現 <b>${trend}</b>，` +
    `新聞情緒可作為市場氛圍參考。<br>` +
    `本工具僅供學習與資料分析展示，不提供任何投資或下單建議。`;
}

// ===============================
// 初始化
// ===============================
window.onload = () => {
  localStorage.removeItem("preferredStock");

  const input = document.getElementById("stockInput");
  if (input) input.value = "";

  document.getElementById("price").innerText = "請輸入股票代號";
  document.getElementById("sentiment").innerHTML = "";
  document.getElementById("explain").innerHTML = "";

  if (chart) {
    chart.destroy();
    chart = null;
  }
};



