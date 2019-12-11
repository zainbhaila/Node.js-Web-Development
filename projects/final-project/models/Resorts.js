var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var resortSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    year_opened: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      min: 0.0,
      max: 5.0,
      required: true
    },
    features: {
      type: [String],
      required: true
    }
  },
  { collection: "Resorts" }
);

var Resorts = mongoose.model("Resorts", resortSchema);
module.exports = Resorts;
