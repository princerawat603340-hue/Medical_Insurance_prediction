"""
Medical Insurance Cost Prediction Web Application
Flask Backend Implementation
"""

import os
import pickle
import warnings
from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np

# Suppress version warnings for scikit-learn unpickling if present
warnings.filterwarnings('ignore', category=UserWarning)

app = Flask(__name__)

# Define exact feature names expected by the trained pipeline
FEATURE_NAMES = ['age', 'sex', 'bmi', 'children', 'smoker', 'region']

# Define valid categorical choices
VALID_CATEGORIES = {
    'sex': ['male', 'female'],
    'smoker': ['yes', 'no'],
    'region': ['southeast', 'southwest', 'northeast', 'northwest']
}

# Standard USD to INR conversion rate (1 USD = ~83.50 INR)
USD_TO_INR_RATE = 83.50

# Load trained pipeline model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = None

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully from model.pkl")
except Exception as e:
    print(f"❌ Error loading model from {MODEL_PATH}: {str(e)}")


def format_indian_currency(amount):
    """
    Format a floating-point number into Indian Rupee (INR) format.
    Example: 1234567.89 -> ₹12,34,567.89
    """
    if amount < 0:
        amount = 0.0
    
    s = f"{amount:.2f}"
    parts = s.split('.')
    integer_part = parts[0]
    decimal_part = parts[1]

    if len(integer_part) <= 3:
        formatted_int = integer_part
    else:
        last_three = integer_part[-3:]
        remaining = integer_part[:-3]
        groups = []
        while len(remaining) > 2:
            groups.append(remaining[-2:])
            remaining = remaining[:-2]
        if remaining:
            groups.append(remaining)
        groups.reverse()
        formatted_int = ','.join(groups) + ',' + last_three

    return f"₹{formatted_int}.{decimal_part}"


@app.route('/')
def home():
    """
    Render the main landing page containing the input form.
    """
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle insurance cost prediction requests via form submission or JSON API.
    """
    if model is None:
        error_msg = "Model is not loaded. Please ensure model.pkl exists."
        if request.is_json:
            return jsonify({'success': False, 'error': error_msg}), 500
        return render_template('index.html', error=error_msg)

    try:
        # Extract inputs depending on Content-Type (JSON vs Form Data)
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        # Extract values
        age_str = data.get('age')
        sex = str(data.get('sex', '')).strip().lower()
        bmi_str = data.get('bmi')
        children_str = data.get('children')
        smoker = str(data.get('smoker', '')).strip().lower()
        region = str(data.get('region', '')).strip().lower()

        # Validate presence of inputs
        if not all([age_str, sex, bmi_str, children_str, smoker, region]):
            raise ValueError("All fields are required. Please fill out all inputs.")

        # Type conversion and numerical validation
        try:
            age = int(age_str)
        except ValueError:
            raise ValueError("Age must be a valid integer.")

        try:
            bmi = float(bmi_str)
        except ValueError:
            raise ValueError("BMI must be a valid number.")

        try:
            children = int(children_str)
        except ValueError:
            raise ValueError("Number of children must be a valid integer.")

        # Range checks
        if age < 18 or age > 100:
            raise ValueError("Age must be between 18 and 100 years.")

        if bmi < 10.0 or bmi > 60.0:
            raise ValueError("BMI must be between 10.0 and 60.0.")

        if children < 0 or children > 10:
            raise ValueError("Number of children must be between 0 and 10.")

        # Categorical validation
        if sex not in VALID_CATEGORIES['sex']:
            raise ValueError("Invalid value for sex. Must be 'male' or 'female'.")

        if smoker not in VALID_CATEGORIES['smoker']:
            raise ValueError("Invalid value for smoker. Must be 'yes' or 'no'.")

        if region not in VALID_CATEGORIES['region']:
            raise ValueError("Invalid region selected.")

        # Construct single-row DataFrame using exact feature names from training
        input_data = pd.DataFrame([{
            'age': age,
            'sex': sex,
            'bmi': bmi,
            'children': children,
            'smoker': smoker,
            'region': region
        }], columns=FEATURE_NAMES)

        # Predict using pipeline.predict() directly
        prediction_usd = float(model.predict(input_data)[0])

        # Ensure positive prediction
        if prediction_usd < 0:
            prediction_usd = 0.0

        # Convert prediction to INR
        prediction_inr = prediction_usd * USD_TO_INR_RATE
        formatted_inr = format_indian_currency(prediction_inr)
        formatted_usd = f"${prediction_usd:,.2f}"

        # Risk level determination based on cost threshold
        if prediction_usd < 5000:
            cost_category = "Low Cost Tier"
            risk_badge = "success"
        elif prediction_usd < 15000:
            cost_category = "Moderate Cost Tier"
            risk_badge = "warning"
        else:
            cost_category = "High Cost Tier"
            risk_badge = "danger"

        # Prepared response payload
        result = {
            'success': True,
            'prediction_inr': formatted_inr,
            'prediction_usd': formatted_usd,
            'raw_inr': round(prediction_inr, 2),
            'raw_usd': round(prediction_usd, 2),
            'cost_category': cost_category,
            'risk_badge': risk_badge,
            'inputs': {
                'age': age,
                'sex': sex.capitalize(),
                'bmi': bmi,
                'children': children,
                'smoker': smoker.capitalize(),
                'region': region.capitalize()
            }
        }

        if request.is_json:
            return jsonify(result)
        
        return render_template('index.html', result=result)

    except ValueError as val_err:
        error_msg = str(val_err)
        if request.is_json:
            return jsonify({'success': False, 'error': error_msg}), 400
        return render_template('index.html', error=error_msg)

    except Exception as e:
        error_msg = f"An unexpected error occurred: {str(e)}"
        if request.is_json:
            return jsonify({'success': False, 'error': error_msg}), 500
        return render_template('index.html', error=error_msg)


@app.route('/health')
def health():
    """
    Health check endpoint for cloud hosting services like Render.
    """
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })


if __name__ == '__main__':
    # Run development server
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
