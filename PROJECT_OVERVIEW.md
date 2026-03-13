# Project Overview: Global Risk Intelligence (GRI)

Global Risk Intelligence (GRI) is like a "Command Center" for the world. It looks at news, analyzes what’s true, and predicts how conflicts (like wars or trade disputes) will affect the price of things we buy, like oil or bread.

---

## 🛠️ The "Tech Stack": What we used and WHY

We chose these specific tools because they are the "Gold Standard" in the industry. Here is a breakdown in plain English:

### 1. The "Face" (Frontend)
*   **React + Vite**
    *   **What it is**: The engine that runs the website.
    *   **Why we used it**: It makes the website feel like a fast mobile app. When you click something, it updates instantly without the whole page having to "refresh" or reload.
*   **TailwindCSS**
    *   **What it is**: Our styling tool.
    *   **Why we used it**: It allowed us to create a "Glassmorphism" look (that cool, see-through, futuristic glass effect) which makes the dashboard look premium and professional, like something a high-level government agent would use.
*   **Google Maps API**
    *   **What it is**: The interactive map on our home page.
    *   **Why we used it**: Everyone knows how to use Google Maps. By putting conflict markers directly on a map, users can *see* exactly where the risk is, rather than just reading a list of country names. It makes the data "real."

### 2. The "Brain" (Backend & AI)
*   **Node.js + Express**
    *   **What it is**: The traffic controller that connects the website to the data.
    *   **Why we used it**: It is incredibly fast at handling hundreds of requests at the same time. It ensures that when you ask a question, the answer comes back without a delay.
*   **MongoDB**
    *   **What it is**: Our digital filing cabinet (Database).
    *   **Why we used it**: Conflict news is messy. One day we might have a video, the next day just text. MongoDB is "flexible," meaning it doesn't break if the type of information we are saving changes.
*   **OpenAI GPT-4**
    *   **What it is**: The world's most advanced AI.
    *   **Why we used it**: It acts as our "Lead Analyst." It can read hundreds of news articles in seconds, find the contradictions, and write a summary. A human would take hours to do what this AI does in 5 seconds.

### 3. The "Crystal Ball" (Machine Learning)
*   **Python + FastAPI**
    *   **What it is**: A separate service dedicated to math and logic.
    *   **Why we used it**: Python is the language of scientists. By keeping our "Math" (Python) separate from our "Website" (Node.js), the system stays organized and powerful.
*   **Facebook Prophet**
    *   **What it is**: A forecasting tool created by Meta.
    *   **Why we used it**: It is like a weather forecast for money. It looks at the history of prices (like how oil prices moved in the past) and combines it with today's news to guess where prices will go next.

---

## 🛰️ The APIs: Our Data Sources

We don't just guess; we use real-world data from the biggest sources on earth:

1.  **Google & Bing Search APIs**
    *   **Why**: If you only look at one source, you might get a biased story. By looking at *both* Google and Bing, we get a wider view of the world’s news. It’s like getting a second opinion from another doctor.
2.  **NewsAPI**
    *   **Why**: This gives us "Breaking News" headlines from thousands of sources like the BBC, CNN, and Reuters. It ensures our dashboard is never out of date.
3.  **Geocoding API (Google)**
    *   **Why**: When a news article mentions "Kyiv," the computer doesn't naturally know where that is on a map. This API turns the word "Kyiv" into geographical coordinates (Latitude and Longitude) so we can place the marker accurately.

---

## 🏗️ How it all works together (The Simple Version)

Imagine you are a user asking: *"How will the Red Sea conflict affect my business?"*

1.  **The Fetcher**: The system quickly searches Google, Bing, and NewsAPI to find every article about the Red Sea.
2.  **The Judge**: Our AI (GPT-4) reads those articles. It ignores the "fake news" and finds the facts that everyone agrees on.
3.  **The Mathematician**: Our Python service looks at those facts and says: *"Usually, when there is trouble in the Red Sea, shipping prices go up by 15%."*
4.  **The Artist**: The website takes that 15% number and turns it into a beautiful chart and a red warning marker on the map for you to see.

**This process takes less than 10 seconds, giving you an "Intelligence Report" that would normally take a team of experts an entire day to research.**
