// ===============================
// 全域設定
// ===============================
let chart = null;
const API_BASE = "https://stonks-backend-pnai.onrender.com";

// ===============================
// 主功能：使用者按「開始分析」
// ===============================
function analyze() {
  const stock = document.getElementById("stockInput").value.trim();
  if (!stock) return alert("請輸入股票代號");

  localStorage.setItem("preferredStock", stock);

  loadRealStock(stock);      // 真實股價 + 圖表
  loadSentiment(stock);      // 真實新聞情緒
}

// ===============================
// 真實股票資料（Yahoo Finance）
// ===============================
async function loadRealStock(symbol) {
  const res = await fetch(`${API_BASE}/price/${symbol}`);
  const data = await res.json();

  const labels = data.date;
  const prices = data.close;

  // 顯示最新收盤價
  document.getElementById("price").innerText =
    `${symbol} 最新收盤價：${prices[prices.length - 1]}`;

  drawChart(labels, prices);
  renderExplain(prices);
}

// ===============================
// Chart.js 繪圖（真實歷史股價）
// ===============================
function drawChart(labels, prices) {
  const ctx = document.getElementById("priceChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "歷史收盤價（Yahoo Finance）",
        data: prices,
        borderWidth: 2,
        tension: 0.25
      }]
    }
  });
}

// ===============================
// 真實新聞情緒（Finnhub）
// ===============================
async function loadSentiment(symbol) {
  const res = await fetch(`${API_BASE}/sentiment/${symbol}`);
  const data = await res.json();

  document.getElementById("sentiment").innerHTML = `
    看多比例：${data.bullishPercent ?? "N/A"}<br>
    看空比例：${data.bearishPercent ?? "N/A"}<br>
    新聞分數：${data.companyNewsScore ?? "N/A"}
  `;
}

// ===============================
// 白話解讀（依真實價格）
// ===============================
function renderExplain(prices) {
  if (prices.length < 2) return;

  const last = prices[prices.length - 1];
  const before = prices[prices.length - 2];
  const trend = last > before ? "略為上行" : "稍微下降";

  document.getElementById("explain").innerHTML =
    `近期價格走勢呈現 <b>${trend}</b>，新聞情緒可作為市場氛圍參考。本工具僅供學習與分析展示，不提供任何下單建議。`;
}

// ===============================
// 初始化：頁面載入即顯示
// ===============================
window.onload = () => {
  const saved = localStorage.getItem("preferredStock") || "AAPL";
  document.getElementById("stockInput").value = saved;
  loadRealStock(saved);
  loadSentiment(saved);
};
