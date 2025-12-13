// ===============================
// 全域設定
// ===============================
let chart = null;
const API_BASE = "https://stonks-backend-pnai.onrender.com";

// ===============================
// 主功能
// ===============================
function analyze() {
  const stock = document.getElementById("stockInput").value.trim().toUpperCase();
  if (!stock) return alert("請輸入股票代號");

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

    if (chart) chart.destroy();
  }
}

// ===============================
// Chart.js（真實歷史股價）
// ===============================
function drawChart(labels, prices) {
  const ctx = document.getElementById("priceChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "歷史收盤價",
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
  try {
    const res = await fetch(`${API_BASE}/sentiment/${symbol}`);
    if (!res.ok) throw new Error("No sentiment");

    const data = await res.json();

    document.getElementById("sentiment").innerHTML = `
      看多比例：${data.bullishPercent ?? "N/A"}<br>
      看空比例：${data.bearishPercent ?? "N/A"}<br>
      新聞分數：${data.companyNewsScore ?? "N/A"}
    `;
  } catch {
    document.getElementById("sentiment").innerHTML =
      "無法取得新聞情緒資料";
  }
}

// ===============================
// 白話解讀
// ===============================
function renderExplain(prices) {
  if (prices.length < 2) return;

  const last = prices[prices.length - 1];
  const before = prices[prices.length - 2];
  const trend = last > before ? "略為上行" : "稍微下降";

  document.getElementById("explain").innerHTML =
    `近期價格走勢呈現 <b>${trend}</b>，新聞情緒可作為市場氛圍
