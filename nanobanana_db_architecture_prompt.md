# nanobanana 專用：這個專案的資料庫系統架構圖提示詞

這份文件是根據目前專案的資料庫與後端結構整理出來的，可直接貼給 nanobanana 生成「獨立的資料庫系統架構圖」。

---

## 1. 專案資料庫現況

這個專案是一個 React + Express + SQLite 的小型電商/餐飲訂單系統。

### 主要資料庫組成
- 後端使用 SQLite 資料庫檔案：database.sqlite
- Express 伺服器負責提供 API 與資料庫操作
- 前端 React 會呼叫 API 進行登入、註冊與訂單查詢
- 前端也有 localStorage 做簡化暫存，作為非正式資料來源

### 目前實際存在的資料表

1. users
   - id: INTEGER PRIMARY KEY AUTOINCREMENT
   - username: TEXT UNIQUE NOT NULL
   - password: TEXT NOT NULL

2. orders
   - id: INTEGER PRIMARY KEY AUTOINCREMENT
   - user_id: INTEGER NOT NULL
   - date: TEXT NOT NULL
   - total: REAL NOT NULL
   - 外鍵: user_id -> users.id

3. order_items
   - id: INTEGER PRIMARY KEY AUTOINCREMENT
   - order_id: INTEGER NOT NULL
   - product_id: INTEGER NOT NULL
   - name: TEXT NOT NULL
   - quantity: INTEGER NOT NULL
   - price: REAL NOT NULL
   - 外鍵: order_id -> orders.id

### 需要注意的設計點
- 商品目錄（products）目前是後端硬編碼的陣列，不是 SQL 資料表
- 訂單與訂單明細是使用一對多關係
- 使用者與訂單是使用一對多關係
- 這是一個小型、單機式、以 SQLite 為核心的資料庫系統

---

## 2. 可直接貼給 nanobanana 的提示詞

請生成一張「獨立的資料庫系統架構圖」，不要畫成一般前端頁面 UI。請以這個專案的資料庫結構為基礎，繪製一張清楚、專業、可用於文件或簡報的系統架構圖。

內容要求：
- 以 SQLite 資料庫為核心
- 顯示 Express 後端伺服器與 React 前端應用程式
- 顯示使用者、訂單、訂單明細三個資料表
- 清楚標示主鍵與外鍵關係
- 顯示資料流程：註冊、登入、建立訂單、查詢訂單
- 另外補充一個「本地暫存層」表示前端 localStorage 的輔助資料來源
- 圖中不要包含任何不必要的 UI 元件，專注於資料庫與系統架構

請使用以下結構來描繪：
- 左側：React 前端
- 中間：Express API Server
- 中央：SQLite Database
- 右側：資料表與關聯
- 下方：資料流與操作流程

資料表定義如下：
- users(id, username, password)
- orders(id, user_id, date, total)
- order_items(id, order_id, product_id, name, quantity, price)

關聯關係如下：
- users.id -> orders.user_id
- orders.id -> order_items.order_id

請加上簡潔的標籤說明，例如：
- User Registration
- User Login
- Create Order
- View Order History
- Local Storage Fallback

請用現代化的架構圖風格，包含方框、箭頭、資料流標籤，並讓整張圖看起來像正式的系統設計圖，而不是程式碼片段。

---

## 3. 簡短版提示詞（如果你想要更精簡）

請生成一張獨立的資料庫系統架構圖，基於這個專案：React 前端呼叫 Express API，Express API 操作 SQLite 資料庫，資料庫包含 users、orders、order_items 三個資料表。users 與 orders 透過 user_id 建立一對多關係，orders 與 order_items 透過 order_id 建立一對多關係。請顯示註冊、登入、建立訂單、查詢訂單的流程，並補充前端 localStorage 作為輔助暫存層。圖要專注於資料庫與系統架構，不要畫成 UI 頁面。

---

## 4. 建議的繪圖風格

建議讓 nanobanana 生成時使用以下風格：
- 淺色背景
- 深藍或深綠色系主題
- 清楚的資料流箭頭
- 資料表以方塊呈現，欄位以內部文字列出
- 使用「資料庫核心」的中心構圖
- 避免過度花俏，保留工程文件風格

---

## 5. 如果你想要更精準的版本

如果你希望圖更接近「正式資料庫設計文件」，可以再加入這一句：

「請將圖繪製成企業級系統架構圖，包含資料表、主鍵、外鍵、資料流與應用層，並保持版面整齊、層次分明。」
