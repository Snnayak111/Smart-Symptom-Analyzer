import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { ProfileContext } from '../context/ProfileContext'

const Form = ({ disease }) => {
  const [formData, setFormData] = useState({})
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const {profile} = useContext(ProfileContext)
  const BackendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000'
  // Object containing input fields for each disease
  console.log(profile)
  const diseaseInputs = {
    Diabetes: [
      {
        name: 'Number of Pregnancies',
        value: 0,
        type: 'number',
        precision: 0,
        title: 'Pregnancies',
      },
      {
        name: 'Glucose Level',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'Glucose',
      },
      {
        name: 'BloodPressure volume',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'BloodPressure',
      },
      {
        name: 'SkinThickness value',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'SkinThickness',
      },
      {
        name: 'Insulin level',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'Insulin',
      },
      {
        name: 'BMI value',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'BMI',
      },
      {
        name: 'DiabetesPedigreeFunction value',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'DiabetesPedigreeFunction',
      },
      {
        name: 'Age of the person',
        value: 0,
        type: 'number',
        precision: 0,
        title: 'Age',
      },
    ],
    'Heart Disease': [
      {
        name: 'Age in years',
        value: 0,
        type: 'number',
        precision: 0,
        title: 'age',
      },
      {
        name: 'Resting Blood Pressure (in mm Hg)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'trestbps',
      },
      {
        name: 'Resting ECG Results',
        value: 0,
        type: 'number',
        precision: 0,
        title: 'restecg',
      },
      {
        name: 'Oldpeak (ST depression induced by exercise relative to rest)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'oldpeak',
      },
      {
        name: 'Thal',
        value: 0,
        type: 'select',
        options: ['None', 'Normal', 'Fixed Defect', 'Reversible Defect'],
        title: 'thal',
      },
      {
        name: 'Gender',
        value: 0,
        type: 'select',
        options: ['Male', 'Female'],
        title: 'sex',
      },
      {
        name: 'Serum Cholestoral in mg/dl',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'chol',
      },
      {
        name: 'Maximum Heart Rate Achieved',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'thalach',
      },
      {
        name: 'Number of Major Vessels (0-3) colored by fluoroscopy',
        value: 0,
        type: 'number',
        precision: 0,
        title: 'ca',
      },
      {
        name: 'The slope of the peak exercise ST segment',
        value: 0,
        type: 'number',
        precision: 0,
        title: 'slope',
      },
      {
        name: 'Chest Pain type',
        value: 0,
        type: 'number',
        precision: 0,
        title: 'cp',
      },
      {
        name: 'Fasting Blood Sugar',
        value: 0,
        type: 'select',
        options: ['True', 'False'],
        title: 'fbs',
      },
      {
        name: 'Exercise Induced Angina',
        value: 0,
        type: 'select',
        options: ['Yes', 'No'],
        title: 'exang',
      },
    ],
    "Parkinson's Disease": [
      // Order follows specific sequence required by the model
      {
        name: 'MDVP_Fo(Hz)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_Fo',
      },
      {
        name: 'MDVP_Fhi(Hz)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_Fhi',
      },
      {
        name: 'MDVP_Flo(Hz)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_Flo',
      },
      {
        name: 'MDVP_Jitter(%)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_Jitter_Percent',
      },
      {
        name: 'MDVP_Jitter(Abs)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_Jitter_Abs',
      },
      {
        name: 'MDVP_RAP',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_RAP',
      },
      {
        name: 'MDVP_PPQ',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_PPQ',
      },
      {
        name: 'Jitter_DDP',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'Jitter_DDP',
      },
      {
        name: 'MDVP_Shimmer',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_Shimmer',
      },
      {
        name: 'MDVP_Shimmer(dB)',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_Shimmer_dB',
      },
      {
        name: 'Shimmer_APQ3',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'Shimmer_APQ3',
      },
      {
        name: 'Shimmer_APQ5',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'Shimmer_APQ5',
      },
      {
        name: 'MDVP_APQ',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'MDVP_APQ',
      },
      {
        name: 'Shimmer_DDA',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'Shimmer_DDA',
      },
      {
        name: 'NHR',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'NHR',
      },
      {
        name: 'HNR',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'HNR',
      },
      {
        name: 'RPDE',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'RPDE',
      },
      {
        name: 'DFA',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'DFA',
      },
      {
        name: 'spread1',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'spread1',
      },
      {
        name: 'spread2',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'spread2',
      },
      {
        name: 'D2',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'D2',
      },
      {
        name: 'PPE',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'PPE',
      },
    ],
    'Breast Cancer': [
      // Order follows specific sequence required by the model
      {
        name: 'mean radius',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_radius',
      },
      {
        name: 'mean texture',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_texture',
      },
      {
        name: 'mean_perimeter',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_perimeter',
      },
      {
        name: 'mean_area',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_area',
      },
      {
        name: 'mean_smoothness',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_smoothness',
      },
      {
        name: 'mean_compactness',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_compactness',
      },
      {
        name: 'mean_concavity',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_concavity',
      },
      {
        name: 'mean_concavepoints',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_concavepoints',
      },
      {
        name: 'mean_symmetry',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_symmetry',
      },
      {
        name: 'mean_fractal_dim',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'mean_fractal_dim',
      },
      {
        name: 'radius_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'radius_error',
      },
      {
        name: 'texture_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'texture_error',
      },
      {
        name: 'perimeter_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'perimeter_error',
      },
      {
        name: 'area_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'area_error',
      },
      {
        name: 'smoothness_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'smoothness_error',
      },
      {
        name: 'compactness_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'compactness_error',
      },
      {
        name: 'concavity_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'concavity_error',
      },
      {
        name: 'concave_points_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'concave_points_error',
      },
      {
        name: 'symmetry_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'symmetry_error',
      },
      {
        name: 'fractal_dim_error',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'fractal_dim_error',
      },
      {
        name: 'worst_radius',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_radius',
      },
      {
        name: 'worst_texture',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_texture',
      },
      {
        name: 'worst_perimeter',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_perimeter',
      },
      {
        name: 'worst_area',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_area',
      },
      {
        name: 'worst_smoothness',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_smoothness',
      },
      {
        name: 'worst_compactness',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_compactness',
      },
      {
        name: 'worst_concavity',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_concavity',
      },
      {
        name: 'worst_concavepoints',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_concavepoints',
      },
      {
        name: 'worst_symmetry',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_symmetry',
      },
      {
        name: 'worst_fractal_dim',
        value: 0,
        type: 'number',
        precision: 2,
        title: 'worst_fractal_dim',
      },
    ],
  }

  // Initialize form data when disease changes
  useEffect(() => {
    const initialFormData = {}
    const currentInputs = diseaseInputs[disease] || []

    currentInputs.forEach((input) => {
      // For select inputs, initialize with 0 (first option)
      initialFormData[input.title] = input.type === 'select' ? 0 : input.value
    })

    setFormData(initialFormData)
    setResult(null)
  }, [disease])

  // Update the handleInputChange function to properly handle select inputs
  const handleInputChange = (e, inputName) => {
    const { value, type } = e.target

    // Convert to appropriate type based on input
    let processedValue = value
    if (type === 'number') {
      processedValue = parseFloat(value) || 0
    } else if (type === 'checkbox') {
      processedValue = e.target.checked
    } else if (e.target.tagName.toLowerCase() === 'select') {
      // For select elements, use the numeric index
      processedValue = parseInt(value, 10)
    }

    setFormData({
      ...formData,
      [inputName]: processedValue,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear any existing results when predicting again
    setResult(null)

    // Set loading state
    setIsLoading(true)

    console.log('Form data submitted:', formData)
    let res

    try {
      if (disease === 'Diabetes') {
        res = await axios.post(`${BackendUri}/api/predict/disease-a`, {
          userId: profile._id,
          inputData: formData,
        })
        setResult(res.data)
      } else if (disease === 'Heart Disease') {
        res = await axios.post(`${BackendUri}/api/predict/disease-b`, {
          userId: profile._id,
          inputData: formData,
        })
        setResult(res.data)
      } else if (disease === "Parkinson's Disease") {
        // For Parkinson's Disease, convert formData to array
        const parkinsonInputs = diseaseInputs["Parkinson's Disease"]
        const parkinsonArray = parkinsonInputs.map(
          (input) => formData[input.title] || 0
        )

        res = await axios.post(`${BackendUri}/api/predict/disease-c`, {
          userId: profile._id,
          inputData: { features: parkinsonArray },
        })
        setResult(res.data)
      } else if (disease === 'Breast Cancer') {
        // For Breast Cancer, convert formData to array
        const breastCancerInputs = diseaseInputs['Breast Cancer']
        const breastCancerArray = breastCancerInputs.map(
          (input) => formData[input.title] || 0
        )

        res = await axios.post(`${BackendUri}/api/predict/disease-d`, {
          userId: profile._id,
          inputData: { features: breastCancerArray },
        })
        setResult(res.data)
      }

      console.log('Prediction result:', res.data)
    } catch (error) {
      console.error('Error making prediction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderInput = (input) => {
    switch (input.type) {
      case 'number':
        return (
          <InputField>
            <label htmlFor={input.name}>{input.name}</label>
            <input
              type='number'
              id={input.name}
              value={formData[input.title] || 0}
              onChange={(e) => handleInputChange(e, input.title)}
              step={input.precision === 0 ? 1 : Math.pow(0.1, input.precision)}
            />
          </InputField>
        )
      case 'select':
        return (
          <InputField>
            <label htmlFor={input.name}>{input.name}</label>
            <select
              id={input.name}
              value={formData[input.title] || 0} // Default to 0 if undefined
              onChange={(e) => handleInputChange(e, input.title)}>
              {input.options.map((option, index) => (
                <option
                  key={option}
                  value={index}>
                  {option}
                </option>
              ))}
            </select>
          </InputField>
        )
      default:
        return (
          <InputField>
            <label htmlFor={input.name}>{input.name}</label>
            <input
              type='text'
              id={input.name}
              value={formData[input.title] || ''}
              onChange={(e) => handleInputChange(e, input.title)}
            />
          </InputField>
        )
    }
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <InputGrid>
          {diseaseInputs[disease]?.map((input, index) => (
            <div key={index}>{renderInput(input)}</div>
          ))}
        </InputGrid>

        <ActionRow>
          <ButtonContainer>
            <SubmitButton
              type='submit'
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Predicting...
                </>
              ) : (
                'Predict'
              )}
            </SubmitButton>
          </ButtonContainer>

          {result && (
            <ResultContainer prediction={result.prediction}>
              <h3>Prediction Result</h3>
              <p>
                The model predicts:{' '}
                <strong>{result.prediction ? 'Positive' : 'Negative'}</strong>
              </p>
            </ResultContainer>
          )}
        </ActionRow>
      </form>
    </FormContainer>
  )
}

const FormContainer = styled.div`
  width: 100%;

  h2 {
    color: #4b0082;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 90px;

  label {
    font-size: 14px;
    margin-bottom: 6px;
    color: #333;
    min-height: 40px;
    display: flex;
    align-items: flex-start;
  }

  input,
  select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    height: 40px;
    transition: border 0.3s ease;

    &:focus {
      outline: none;
      border-color: #4b0082;
      box-shadow: 0 0 0 2px rgba(75, 0, 130, 0.1);
    }
  }
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const ButtonContainer = styled.div`
  /* Remove justify-content center to align to the left */
  display: flex;
  margin-top: 1rem;
`

const SubmitButton = styled.button`
  background-color: #4b0082;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#4b0082' : '#3a006b')};
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(-2px)')};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.8;
    cursor: wait;
  }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const ResultContainer = styled.div`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background-color: ${(props) =>
    props.prediction ? 'rgba(255, 99, 71, 0.1)' : 'rgba(144, 238, 144, 0.1)'};
  border: 1px solid
    ${(props) =>
      props.prediction ? 'rgba(255, 99, 71, 0.3)' : 'rgba(144, 238, 144, 0.3)'};
  max-width: 400px;

  h3 {
    color: #4b0082;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
    font-size: 0.95rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: ${(props) => (props.prediction ? '#d9534f' : '#5cb85c')};
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

const FormStyled = styled.div`
  width: 100%;
  min-height: min-content;
  padding-bottom: 1rem;
`

export default Form
