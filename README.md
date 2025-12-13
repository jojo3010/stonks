# stonks
# Stonks — 新手投資分析助手

Stonks 是一個為金融與程式新手設計的 Web 投資分析展示系統，  
透過前後端分離架構，協助使用者理解股票歷史價格走勢與新聞情緒指標。

> 本系統僅供學習與資料分析展示，不提供任何投資或下單建議。

---

## 系統架構說明

本專案採用前後端分離架構：

- **前端（Frontend）**
  - 技術：HTML / CSS / JavaScript
  - 圖表：Chart.js
  - 部署：GitHub Pages
  - 功能：
    - 股票代碼輸入
    - 顯示歷史價格走勢圖
    - 顯示新聞情緒分析結果
    - 使用 localStorage 儲存使用者偏好

- **後端（Backend）**
  - 技術：Python + FastAPI
  - 部署：Render
  - 功能：
    - 串接 Yahoo Finance 取得股票歷史價格
    - 串接 Finnhub API 取得新聞情緒分析
    - 驗證股票代碼有效性
    - 提供 RESTful API 給前端使用

- **資料來源**
  - 股票價格：Yahoo Finance
  - 新聞情緒：Finnhub News Sentiment API

---

## 系統流程

1. 使用者在前端輸入股票代碼（如 AAPL、TSLA）
2. 前端透過 Fetch 呼叫後端 API
3. 後端向第三方資料來源取得真實資料
4. 後端回傳 JSON 格式資料
5. 前端使用 Chart.js 將資料視覺化
6. 顯示白話解讀與新聞情緒指標

---

## API 說明

### 1. 取得股票歷史價格
