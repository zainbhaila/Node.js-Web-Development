var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    comments: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 0.0,
      max: 5.0,
      required: true
    }
  },
  { collection: "Reviews" }
);

var Reviews = mongoose.model("Reviews", reviewSchema);
module.exports = Reviews;
