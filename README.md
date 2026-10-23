# 🏥 Medical Insurance Cost Prediction App

![Python](https://img.shields.io/badge/Python-3.x-blue)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Regression-orange)
![Flask](https://img.shields.io/badge/Backend-Flask-black)
![License](https://img.shields.io/badge/License-MIT-green)

A **Machine Learning powered web application** that predicts medical insurance charges based on user information such as age, BMI, gender, smoking status, number of children, and region.

The application uses a trained regression model integrated with Flask to provide real-time insurance cost predictions through an interactive web interface.

---

## 🚀 Features

* 🔹 Predicts medical insurance charges using Machine Learning
* 🔹 Interactive and user-friendly web interface
* 🔹 Real-time predictions using Flask backend
* 🔹 Automated preprocessing pipeline
* 🔹 Trained ML model deployment
* 🔹 Fast and lightweight application

---

# 🛠️ Tech Stack

## Machine Learning

* Python
* NumPy
* Pandas
* Scikit-learn
* Regression Algorithms

## Backend

* Flask

## Frontend

* HTML
* CSS
* JavaScript

## Tools

* Git
* GitHub
* VS Code

---

# 📂 Project Structure

```
Medical_Insurance_prediction/
│
├── app.py                    # Flask backend application
├── model.pkl                 # Trained machine learning model
├── requirements.txt          # Python dependencies
├── Procfile                  # Deployment configuration
│
├── templates/
│   └── index.html            # Web interface
│
└── static/
    ├── style.css             # CSS styling
    └── script.js             # JavaScript functionality
```

---

# ⚙️ Installation & Running Locally

### Clone Repository

```bash
git clone https://github.com/princerawat603340-hue/Medical_Insurance_prediction.git
```

### Navigate to Project Folder

```bash
cd Medical_Insurance_prediction
```

### Create Virtual Environment

```bash
python -m venv venv
```

Activate environment:

**Windows**

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Open your browser:

```
http://127.0.0.1:5000/
```

---

# 🧠 Machine Learning Workflow

The project follows a complete ML workflow:

1. Data Collection
2. Data Cleaning
3. Exploratory Data Analysis (EDA)
4. Feature Engineering
5. Data Encoding
6. Feature Scaling
7. Model Training
8. Model Evaluation
9. Deployment using Flask

---

# 📊 Model Information

**Problem Type:** Regression

**Target Variable:** Medical Insurance Charges

**Input Features:**

* Age
* Gender
* BMI
* Number of Children
* Smoking Status
* Region

**Evaluation Metrics:**

* R² Score
* Mean Absolute Error (MAE)

The trained model is serialized using pickle and integrated with Flask for real-time prediction.

---

# 📈 Model Performance

| Metric   | Score          |
| -------- | -------------- |
| R² Score | 0.8 |
| MAE      | Add your value |

---

# 🔮 Future Improvements

* Deploy application on cloud platform
* Improve frontend UI/UX
* Add user authentication
* Store prediction history
* Compare multiple ML algorithms
* Add model monitoring

---

# 🌐 Live Demo

https://medical-insurance-prediction-a180.onrender.com/

---

# 👨‍💻 Author

**Prince Rawat**

Machine Learning Enthusiast

GitHub:
https://github.com/princerawat603340-hue

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
