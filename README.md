# 🏦 Credit Risk Engine (AI-Powered)

> **Enterprise-grade Loan Approval System** powered by Machine Learning and Explainable AI.

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20CatBoost-blue)

## 📖 Overview

The **Credit Risk Engine** is a sophisticated financial application designed to automate loan decision-making. Unlike traditional rule-based systems, it combines **deterministic policy checks** with a **probabilistic ML model** to assess borrower risk accurately.

It doesn't just say "Approved" or "Rejected"—it explains **WHY** using SHAP (SHapley Additive exPlanations) values, giving transparency to both the bank and the applicant.

---

## 🚀 Key Features

- **⚡ Real-time Risk Scoring**: Instant credit decisions using a pre-trained CatBoost model.
- **🧠 Explainable AI (XAI)**: Visual breakdown of risk factors (e.g., "High Income (+)" vs "Low Age (-)").
- **📜 Hybrid Decision Engine**:
  - **Layer 1 (Policy)**: Hard rules (e.g., Credit Score < 650 = Auto Reject).
  - **Layer 2 (ML Model)**: Statistical probability of default for eligible applicants.
- **📂 Bank Statement Analysis**: Parses CSV statements to detect salary, bounces, and gambling behavior.
- **🔒 Secure Architecture**: JWT Authentication and Role-Based Access Control.

---

## 🛠️ Technical Architecture

### 1. Frontend (Client Layer)
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) (Fast, modern build tool).
- **Language**: TypeScript (Type safety for financial data).
- **UI Library**: [Chakra UI](https://chakra-ui.com/) (Accessible, dark-mode optimized components).
- **Visualization**: [Recharts](https://recharts.org/) (For rendering SHAP value charts).
- **Hosting**: **Vercel** (Edge network for low latency).

### 2. Backend (Server Layer)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance Python API).
- **ML Engine**: [CatBoost](https://catboost.ai/) (Gradient boosting on decision trees).
- **Data Processing**: [Pandas](https://pandas.pydata.org/) (For feature engineering and CSV parsing).
- **Hosting**: **Render** (Containerized deployment).

### 3. Database (Storage Layer)
- **System**: **PostgreSQL** (Managed by **Supabase**).
- **ORM**: SQLAlchemy (Python object-relational mapping).

---

## 🐳 Why Docker?

We use **Docker** to containerize the backend application. Here’s why:

1.  **Consistency**: "It works on my machine" is solved. The Docker container ensures the Python version, OS libraries (like `gcc`), and dependencies are identical in development and production.
2.  **Isolation**: The app runs in its own isolated environment, preventing conflicts with other services.
3.  **Scalability**: On platforms like Render, we can easily spin up multiple instances of the container to handle high traffic without configuring new servers manually.
4.  **Security**: Minimizes the attack surface by only installing necessary packages in the container.

### Docker Implementation
The application runs in a containerized environment on Render. This ensures:
- **Base Image**: Uses a lightweight Python environment.
- **Optimization**: Dependencies are cached for faster builds.
- **Execution**: Runs `uvicorn` as a production-grade ASGI server.

---

## 🌐 Hosting & Deployment

### Backend (Render)
The backend is deployed as a **Web Service** on Render.
- It connects to the GitHub repository.
- Automatically builds the Docker image from `backend/Dockerfile`.
- Exposes the API at `https://credit-risk-engine.onrender.com`.

### Frontend (Vercel)
The frontend is deployed on Vercel.
- Connects to GitHub.
- Auto-detects Vite config.
- Deploys to a global CDN.
- Proxies API requests to the Render backend.

### Database (Supabase)
- A managed PostgreSQL instance stores User profiles, Loan Applications, and Risk History.
- Connection is secured via SSL and environment variables.

---

## 🧪 How It Works (The Flow)

1.  **User Input**: Applicant enters details (Income, Age, Loan Amount) or uploads a Bank Statement.
2.  **Policy Check**: The `RuleEngine` checks hard constraints (e.g., "Is Loan > 10x Income?"). If failed -> **REJECTED**.
3.  **ML Prediction**: If Policy passes, the data is fed into the `CatBoostClassifier`.
    - The model calculates a **Probability of Default**.
    - This is converted to a **Risk Score** (0-100).
4.  **Explanation**: The `TreeExplainer` calculates **SHAP values** for each feature.
    - **Positive SHAP**: Increases risk (Red bar).
    - **Negative SHAP**: Decreases risk (Green bar).
5.  **Decision**:
    - Score > 70: **REJECTED_HIGH_RISK**.
    - Score <= 70: **APPROVED**.
6.  **Response**: The UI displays the status and the dynamic "Decision Rationale" chart.

---

## 👨‍💻 Local Development

### Prerequisites
- Node.js & npm
- Python 3.9+
- Docker (Optional)

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

*Built with ❤️ by the Credit Risk Team.*
