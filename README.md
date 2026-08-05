# 🏥 HealthShield AI - Medical Insurance Cost Predictor

Production-ready Flask web application that predicts annual medical insurance premiums using a pre-trained Scikit-Learn Pipeline (`model.pkl`).

---

## 📌 Project Overview
This application uses a machine learning model trained on medical insurance dataset features (`age`, `sex`, `bmi`, `children`, `smoker`, `region`) to estimate health insurance premiums. 

The backend receives inputs, constructs a pandas DataFrame with the exact feature names used during model training, passes it directly into `pipeline.predict()`, and formats the output into **Indian Rupees (INR - ₹)** alongside the original USD valuation.

---

## 📁 Directory Structure
```
Medical_Insurance_App/
│
├── app.py                  # Flask web backend application
├── model.pkl               # Trained Scikit-Learn Pipeline model file
├── requirements.txt        # Python dependency specifications for production
├── README.md               # Application documentation and guide
├── .gitignore              # Files and directories ignored by Git
│
├── templates/              # HTML Templates directory
│   └── index.html          # Main application page UI
│
└── static/                 # Static assets directory
    ├── style.css           # Custom Glassmorphic CSS stylesheet
    ├── script.js           # Client-side input validation and AJAX logic
    └── images/             # Image directory (if needed)
```

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
- **Python 3.9+** installed on your system.

### 1. Clone / Navigate to Project Directory
```bash
cd Medical_Insurance_App
```

### 2. Create and Activate Virtual Environment (Recommended)
- **Windows**:
  ```bash
  python -m venv venv
  .\venv\Scripts\activate
  ```
- **macOS / Linux**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### 3. Install Required Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Flask Web Application
```bash
python app.py
```
After starting, open your browser and go to: **`http://127.0.0.1:5000`**

---

## 🧪 Testing the Web Application

1. Open **`http://127.0.0.1:5000`** in your web browser.
2. Enter sample policyholder metrics:
   - **Age**: `32`
   - **Gender**: `Male`
   - **BMI**: `28.5`
   - **Children**: `1`
   - **Smoker**: `No`
   - **Region**: `Southeast`
3. Click **Predict Insurance Cost**.
4. The system will display the estimated insurance premium formatted in **Indian Rupees (INR)** with cost classification tier.

---

## 🚀 How to Deploy on Render (Step-by-Step)

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Medical Insurance App"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/Medical_Insurance_App.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Log into [Render.com](https://render.com/).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository (`Medical_Insurance_App`).
   - Configure Web Service settings:
     - **Name**: `medical-insurance-predictor`
     - **Environment**: `Python 3`
     - **Region**: Select closest region
     - **Branch**: `main`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app`
   - Click **Create Web Service**.
   - Render will build and host your app live!

---

## ❓ Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `ModuleNotFoundError: No module named 'flask'` | Dependencies not installed in active environment | Run `pip install -r requirements.txt` in active environment |
| `FileNotFoundError: model.pkl not found` | `model.pkl` is missing in root folder | Ensure `model.pkl` is in the same folder as `app.py` |
| `InconsistentVersionWarning` | Different scikit-learn version between training and running | Warning is suppressed in `app.py`, but matching versions in `requirements.txt` fixes it |
| `ValueError: All fields are required` | User submitted blank input fields | Fill in all form inputs before clicking Predict |
