from fastapi import FastAPI
from pydantic import BaseModel
import pickle, json
import pandas as pd

app = FastAPI()

# Diabetes
with open("Preprocessing Files/ML-Project-2-Diabetes_Prediction_Pre_Processing_Files/columns.pkl", 'rb') as f:
    all_features_diabetes_disease = pickle.load(f)
with open("Preprocessing Files/ML-Project-2-Diabetes_Prediction_Pre_Processing_Files/scaler.pkl", 'rb') as f:
    scalers_diabetes_disease = pickle.load(f)
with open("Best Features/ML-Project-2-Diabetes_Prediction_Best_Features/best_features_svc.json") as f:
    best_features_svc_diabetes_disease = json.load(f)
with open("Best Features/ML-Project-2-Diabetes_Prediction_Best_Features/best_features_lr.json") as f:
    best_features_lr_diabetes_disease = json.load(f)
with open("Best Features/ML-Project-2-Diabetes_Prediction_Best_Features/best_features_rfc.json") as f:
    best_features_rfc_diabetes_disease = json.load(f)
with open("Models/ML-Project-2-Diabetes_Prediction_Models/diabetes_disease_trained_svc_model.sav", 'rb') as f:
    loaded_model_svc_diabetes_disease = pickle.load(f)
with open("Models/ML-Project-2-Diabetes_Prediction_Models/diabetes_disease_trained_lr_model.sav", 'rb') as f:
    loaded_model_lr_diabetes_disease = pickle.load(f)
with open("Models/ML-Project-2-Diabetes_Prediction_Models/diabetes_disease_trained_rfc_model.sav", 'rb') as f:
    loaded_model_rfc_diabetes_disease = pickle.load(f)

# Heart Disease
with open("Preprocessing Files/ML-Project-9-Heart_Disease_Prediction_Pre_Processing_Files/columns.pkl", 'rb') as f:
    all_columns_heart_disease = pickle.load(f)
with open("Preprocessing Files/ML-Project-9-Heart_Disease_Prediction_Pre_Processing_Files/cat_columns.pkl", 'rb') as f:
    cat_columns_heart_disease = pickle.load(f)
with open("Preprocessing Files/ML-Project-9-Heart_Disease_Prediction_Pre_Processing_Files/encoder.pkl", 'rb') as f:
    encoder_heart_disease = pickle.load(f)
with open("Preprocessing Files/ML-Project-9-Heart_Disease_Prediction_Pre_Processing_Files/encoded_columns.pkl", 'rb') as f:
    encoded_columns_heart_disease = pickle.load(f)
with open("Preprocessing Files/ML-Project-9-Heart_Disease_Prediction_Pre_Processing_Files/training_columns.pkl", 'rb') as f:
    training_columns_heart_disease = pickle.load(f)
with open("Preprocessing Files/ML-Project-9-Heart_Disease_Prediction_Pre_Processing_Files/scaler.pkl", 'rb') as f:
    scaler_heart_disease = pickle.load(f)
with open("Best Features/ML-Project-9-Heart_Disease_Prediction_Best_Features/best_features_xgb.json") as f:
    best_features_xgb_heart_disease = json.load(f)
with open("Best Features/ML-Project-9-Heart_Disease_Prediction_Best_Features/best_features_rfc.json") as f:
    best_features_rfc_heart_disease = json.load(f)
with open("Best Features/ML-Project-9-Heart_Disease_Prediction_Best_Features/best_features_lr.json") as f:
    best_features_lr_heart_disease = json.load(f)
with open("Models/ML-Project-9-Heart_Disease_Prediction_Models/heart_disease_trained_xgb_model.sav", 'rb') as f:
    loaded_model_xgb_heart_disease = pickle.load(f)
with open("Models/ML-Project-9-Heart_Disease_Prediction_Models/heart_disease_trained_rfc_model.sav", 'rb') as f:
    loaded_model_rfc_heart_disease = pickle.load(f)
with open("Models/ML-Project-9-Heart_Disease_Prediction_Models/heart_disease_trained_lr_model.sav", 'rb') as f:
    loaded_model_lr_heart_disease = pickle.load(f)

# Parkinson
with open("Preprocessing Files/ML-Project-14-Parkinson's_Disease_Prediction_Pre_Processing_Files/columns.pkl", 'rb') as f:
    all_features_parkinson_disease = pickle.load(f)
with open("Preprocessing Files/ML-Project-14-Parkinson's_Disease_Prediction_Pre_Processing_Files/scaler.pkl", 'rb') as f:
    scalers_parkinson_disease = pickle.load(f)
with open("Best Features/ML-Project-14-Parkinson's_Disease_Prediction_Best_Features/best_features_knn.json") as f:
    best_features_knn_parkinson_disease = json.load(f)
with open("Best Features/ML-Project-14-Parkinson's_Disease_Prediction_Best_Features/best_features_xgb.json") as f:
    best_features_xgb_parkinson_disease = json.load(f)
with open("Best Features/ML-Project-14-Parkinson's_Disease_Prediction_Best_Features/best_features_rfc.json") as f:
    best_features_rfc_parkinson_disease = json.load(f)
with open("Models/ML-Project-14-Parkinson's_Disease_Prediction_Models/parkinsons_disease_trained_knn_model.sav", 'rb') as f:
    loaded_model_knn_parkinson_disease = pickle.load(f)
with open("Models/ML-Project-14-Parkinson's_Disease_Prediction_Models/parkinsons_disease_trained_xgb_model.sav", 'rb') as f:
    loaded_model_xgb_parkinson_disease = pickle.load(f)
