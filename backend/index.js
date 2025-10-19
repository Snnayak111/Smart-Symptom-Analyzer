import express from 'express'
import cors from 'cors'
import pkg from 'body-parser'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import axios from 'axios'
import bcrypt from 'bcrypt'

// Import models
import User from './models/User.js'
import Cities from './models/Cities.js'

// Load environment variables
config()
const { json } = pkg
// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/medApp'
    )
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

connectDB()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000
const mlUrl = 'http://127.0.0.1:8000'

// Middleware
app.use(cors())
app.use(json())

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API')
})

// Status route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' })
})

// =====================================================
// USER PROFILE ROUTES
// =====================================================

// Create user profile
app.post('/api/profile', async (req, res, next) => {
  try {
    const { name, email, location, password } = req.body

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ error: 'Location data is required' })
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists',
        userId: existingUser._id,
      })
    }
    const encodedPassword = bcrypt.hashSync(password, 6)
    // Check if city exists at these coordinates
    let city = await Cities.findOne({
      'location.coordinates': [location.longitude, location.latitude],
    })

    // Create city if it doesn't exist
    if (!city) {
      city = new Cities({
        name: location.cityName || 'Unknown City',
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        state: location.state || ""
      })
      await city.save()
    }

    // Create user profile
    const user = new User({
      name,
      email,
      password: encodedPassword,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      disA: false,
      disB: false,
      disC: false,
      disD: false,
    })

    await user.save()

    res.status(201).json({
      message: 'User profile created successfully',
      user,
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    res.json({
      message: 'Login successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      disA: user.disA,
      disB: user.disB,
      disC: user.disC,
      disD: user.disD,
    })
  } catch (error) {}
})

// =====================================================
// DISEASE PREDICTION ROUTES
// =====================================================

// Helper function to update disease count
const updateDiseaseCount = async (userId, diseaseType, predictionResult) => {
  try {
    // Get the user
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    // Check current disease status
    const currentStatus = user[`dis${diseaseType}`] // e.g., user.disA

    // If prediction result is different from current status
    console.log(user)
    console.log(currentStatus, predictionResult);
    if (currentStatus !== predictionResult) {
      // Update user's disease status
      user[`dis${diseaseType}`] = predictionResult
      await user.save()

      // Find the city
      const city = await Cities.findOne({
        'location.coordinates': user.location.coordinates,
      })

      if (!city) throw new Error('City not found')

      // Update city's disease count using updateOne - no need for save()
      const updateData = {}
      if (predictionResult) {
        // Increment disease count if prediction is positive
        updateData[`dis${diseaseType}`] = city[`dis${diseaseType}`] + 1
      } else if (currentStatus) {
        // Decrement disease count if prediction is negative but was positive before
        updateData[`dis${diseaseType}`] = Math.max(
          0,
          city[`dis${diseaseType}`] - 1
        )
      } else {
        // No update needed
        return { user, city }
      }

      await Cities.updateOne({ _id: city._id }, { $set: updateData })

      // Return updated city data
      const updatedCity = await Cities.findById(city._id)
      return { user, city: updatedCity }
    }

    return {
      user,
      city: await Cities.findOne({
        'location.coordinates': user.location.coordinates,
      }),
    }
  } catch (error) {
    console.error('Error updating disease count:', error)
    throw error
  }
}

// Disease A prediction
app.post('/api/predict/disease-a', async (req, res, next) => {
  try {
    const { userId, inputData } = req.body

    if (!userId || !inputData) {
      return res
        .status(400)
        .json({ error: 'User ID and input data are required' })
    }

    let predictionResult = false
    try {
      const response = await axios.post(`${mlUrl}/predict/diabetes`, inputData)
      if (response.status === 200) {
        const res = response.data
        const noCount = Object.values(res).filter((value) =>
          value.startsWith('No')
        ).length
        console.log(res)
        predictionResult = noCount < 2
      }
    } catch (error) {
      console.error('ML service error:', error)
      return res.status(500).json({ error: 'Error connecting to ML service' })
    }
    const { user, city } = await updateDiseaseCount(
      userId,
      'A',
      predictionResult
    )

    res.json({
      userId,
      diseaseType: 'A',
      prediction: predictionResult,
    })
  } catch (error) {
    next(error)
  }
})

