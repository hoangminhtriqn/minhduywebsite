const mongoose = require('mongoose');

// Define the schema for items embedded within the Favorites
const embeddedFavoriteItemSchema = new mongoose.Schema({
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  Image: {
    type: String // Store image URL directly
  }
}, {
  timestamps: true
});

const favoritesSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [embeddedFavoriteItemSchema], // Array of embedded favorite item objects
  Status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Configure virtual fields to be returned in JSON
favoritesSchema.set('toJSON', { virtuals: true });
favoritesSchema.set('toObject', { virtuals: true });

const Favorites = mongoose.model('Favorites', favoritesSchema);

module.exports = Favorites; 