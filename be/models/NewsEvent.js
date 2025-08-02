const mongoose = require("mongoose");
const { NEWS_STATUS } = require("../utils/enums");

const newsEventSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      trim: true,
    },
    Content: {
      type: String,
      required: true,
    },
    PublishDate: {
      type: Date,
      default: Date.now,
    },
    ImageUrl: {
      type: String,
    },
    Status: {
      type: String,
      enum: Object.values(NEWS_STATUS),
      default: NEWS_STATUS.DRAFT,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    // Add any other relevant fields (e.g., author, tags, category)
  },
  { timestamps: true }
);

const NewsEvent = mongoose.model("NewsEvent", newsEventSchema);

module.exports = NewsEvent;