// Disease B prediction
app.post('/api/predict/disease-b', async (req, res, next) => {
  try {
    const { userId, inputData } = req.body

    if (!userId || !inputData) {
      return res
        .status(400)
        .json({ error: 'User ID and input data are required' })
    }

    // Call ML service for prediction (simulated)
    let predictionResult = false
    try {
      console.log('Input data:', inputData)
      const response = await axios.post(`${mlUrl}/predict/heart`, inputData)
      if (response.status === 200) {
        const res = response.data
        const noCount = Object.values(res).filter((value) =>
          value.startsWith('No')
        ).length
        console.log('Prediction response:', res)
        predictionResult = noCount < 2
      }
    } catch (error) {
      console.error('ML service error:', error)
      return res.status(500).json({ error: 'Error connecting to ML service' })
    }
    // Update disease count in city based on prediction
    await updateDiseaseCount(userId, 'B', predictionResult)

    res.json({
      userId,
      diseaseType: 'B',
      prediction: predictionResult,
    })
  } catch (error) {
    next(error)
  }
})

// Disease C prediction
app.post('/api/predict/disease-c', async (req, res, next) => {
  try {
    const { userId, inputData } = req.body

    if (!userId || !inputData) {
      return res
        .status(400)
        .json({ error: 'User ID and input data are required' })
    }

    // Call ML service for prediction (simulated)
    let predictionResult = false
    try {
      console.log('Input data:', inputData)
      const response = await axios.post(`${mlUrl}/predict/parkinson`, inputData)
      if (response.status === 200) {
        const res = response.data
        const noCount = Object.values(res).filter((value) =>
          value.startsWith('No')
        ).length
        console.log('Prediction response:', res)
        predictionResult = noCount < 2
      }
    } catch (error) {
      console.error('ML service error:', error)
      return res.status(500).json({ error: 'Error connecting to ML service' })
    }

    // Update disease count in city based on prediction
    const { user, city } = await updateDiseaseCount(
      userId,
      'C',
      predictionResult
    )

    res.json({
      userId,
      diseaseType: 'C',
      prediction: predictionResult,
    })
  } catch (error) {
    next(error)
  }
})

// Disease D prediction
app.post('/api/predict/disease-d', async (req, res, next) => {
  try {
    const { userId, inputData } = req.body

    if (!userId || !inputData) {
      return res
        .status(400)
        .json({ error: 'User ID and input data are required' })
    }

    let predictionResult = false
    try {
      console.log('Input data:', inputData)
      const response = await axios.post(`${mlUrl}/predict/cancer`, inputData)
      if (response.status === 200) {
        const res = response.data
        const noCount = Object.values(res).filter((value) =>
          value.startsWith('No')
        ).length
        console.log('Prediction response:', res)
        predictionResult = noCount < 2
      }
    } catch (error) {
      console.error('ML service error:', error)
      return res.status(500).json({ error: 'Error connecting to ML service' })
    }

    // Update disease count in city based on prediction
    const { user, city } = await updateDiseaseCount(
      userId,
      'D',
      predictionResult
    )

    res.json({
      userId,
      diseaseType: 'D',
      prediction: predictionResult,
    })
  } catch (error) {
    next(error)
  }
})

// =====================================================
// CITY DISEASE STATISTICS ROUTES
// =====================================================

// Get cities with highest cases for a specific disease
app.get('/api/cities/max-disease/:diseaseType', async (req, res, next) => {
  try {
    const { diseaseType } = req.params
    const { minCases = 1 } = req.query

    // Validate disease type
    if (!['A', 'B', 'C', 'D'].includes(diseaseType.toUpperCase())) {
      return res
        .status(400)
        .json({ error: 'Invalid disease type. Must be A, B, C, or D' })
    }

    const diseaseField = `dis${diseaseType.toUpperCase()}`
    const filterQuery = {}
    filterQuery[diseaseField] = { $gte: parseInt(minCases) }

    const cities = await Cities.find(filterQuery)
      .sort({ [diseaseField]: -1 })
      .select(`name location ${diseaseField} state`)

    res.json({
      diseaseType: diseaseType.toUpperCase(),
      minCases: parseInt(minCases),
      count: cities.length,
      cities: cities.map((city) => ({
        id: city._id,
        name: city.name,
        cases: city[diseaseField],
        location: {
          longitude: city.location.coordinates[0],
          latitude: city.location.coordinates[1],
        },
        fullAddress: `${city.name}, ${city.state}, India`,
      })),
    })
  } catch (error) {
    next(error)
  }
})

