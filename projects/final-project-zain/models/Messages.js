var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    }
  },
  { collection: "Messages" }
);

var Messages = mongoose.model("Messages", messageSchema);
module.exports = Messages;
