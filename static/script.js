/**
 * Medical Insurance Cost Predictor - Front-End Logic
 * Form Validation, AJAX Request Handling, UI State Management
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const form = document.getElementById('prediction-form');
    const ageInput = document.getElementById('age');
    const sexInput = document.getElementById('sex');
    const bmiInput = document.getElementById('bmi');
    const childrenInput = document.getElementById('children');
    const smokerInput = document.getElementById('smoker');
    const regionInput = document.getElementById('region');

    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultSection = document.getElementById('result-section');
    
    const costBadge = document.getElementById('cost-badge');
    const inrDisplay = document.getElementById('inr-display');
    const usdDisplay = document.getElementById('usd-display');

    const sumAge = document.getElementById('sum-age');
    const sumSex = document.getElementById('sum-sex');
    const sumBmi = document.getElementById('sum-bmi');
    const sumChildren = document.getElementById('sum-children');
    const sumSmoker = document.getElementById('sum-smoker');
    const sumRegion = document.getElementById('sum-region');

    const clientErrorAlert = document.getElementById('client-error-alert');
    const clientErrorMessage = document.getElementById('client-error-message');

    // Input Validation Rules Config
    const VALIDATION_RULES = {
        age: {
            min: 18,
            max: 100,
            requiredMsg: 'Age is required.',
            rangeMsg: 'Age must be between 18 and 100 years.'
        },
        bmi: {
            min: 10.0,
            max: 60.0,
            requiredMsg: 'BMI is required.',
            rangeMsg: 'BMI must be between 10.0 and 60.0 kg/m².'
        },
        children: {
            min: 0,
            max: 10,
            requiredMsg: 'Number of children is required.',
            rangeMsg: 'Children must be between 0 and 10.'
        },
        sex: {
            requiredMsg: 'Please select a gender.'
        },
        smoker: {
            requiredMsg: 'Please select smoking status.'
        },
        region: {
            requiredMsg: 'Please select a residential region.'
        }
    };

    /**
     * Validate a single input field
     */
    function validateField(inputElement) {
        const name = inputElement.name;
        const value = inputElement.value.trim();
        const errorElement = document.getElementById(`${name}-error`);
        const rules = VALIDATION_RULES[name];

        if (!rules) return true;

        // Check required
        if (!value) {
            showFieldError(inputElement, errorElement, rules.requiredMsg);
            return false;
        }

        // Check numeric bounds
        if (['age', 'bmi', 'children'].includes(name)) {
            const numVal = parseFloat(value);
            if (isNaN(numVal) || numVal < rules.min || numVal > rules.max) {
                showFieldError(inputElement, errorElement, rules.rangeMsg);
                return false;
            }
        }

        // Clear error if valid
        clearFieldError(inputElement, errorElement);
        return true;
    }

    function showFieldError(inputElement, errorElement, message) {
        inputElement.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(inputElement, errorElement) {
        inputElement.classList.remove('invalid');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function showClientError(message) {
        if (clientErrorMessage && clientErrorAlert) {
            clientErrorMessage.textContent = message;
            clientErrorAlert.classList.remove('hidden');
        }
    }

    window.hideClientError = function() {
        if (clientErrorAlert) {
            clientErrorAlert.classList.add('hidden');
        }
    };

    // Attach Live Validation Listeners
    [ageInput, sexInput, bmiInput, childrenInput, smokerInput, regionInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('change', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        }
    });

    /**
     * Form Reset Handler
     */
    resetBtn.addEventListener('click', () => {
        form.reset();
        [ageInput, sexInput, bmiInput, childrenInput, smokerInput, regionInput].forEach(input => {
            if (input) {
                clearFieldError(input, document.getElementById(`${input.name}-error`));
            }
        });
        hideClientError();
        if (resultSection) {
            resultSection.classList.add('hidden');
        }
    });

    /**
     * Form Submission Handler via AJAX
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideClientError();

        // Validate all fields
        let isValid = true;
        [ageInput, sexInput, bmiInput, childrenInput, smokerInput, regionInput].forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showClientError('Please fix the errors in the form before submitting.');
            return;
        }

        // Show loading indicator
        loadingSpinner.classList.remove('hidden');
        submitBtn.disabled = true;

        // Prepare JSON payload
        const payload = {
            age: ageInput.value.trim(),
            sex: sexInput.value.trim(),
            bmi: bmiInput.value.trim(),
            children: childrenInput.value.trim(),
            smoker: smokerInput.value.trim(),
            region: regionInput.value.trim()
        };

        try {
            // Artificial slight delay (600ms) for pleasant animation feedback
            await new Promise(r => setTimeout(r, 600));

            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                // Update Prediction Result Display
                inrDisplay.textContent = data.prediction_inr;
                usdDisplay.textContent = `Original USD: ${data.prediction_usd}`;
                
                // Update Badge Class
                costBadge.textContent = data.cost_category;
                costBadge.className = `badge ${data.risk_badge}`;

                // Update Summary Grid
                sumAge.textContent = `${data.inputs.age} Yrs`;
                sumSex.textContent = data.inputs.sex;
                sumBmi.textContent = `${data.inputs.bmi} kg/m²`;
                sumChildren.textContent = `${data.inputs.children} child(ren)`;
                sumSmoker.textContent = data.inputs.smoker;
                sumRegion.textContent = data.inputs.region;

                // Display Result Card
                resultSection.classList.remove('hidden');

                // Smooth Scroll to Result Card
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } else {
                showClientError(data.error || 'An error occurred during prediction.');
            }

        } catch (error) {
            showClientError('Failed to connect to the server. Please try again.');
            console.error('Prediction Error:', error);
        } finally {
            // Hide loading indicator & re-enable button
            loadingSpinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    /**
     * Scroll Back to Form Utility
     */
    window.scrollToForm = function() {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
});
