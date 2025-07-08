import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const CitySearchInput = ({ onCitySelect, selectedCity }) => {
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const timeoutRef = useRef(null)
  const dropdownRef = useRef(null)
  const Backend_URI = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000'

  // Set query from selectedCity prop when it changes
  useEffect(() => {
    if (selectedCity?.name) {
      setQuery(selectedCity.name)
    }
  }, [selectedCity])

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const searchCities = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setCities([])
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(
        `${Backend_URI}/api/city-search?query=${searchQuery}`
      )
      console.log('API Response:', response.data) // Debugging line
      if (response.data.status === 'OK') {
        // Check source type
        if (response.data.type === 'local') {
          // For local results, location data is already included in predictions
          const citiesWithLocation = response.data.predictions.map(
            (prediction) => {
              return {
                id: prediction.place_id,
                name: prediction.structured_formatting.main_text,
                fullAddress: prediction.description,
                latitude: prediction.latitude,
                longitude: prediction.longitude,
                state: prediction.state,
                source: 'local',
              }
            }
          )

          setCities(citiesWithLocation)
        } else {
          // For Maps results, transform into our format but mark them for later fetching of coordinates
          const formattedCities = response.data.predictions.map(
            (prediction) => {
              return {
                id: prediction.place_id,
                name:
                  prediction.structured_formatting?.main_text ||
                  prediction.description.split(',')[0],
                fullAddress: prediction.description,
                place_id: prediction.place_id, // Keep original place_id for fetching details later
                source: 'maps',
              }
            }
          )

          setCities(formattedCities)
        }
      } else {
        setCities([])
      }
    } catch (error) {
      console.error('Error searching for cities:', error)
      setCities([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setShowDropdown(true)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set a new timeout for 2 seconds
    if (value.trim()) {
      setLoading(true)
      timeoutRef.current = setTimeout(() => {
        searchCities(value)
      }, 2000)
    } else {
      setCities([])
      setLoading(false)
    }
  }

  const handleCitySelect = async (city) => {
    setQuery(city.name)

    // If it's a local city, we already have all the information
    if (city.source === 'local') {
      onCitySelect({
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        fullAddress: city.fullAddress,
        state: city.state,
      })
      setShowDropdown(false)
      return
    }

    // For Maps results, we need to fetch the details to get coordinates and state
    try {
      setLoading(true)
      const detailsResponse = await axios.get(
        `${Backend_URI}/api/city-details?placeId=${city.place_id}`
      )

      if (detailsResponse.data.status === 'OK' && detailsResponse.data.result) {
        const { result } = detailsResponse.data

        onCitySelect({
          name: city.name,
          latitude: result.geometry?.location?.lat,
          longitude: result.geometry?.location?.lng,
          fullAddress: result.formatted_address,
          state: result.state || '', // State should come from the modified API response
        })
      }
    } catch (error) {
      console.error('Error fetching city details:', error)
    } finally {
      setLoading(false)
      setShowDropdown(false)
    }
  }

  const handleRemoveCity = () => {
    setQuery('')
    onCitySelect(null)
  }

  return (
    <CitySearchStyled>
      <div className='input-wrapper'>
        <input
          type='text'
          placeholder='Search for your city...'
          value={query}
          onChange={handleInputChange}
          onFocus={() =>
            query.trim() && cities.length > 0 && setShowDropdown(true)
          }
        />
        {loading && <div className='loader'></div>}
        {query && !loading && (
          <button
            type='button'
            className='clear-btn'
            onClick={handleRemoveCity}
            aria-label='Clear city selection'>
            ×
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className='dropdown'
          ref={dropdownRef}>
          {cities.length > 0
            ? cities.map((city) => (
                <div
                  key={city.id}
                  className='city-item'
                  onClick={() => handleCitySelect(city)}>
                  <div className='city-name'>
                    {city.name}
                    {city.source === 'maps' && (
                      <span className='source-badge'>Maps</span>
                    )}
                  </div>
                  <div className='city-address'>{city.fullAddress}</div>
                </div>
              ))
            : !loading &&
              query.trim() && <div className='no-results'>No cities found</div>}
        </div>
      )}
    </CitySearchStyled>
  )
}

const CitySearchStyled = styled.div`
  position: relative;
  width: 100%;

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-size: 1rem;
      transition: border 0.3s ease;
      padding-right: 40px; /* Make room for the clear button */

      &:focus {
        border-color: var(--primary-color);
        outline: none;
      }
    }

    .loader {
      position: absolute;
      right: 15px;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top: 2px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: #999;
      font-size: 1.5rem;
      cursor: pointer;
      height: 24px;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 0;
      line-height: 1;
      transition: all 0.2s;

      &:hover {
        background-color: #f0f0f0;
        color: #555;
      }
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

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 5px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    z-index: 10;
    max-height: 300px;
    overflow-y: auto;

    .city-item {
      padding: 12px 15px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f9f9f9;
      }

      .city-name {
        font-weight: 500;
        margin-bottom: 3px;
        display: flex;
        align-items: center;

        .source-badge {
          font-size: 0.7rem;
          background-color: #e1f5fe;
          color: #0277bd;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
          font-weight: normal;
        }
      }

      .city-address {
        font-size: 0.85rem;
        color: #666;
      }
    }

    .no-results {
      padding: 15px;
      text-align: center;
      color: #666;
    }
  }
`

export default CitySearchInput
