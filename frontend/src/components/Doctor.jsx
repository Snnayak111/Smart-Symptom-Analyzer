import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const Tracker = () => {
  const [selectedDisease, setSelectedDisease] = useState('A')
  const [threshold, setThreshold] = useState(5)
  const [loading, setLoading] = useState(false)
  const [cityData, setCityData] = useState(null)
  const [error, setError] = useState('')

  const diseases = [
    { id: 'A', name: 'Diabetes' },
    { id: 'B', name: 'Heart Disease' },
    { id: 'C', name: `Parkinson's Disease` },
    { id: 'D', name: 'Breast Cancer' },
  ]
  const BackendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000'
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setCityData(null)

    try {
      const response = await axios.get(
        `${BackendUri}/api/cities/max-disease/${selectedDisease}?minCases=${threshold}`
      )
      setCityData(response.data)
      console.log('Fetched data:', response.data)
    } catch (err) {
      console.error('Error fetching disease data:', err)
      setError('Failed to fetch disease data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate circle size based on number of cases
  const getCircleRadius = (cases) => {
    return Math.max(10, Math.min(50, cases * 2)) // Min 10px, max 50px
  }

  // Get circle color based on disease type
  const getCircleColor = (disease) => {
    switch (disease) {
      case 'A':
        return '#FF5252' // Red
      case 'B':
        return '#FFD740' // Amber
      case 'C':
        return '#4CAF50' // Green
      case 'D':
        return '#2196F3' // Blue
      default:
        return '#9C27B0' // Purple
    }
  }

  return (
    <TrackerStyled>
      <h2>Disease Outbreak Tracker</h2>

      <div className='tracker-form'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='disease'>Select Disease:</label>
            <select
              id='disease'
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}>
              {diseases.map((disease) => (
                <option
                  key={disease.id}
                  value={disease.id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='threshold'>Minimum Cases Threshold:</label>
            <input
              id='threshold'
              type='number'
              min='1'
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
            />
          </div>

          <button
            type='submit'
            className='submit-btn'>
            Find Danger Zones
          </button>
        </form>
      </div>

      {loading && (
        <div className='loading-container'>
          <div className='loader'></div>
          <p>Loading disease data...</p>
        </div>
      )}

      {error && <div className='error-message'>{error}</div>}

      {cityData && cityData.cities && cityData.cities.length > 0 ? (
        <div className='results-container'>
          <h3>
            Danger Zones for{' '}
            {diseases.find((d) => d.id === selectedDisease)?.name}
            <span className='results-count'>
              ({cityData.cities.length}{' '}
              {cityData.cities.length === 1 ? 'city' : 'cities'} found)
            </span>
          </h3>

          <div className='map-container'>
            <MapContainer
              center={[20.5937, 78.9629]} // Center of India
              zoom={5}
              style={{ height: '500px', width: '100%' }}>
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {cityData.cities.map((city) => (
                <CircleMarker
                  key={city.id}
                  center={[city.location.latitude, city.location.longitude]}
                  radius={getCircleRadius(city.cases)}
                  pathOptions={{
                    fillColor: getCircleColor(selectedDisease),
                    fillOpacity: 0.6,
                    color: 'white',
                    weight: 1,
                  }}>
                  <Popup>
                    <div>
                      <strong>{city.name}</strong>
                      <br />
                      Cases: {city.cases}
                      <br />
                      Lat: {city.location.latitude.toFixed(4)}
                      <br />
                      Long: {city.location.longitude.toFixed(4)}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          <div className='cities-list'>
            <h4>Affected Cities</h4>
            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Cases</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {cityData.cities.map((city) => (
                  <tr key={city.id}>
                    <td>{city.name}</td>
                    <td className='cases-cell'>{city.cases}</td>
                    <td>
                      {city.fullAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading &&
        cityData && (
          <div className='no-results'>
            <p>
              No cities found with {selectedDisease} cases above threshold of{' '}
              {threshold}.
            </p>
          </div>
        )
      )}
    </TrackerStyled>
  )
}

const TrackerStyled = styled.div`
  padding: 2rem;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }

  .tracker-form {
    background: rgba(252, 246, 249, 0.78);
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);

    form {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: flex-end;
    }

    .form-group {
      flex: 1;
      min-width: 200px;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      select,
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }

    .submit-btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;

      &:hover {
        background: var(--primary-color-dark, #0056b3);
      }
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 3rem 0;

    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid var(--primary-color);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .error-message {
    background-color: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .results-container {
    margin-top: 2rem;

    h3 {
      margin-bottom: 1rem;
      color: var(--primary-color);

      .results-count {
        font-size: 0.9rem;
        color: #666;
        margin-left: 0.5rem;
        font-weight: normal;
      }
    }
  }

  .map-container {
    height: 500px;
    margin-bottom: 2rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  }

  .cities-list {
    background: rgba(252, 246, 249, 0.78);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);

    h4 {
      margin-bottom: 1rem;
      color: var(--primary-color);
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      th {
        font-weight: 600;
        color: #555;
      }

      .cases-cell {
        font-weight: 600;
        color: var(--primary-color);
      }

      tr:last-child td {
        border-bottom: none;
      }
    }
  }

  .no-results {
    background: #f5f5f5;
    padding: 2rem;
    text-align: center;
    border-radius: 10px;
    color: #666;
  }
`

export default Tracker
