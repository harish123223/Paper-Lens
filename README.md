# PaperLens — AI Past Paper Analyzer

> 🎓 Upload your past exam PDFs and get instant AI-powered analysis: topic frequencies, year-wise trends, coverage gaps, a personalized study plan, and practice questions — all powered by Groq (Free, No Credit Card).

---

## 📺 Video

<!-- Add your demo video link here -->
> [**[Video-Link]**](https://youtu.be/UWrrrCvHjZ8?si=yTZy6ZkKURMA9k8R)

---

## 🗂 Project Structure

```
AI Powered Past Paper Analyser/
├── backend/
│   ├── app.py               # Flask API (Groq + Llama 3 powered)
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Your API key (create from .env.example)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── UploadPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── LoadingScreen.jsx
    │   │   ├── TopicsChart.jsx
    │   │   ├── ImportancePieChart.jsx
    │   │   ├── TopicsTable.jsx
    │   │   ├── YearwiseTrends.jsx
    │   │   ├── StudyPlanner.jsx
    │   │   ├── PracticeQuestions.jsx
    │   │   └── CoverageGaps.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- A **free** Groq API key — no credit card needed

---

### 🔑 How to Get Your Free Groq API Key

1. Go to **https://console.groq.com**
2. Sign up with your **Google or GitHub account** (free)
3. Click **"API Keys"** in the left sidebar
4. Click **"Create API Key"** and copy it
5. It looks like: `gsk_...`

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env          # Windows
# cp .env.example .env          # Mac/Linux

# Open .env and paste your Groq API key
```

**`.env` file should look like this:**
```
GROQ_API_KEY=gsk_your_key_here
```

**Start Flask:**
```bash
python app.py
# Flask will start on http://localhost:5000
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# React will start on http://localhost:5173
```

---

### 3. Open the App

Visit http://paper-lens-iair.vercel.app/ in your browser.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📤 Upload | Drag & drop multiple PDFs or click to browse |
| 🧠 AI Analysis | Groq + Llama 3 reads all papers and extracts insights |
| 📊 Topic Chart | Bar chart of topic frequencies |
| 🍕 Pie Chart | High / Medium / Low importance distribution |
| 📋 Topics Table | Sortable table with scores and badges |
| 📅 Year Trends | Bar chart + table of year-wise dominant topics |
| 📆 Study Planner | Day-by-day schedule prioritizing key topics |
| ❓ Practice Q's | Accordion of AI-generated practice questions |
| ⚠️ Coverage Gaps | Topics missing from your papers |

---

## 🛠 Tech Stack

**Backend:** Python · Flask · pdfplumber · Groq API · Llama 3 (Free)
**Frontend:** React 18 · Vite · Tailwind CSS · Recharts · Lucide React

---

## 📝 Notes

- Only PDF files are accepted
- Larger PDFs take longer to process
- If papers don't have year info, the AI labels them "Paper 1", "Paper 2", etc.
- The syllabus field is optional but improves gap detection
- Groq free tier: very generous daily limits, no credit card required