with open("Models/ML-Project-14-Parkinson's_Disease_Prediction_Models/parkinsons_disease_trained_rfc_model.sav", 'rb') as f:
    loaded_model_rfc_parkinson_disease = pickle.load(f)

# Breast Cancer
with open("Preprocessing Files/ML-Project-19-Breast_Cancer_Classification_Pre_Processing_Files/columns.pkl", 'rb') as f:
    all_features_breast_cancer = pickle.load(f)
with open("Preprocessing Files/ML-Project-19-Breast_Cancer_Classification_Pre_Processing_Files/scaler.pkl", 'rb') as f:
    scalers_breast_cancer = pickle.load(f)
with open("Best Features/ML-Project-19-Breast_Cancer_Classification_Best_Features/best_features_lr.json") as f:
    best_features_lr_breast_cancer = json.load(f)
with open("Best Features/ML-Project-19-Breast_Cancer_Classification_Best_Features/best_features_xgb.json") as f:
    best_features_xgb_breast_cancer = json.load(f)
with open("Best Features/ML-Project-19-Breast_Cancer_Classification_Best_Features/best_features_knn.json") as f:
    best_features_knn_breast_cancer = json.load(f)
with open("Models/ML-Project-19-Breast_Cancer_Classification_Models/parkinsons_disease_trained_lr_model.sav", 'rb') as f:
    loaded_model_lr_breast_cancer = pickle.load(f)
with open("Models/ML-Project-19-Breast_Cancer_Classification_Models/parkinsons_disease_trained_xgb_model.sav", 'rb') as f:
    loaded_model_xgb_breast_cancer = pickle.load(f)
with open("Models/ML-Project-19-Breast_Cancer_Classification_Models/parkinsons_disease_trained_knn_model.sav", 'rb') as f:
    loaded_model_knn_breast_cancer = pickle.load(f)


class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

class HeartInput(BaseModel):
    age: float
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

class ParkinsonInput(BaseModel):
    features: list[float]

class CancerInput(BaseModel):
    features: list[float]


@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    df = pd.DataFrame([data.dict()], columns=all_features_diabetes_disease)
    df[all_features_diabetes_disease] = scalers_diabetes_disease.transform(df)
    return {
        "SVC": "Diabetic" if loaded_model_svc_diabetes_disease.predict(df[best_features_svc_diabetes_disease])[0] else "Not Diabetic",
        "LR": "Diabetic" if loaded_model_lr_diabetes_disease.predict(df[best_features_lr_diabetes_disease])[0] else "Not Diabetic",
        "RFC": "Diabetic" if loaded_model_rfc_diabetes_disease.predict(df[best_features_rfc_diabetes_disease])[0] else "Not Diabetic"
    }

@app.post("/predict/heart")
def predict_heart(data: HeartInput):
    df = pd.DataFrame([data.dict()], columns=all_columns_heart_disease)
    df[cat_columns_heart_disease] = df[cat_columns_heart_disease].astype('str')
    encoded = encoder_heart_disease.transform(df[cat_columns_heart_disease])
    df_encoded = pd.concat([df.drop(columns=cat_columns_heart_disease).reset_index(drop=True),
                            pd.DataFrame(encoded, columns=encoded_columns_heart_disease)], axis=1)
    df_scaled = scaler_heart_disease.transform(df_encoded)
    df_final = pd.DataFrame(df_scaled, columns=training_columns_heart_disease)
    return {
        "XGB": "Heart Disease" if loaded_model_xgb_heart_disease.predict(df_final[best_features_xgb_heart_disease])[0] else "No Heart Disease",
        "RFC": "Heart Disease" if loaded_model_rfc_heart_disease.predict(df_final[best_features_rfc_heart_disease])[0] else "No Heart Disease",
        "LR": "Heart Disease" if loaded_model_lr_heart_disease.predict(df_final[best_features_lr_heart_disease])[0] else "No Heart Disease"
    }

@app.post("/predict/parkinson")
def predict_parkinson(data: ParkinsonInput):
    df = pd.DataFrame([data.features], columns=all_features_parkinson_disease)
    df[all_features_parkinson_disease] = scalers_parkinson_disease.transform(df)
    return {
        "KNN": "Parkinson" if loaded_model_knn_parkinson_disease.predict(df[best_features_knn_parkinson_disease])[0] else "No Parkinson",
        "XGB": "Parkinson" if loaded_model_xgb_parkinson_disease.predict(df[best_features_xgb_parkinson_disease])[0] else "No Parkinson",
        "RFC": "Parkinson" if loaded_model_rfc_parkinson_disease.predict(df[best_features_rfc_parkinson_disease])[0] else "No Parkinson"
    }

@app.post("/predict/cancer")
def predict_cancer(data: CancerInput):
    df = pd.DataFrame([data.features], columns=all_features_breast_cancer)
    df[all_features_breast_cancer] = scalers_breast_cancer.transform(df)
    return {
        "LR": "Benign" if loaded_model_lr_breast_cancer.predict(df[best_features_lr_breast_cancer])[0] else "Malignant",
        "XGB": "Benign" if loaded_model_xgb_breast_cancer.predict(df[best_features_xgb_breast_cancer])[0] else "Malignant",
        "KNN": "Benign" if loaded_model_knn_breast_cancer.predict(df[best_features_knn_breast_cancer])[0] else "Malignant"
    }


@app.get("/")
def home():
    return {"message": "Welcome to the Multi-Disease Prediction API"}