// Get heatmap data for all diseases
app.get('/api/cities/heatmap', async (req, res, next) => {
  try {
    const cities = await Cities.find({
      $or: [
        { disA: { $gt: 0 } },
        { disB: { $gt: 0 } },
        { disC: { $gt: 0 } },
        { disD: { $gt: 0 } },
      ],
    }).select('name location disA disB disC disD')

    const heatmapData = cities.map((city) => ({
      id: city._id,
      name: city.name,
      location: {
        longitude: city.location.coordinates[0],
        latitude: city.location.coordinates[1],
      },
      diseases: {
        A: city.disA,
        B: city.disB,
        C: city.disC,
        D: city.disD,
      },
      totalCases: city.disA + city.disB + city.disC + city.disD,
    }))

    res.json({
      count: heatmapData.length,
      data: heatmapData,
    })
  } catch (error) {
    next(error)
  }
})

// Get disease statistics for all cities
app.get('/api/cities/statistics', async (req, res, next) => {
  try {
    const stats = await Cities.aggregate([
      {
        $group: {
          _id: null,
          totalCities: { $sum: 1 },
          citiesWithDiseases: {
            $sum: {
              $cond: [
                { $gt: [{ $add: ['$disA', '$disB', '$disC', '$disD'] }, 0] },
                1,
                0,
              ],
            },
          },
          totalDiseaseA: { $sum: '$disA' },
          totalDiseaseB: { $sum: '$disB' },
          totalDiseaseC: { $sum: '$disC' },
          totalDiseaseD: { $sum: '$disD' },
          maxDiseaseA: { $max: '$disA' },
          maxDiseaseB: { $max: '$disB' },
          maxDiseaseC: { $max: '$disC' },
          maxDiseaseD: { $max: '$disD' },
        },
      },
    ])

    res.json(
      stats[0] || {
        totalCities: 0,
        citiesWithDiseases: 0,
        totalDiseaseA: 0,
        totalDiseaseB: 0,
        totalDiseaseC: 0,
        totalDiseaseD: 0,
        maxDiseaseA: 0,
        maxDiseaseB: 0,
        maxDiseaseC: 0,
        maxDiseaseD: 0,
      }
    )
  } catch (error) {
    next(error)
  }
})

// Add this to your existing Express routes

// City search proxy route with type indicator
app.get('/api/city-search', async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' })
    }

    // First search in local database
    const localCities = await Cities.find({
      name: { $regex: new RegExp(query, 'i') }, // Case-insensitive search
    }).limit(5)
    // If we found cities in our database, return them with type: 'local'
    if (localCities && localCities.length > 0) {
      const predictions = localCities.map((city) => ({
        place_id: `local_${city._id}`,
        description: `${city.name}, ${city.state},India`,
        structured_formatting: {
          main_text: city.name,
          secondary_text: 'India',
        },
        latitude: city.location.coordinates[1],
        longitude: city.location.coordinates[0],
        state: city.state, // Include state information
      }))
      console.log('Local cities found:', predictions)
      return res.json({
        predictions,
        status: 'OK',
        type: 'local', // Add type parameter to indicate local database results
      })
    }

    // If no local results, call Google Maps API
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY

    // Call Google Places API from backend
    const response = await axios.get(
      `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${query}&types=(cities)&components=country:in&key=${API_KEY}`
    )

    // Return Maps API response with type indicator
    res.json({
      ...response.data,
      type: 'maps', // Add type parameter to indicate Google Maps results
    })
  } catch (error) {
    console.error('Error in city search:', error)
    res.status(500).json({ error: 'Failed to search cities' })
  }
})

// City details proxy route with state information
app.get('/api/city-details', async (req, res) => {
  try {
    const { placeId } = req.query

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID parameter is required' })
    }

    const API_KEY = process.env.GOOGLE_MAPS_API_KEY

    // Request more fields to get address components that include state info
    const response = await axios.get(
      `https://maps.gomaps.pro/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address,address_components&key=${API_KEY}`
    )

    if (response.data.status === 'OK' && response.data.result) {
      // Extract state from address_components
      let state = null
      if (response.data.result.address_components) {
        // Find administrative_area_level_1 (state) in address components
        const stateComponent = response.data.result.address_components.find(
          (component) => 
            component.types.includes('administrative_area_level_1')
        )
        
        if (stateComponent) {
          state = stateComponent.long_name
        }
      }
      
      // Add state to the response
      return res.json({
        ...response.data,
        result: {
          ...response.data.result,
          state: state // Add state field explicitly
        }
      })
    }

    res.json(response.data)
  } catch (error) {
    console.error('Error fetching city details:', error)
    res.status(500).json({ error: 'Failed to fetch city details' })
  }
})

// =====================================================
// ERROR HANDLING
// =====================================================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  })
})

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
