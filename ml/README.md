# Multiple Disease Models

1. Diabetes Prediction model

2. Heart Disease Prediction model

3. Parkinson Disease Prediction model

4. Breast Cancer Prediction model




# Dataset Description
1. Diabetes Prediction Model

Description: This dataset contains 768 instances of patient data, with 8 features including glucose levels, blood pressure, and insulin levels, used to predict diabetes.

2. Heart Disease Prediction Model

Description: This dataset includes 1025 instances with 14 features such as age, sex, chest pain type, and resting blood pressure, used to predict the presence of heart disease.

3. Parkinson Disease Prediction Model

Description: This dataset has 195 instances with 22 features including average vocal fundamental frequency, measures of variation in fundamental frequency, and measures of variation in amplitude, used to predict Parkinson's disease.

4. Breast Cancer Prediction Model

Description: This dataset contains 569 instances with 30 features such as radius, texture, perimeter, and area, used to predict breast cancer.


# Technologies Used
Programming Language: Python

Machine Learning Libraries: Scikit-learn, XGBoost

Data Analysis and Visualization: Pandas, NumPy, Matplotlib, Seaborn


# Model Development Process
Each disease prediction model was developed through the following steps:

1. Importing the Dependencies

2. Exploratory Data Analysis (EDA)

3. Data Preprocessing
   * Handling missing values
   * Handling outliers
   * Label encoding/One-hot encoding
   * Standardizing the data

4. Model Selection
   * Selected the most common 5 classification models
   * Trained each model and checked cross-validation scores
   * Chose the top 3 models based on cross-validation scores

5. Model Building and Evaluation
   * Selected best features using Recursive Feature Elimination (RFE)
   * Performed hyperparameter tuning using Grid Search CV
   * Built the final model with the best hyperparameters and features
   * Evaluated the model using classification reports


# Models Used
The top 3 models for each disease prediction model are as follows:

1. Diabetes Prediction Model
- Support Vector Classifier: Effective in high-dimensional spaces.
- Logistic Regression: Simple and effective binary classification model.
- Random Forest Classifier: Ensemble method that reduces overfitting.

2. Heart Disease Prediction Model
- XGBoost: Boosting algorithm known for high performance.
- Random Forest Classifier: Robust and handles missing values well.
- Logistic Regression: Interpretable and performs well with binary classification.

3. Parkinson Disease Prediction Model
- K-Nearest Neighbour: Simple algorithm that works well with small datasets.
- XGBoost: Powerful gradient boosting framework.
- Random Forest Classifier: Effective and reduces overfitting.

4. Breast Cancer Prediction Model
- Logistic Regression: Highly interpretable and performs well with binary classification.
- XGBoost: Excellent performance with complex datasets.
- K-Nearest Neighbour: Effective with smaller datasets and straightforward implementation.


# Model Evaluation

1. Diabetes Prediction Model
Model	Accuracy
- Support Vector Classifier	69.480%
- Logistic Regression	70.129%
- Random Forest Classifier	75.324%

2. Heart Disease Prediction Model
Model	Accuracy
- XGBoost	100%
- Random Forest Classifier	100%
- Logistic Regression	88.311%

3. Parkinson Disease Prediction Model
Model	Accuracy
- K-Nearest Neighbour	100%
- XGBoost	92.307%
- Random Forest Classifier	94.871%

4. Breast Cancer Prediction Model
Model	Accuracy
- Logistic Regression	97.368%
- XGBoost	97.368%
- K-Nearest Neighbour	96.491%

