let chart = null;

// ---- 主功能 ----
function analyze() {
  const stock = document.getElementById("stockInput").value.trim();
  if (!stock) return alert("請輸入股票代號");

  // 儲存使用者偏好
  localStorage.setItem("preferredStock", stock);

  // 假資料：價格走勢
  const priceData = generateMockPrices();

  drawChart(priceData);
  loadSentiment();
  renderExplain(priceData);
}

// ---- 價格走勢（假資料） ----
function generateMockPrices() {
  const arr = [];
  let p = 100;
  for (let i = 0; i < 10; i++) {
    p += (Math.random() - 0.5) * 5;
    arr.push(p.toFixed(2));
  }
  return arr;
}

function drawChart(data) {
  const ctx = document.getElementById("priceChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...Array(data.length).keys()],
      datasets: [{
        label: '預測價格',
        data: data
      }]
    }
  });
}

// ---- 新聞情緒分析（讀取 mock JSON） ----
async function loadSentiment() {
  const res = await fetch("./mock/sentiment.json");
  const data = await res.json();

  document.getElementById("sentiment").innerHTML = `
    正向：${data.positive} <br>
    負向：${data.negative} <br>
    中立：${data.neutral}
  `;
}

// ---- 白話解讀 ----
function renderExplain(data) {
  const last = Number(data[data.length - 1]);
  const before = Number(data[data.length - 2]);

  const trend = last > before ? "略為上行" : "稍微下降";

  document.getElementById("explain").innerHTML =
    `近期價格走勢呈現 **${trend}**，情緒數據將提供市場氛圍判讀。本工具僅供學習，不提供下單建議。`;
}

// ---- 初始化：載入偏好 ----
window.onload = () => {
  const saved = localStorage.getItem("preferredStock");
  if (saved) document.getElementById("stockInput").value = saved;
};
async function loadStock(symbol) {
  const res = await fetch(
    "https://stonks-backend-pnai.onrender.com/price/" + symbol
  );
  const data = await res.json();

  document.getElementById("price").innerText =
    symbol + " 最新收盤價：" + data.close[data.close.length - 1];
}

// 頁面載入自動抓 AAPL
loadStock("AAPL");

