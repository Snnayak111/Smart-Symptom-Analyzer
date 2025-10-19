import { Schema, model } from 'mongoose'

const citiesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    // Disease counts
    disA: {
      type: Number,
      default: 0,
    },
    disB: {
      type: Number,
      default: 0,
    },
    disC: {
      type: Number,
      default: 0,
    },
    disD: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Create a 2dsphere index on the location field for geo queries
citiesSchema.index({ location: '2dsphere' })

// Create a unique compound index on longitude and latitude separately
citiesSchema.index(
  {
    'location.coordinates.0': 1, // longitude (first element)
    'location.coordinates.1': 1, // latitude (second element)
  },
  { unique: true }
)

// Create indexes for disease counts for efficient sorting
citiesSchema.index({ disA: -1 })
citiesSchema.index({ disB: -1 })
citiesSchema.index({ disC: -1 })
citiesSchema.index({ disD: -1 })

// Virtual property to get longitude directly
citiesSchema.virtual('longitude').get(function () {
  return this.location.coordinates[0]
})

// Virtual property to get latitude directly
citiesSchema.virtual('latitude').get(function () {
  return this.location.coordinates[1]
})

// Static method to find or create a city by coordinates
citiesSchema.statics.findOrCreateByCoordinates = async function (
  name,
  longitude,
  latitude
) {
  try {
    // Try to find the city first
    let city = await this.findOne({
      'location.coordinates': [longitude, latitude],
    })

    // If city exists, return it
    if (city) {
      return city
    }

    // If city doesn't exist, create it
    city = new this({
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    })

    await city.save()
    return city
  } catch (error) {
    throw error
  }
}

// Instance method to increment disease counts
citiesSchema.methods.incrementDisease = function (diseaseType, count = 1) {
  if (diseaseType === 'A') this.disA += count
  else if (diseaseType === 'B') this.disB += count
  else if (diseaseType === 'C') this.disC += count
  else if (diseaseType === 'D') this.disD += count

  this.updatedAt = Date.now()
  return this.save()
}

// Static method to find cities within a radius
citiesSchema.statics.findNearby = function (
  longitude,
  latitude,
  maxDistance = 10000
) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
  })
}

// Static method to get disease statistics for a region
citiesSchema.statics.getDiseaseStats = async function (
  longitude,
  latitude,
  maxDistance = 50000
) {
  const results = await this.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'distance',
        maxDistance: maxDistance,
        spherical: true,
      },
    },
    {
      $group: {
        _id: null,
        totalCities: { $sum: 1 },
        totalDisA: { $sum: '$disA' },
        totalDisB: { $sum: '$disB' },
        totalDisC: { $sum: '$disC' },
        totalDisD: { $sum: '$disD' },
        avgDisA: { $avg: '$disA' },
        avgDisB: { $avg: '$disB' },
        avgDisC: { $avg: '$disC' },
        avgDisD: { $avg: '$disD' },
      },
    },
  ])

  return results[0] || null
}

// Static method to get cities sorted by disease A count
citiesSchema.statics.getByDiseaseA = function (limit = 20) {
  return this.find({}).sort({ disA: -1 }).limit(limit)
}

// Static method to get cities sorted by disease B count
citiesSchema.statics.getByDiseaseB = function (limit = 20) {
  return this.find({}).sort({ disB: -1 }).limit(limit)
}

// Static method to get cities sorted by disease C count
citiesSchema.statics.getByDiseaseC = function (limit = 20) {
  return this.find({}).sort({ disC: -1 }).limit(limit)
}

// Static method to get cities sorted by disease D count
citiesSchema.statics.getByDiseaseD = function (limit = 20) {
  return this.find({}).sort({ disD: -1 }).limit(limit)
}

// Static method to get cities sorted by any disease count
citiesSchema.statics.getByDisease = function (diseaseType, limit = 20) {
  const sortField = {}

  if (diseaseType === 'A') sortField.disA = -1
  else if (diseaseType === 'B') sortField.disB = -1
  else if (diseaseType === 'C') sortField.disC = -1
  else if (diseaseType === 'D') sortField.disD = -1
  else throw new Error('Invalid disease type. Use A, B, C, or D')

  return this.find({}).sort(sortField).limit(limit)
}

// Static method to get top cities for all diseases
citiesSchema.statics.getTopCitiesForAllDiseases = async function (limit = 10) {
  return {
    topDisA: await this.find({}).sort({ disA: -1 }).limit(limit),
    topDisB: await this.find({}).sort({ disB: -1 }).limit(limit),
    topDisC: await this.find({}).sort({ disC: -1 }).limit(limit),
    topDisD: await this.find({}).sort({ disD: -1 }).limit(limit),
  }
}

// Static method to get cities with aggregated disease count (total of all diseases)
citiesSchema.statics.getByTotalDiseaseCount = function (limit = 20) {
  return this.aggregate([
    {
      $addFields: {
        totalDiseases: { $sum: ['$disA', '$disB', '$disC', '$disD'] },
      },
    },
    {
      $sort: { totalDiseases: -1 },
    },
    {
      $limit: limit,
    },
  ])
}

const Cities = model('Cities', citiesSchema)

export default Cities
