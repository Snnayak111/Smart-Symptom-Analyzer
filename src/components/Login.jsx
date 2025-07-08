import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/Icons'
import axios from 'axios'
import { ProfileContext } from '../context/ProfileContext'

const Login = ({ updateActive }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setIsAuth, setProfile } = useContext(ProfileContext)
  const BackendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') // Clear any previous errors
    setLoading(true) // Set loading state to true when form is submitted

    try {
      // Handle the login logic
      console.log('Login attempt with:', { email, password })

      const res = await axios.post(`${BackendUri}/api/login`, {
        email,
        password,
      })
      setIsAuth(true)
      console.log('Login response:', res.data)
      setProfile(res.data)
      navigate('/home')
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'An error occurred during login. Please try again.'
      )
      console.error('Login error:', err)
    } finally {
      setLoading(false) // Set loading state to false after request completes
    }
  }

  return (
    <LoginStyled>
      <div className='login-content'>
        <h2 className='title'>
          Login to <span>Smart Symptom</span>
        </h2>

        {error && <p className='error-message'>{error}</p>}

        <form onSubmit={handleSubmit}>
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

          <div className='input-control'>
            <label>Password</label>
            <input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className='submit-btn'>
            <button
              type='submit'
              disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner /> Logging in...
                </>
              ) : (
                <>{login} Login</>
              )}
            </button>
          </div>
        </form>

        <div className='bottom-text'>
          <p>
            Don't have an account?{' '}
            <span onClick={() => !loading && updateActive(2)}>Sign Up</span>
          </p>
        </div>
      </div>
    </LoginStyled>
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

const LoginStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-content {
    width: 30rem;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  }

  .title {
    span {
      color: var(--primary-color);
    }
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

  .input-control {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
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
  }

  .submit-btn {
    margin-top: 2rem;

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

  .bottom-text {
    margin-top: 1.5rem;
    text-align: center;

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

export default Login
