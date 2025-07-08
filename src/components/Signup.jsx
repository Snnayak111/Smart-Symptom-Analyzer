import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { signup } from '../utils/Icons'
import CitySearchInput from './CitySearchInput'
import axios from 'axios'
import { ProfileContext } from '../context/ProfileContext'

const Signup = ({ updateActive }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [city, setCity] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setProfile, setIsAuth } = useContext(ProfileContext)
  const Backend_URI = import.meta.env.VITE_BACKEND_URI

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!city) {
      setError('Please select your city')
      setLoading(false)
      return
    }

    if (!gender) {
      setError('Please select your gender')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(`${Backend_URI}/api/profile`, {
        name,
        email,
        password,
        gender,
        dob,
        height,
        weight,
        location: {
          cityName: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
          state: city.state,
        },
      })

      setIsAuth(true)
      setProfile(res.data.user)
      navigate('/home')
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'An error occurred during signup. Please try again.'
      )
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity)
  }

  return (
    <SignupStyled>
      <div className='signup-content'>
        <h2 className='title'>Create an Account</h2>
        {error && <p className='error-message'>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='input-control'>
              <label>Full Name</label>
              <input
                type='text'
                placeholder='Enter your full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className='input-control'>
              <label>Email</label>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='input-control'>
              <label>Password</label>
              <input
                type='password'
                placeholder='Create a password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength='6'
              />
            </div>

            <div className='input-control'>
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={loading}
                required
              >
                <option value='' disabled>Select your gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>
          </div>

          <div className='form-row'>
            <div className='input-control'>
              <label>Date of Birth</label>
              <input
                type='date'
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className='input-control'>
              <label>Height (cm)</label>
              <input
                type='number'
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className='input-control'>
              <label>Weight (kg)</label>
              <input
                type='number'
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='input-control'>
              <label>Your City</label>
              <CitySearchInput
                onCitySelect={handleCitySelect}
                disabled={loading}
              />
              {city && (
                <div className='selected-city'>
                  Selected: <span>{city.fullAddress}</span>
                </div>
              )}
            </div>
          </div>

          <div className='actions-row'>
            <div className='submit-btn'>
              <button type='submit' disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner /> Creating Account...
                  </>
                ) : (
                  <>{signup} Sign Up</>
                )}
              </button>
            </div>

            <div className='login-link'>
              Already have an account?{' '}
              <span onClick={() => !loading && updateActive(1)}>Login</span>
            </div>
          </div>
        </form>
      </div>
    </SignupStyled>
  )
}

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const SignupStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .signup-content {
    width: 80%;
    max-width: 1000px;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 20px;
    padding: 2rem 3rem;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  }

  .title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    color: var(--primary-color);
  }

  .error-message {
    color: #e53935;
    background-color: rgba(229, 57, 53, 0.1);
    padding: 0.8rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
  }

  .form-row {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  .input-control {
    flex: 1;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input,
    select {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-size: 1rem;
      transition: border 0.3s ease;

      &:focus {
        border-color: var(--primary-color);
        outline: none;
      }

      &:disabled {
        background-color: #f9f9f9;
        cursor: not-allowed;
      }
    }

    .selected-city {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #555;

      span {
        color: var(--primary-color);
        font-weight: 500;
      }
    }
  }

  .actions-row {
    display: flex;
    align-items: center;
    margin-top: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  .submit-btn {
    flex: 1;

    button {
      width: 100%;
      padding: 0.8rem;
      background: var(--primary-color);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      svg {
        margin-right: 0.5rem;
      }

      &:hover {
        background: var(--primary-color-dark, #0056b3);
      }

      &:disabled {
        opacity: 0.8;
        cursor: wait;
      }
    }
  }

  .login-link {
    flex: 1;
    text-align: center;
    font-size: 1rem;

    span {
      color: var(--primary-color);
      cursor: pointer;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

export default Signup