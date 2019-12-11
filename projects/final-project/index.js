const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const handlebars = exphbs.handlebars;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Resorts = require("./models/Resorts");
const Messages = require("./models/Messages");
const Reviews = require("./models/Reviews");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const validator = require("validator");
const PORT = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

// Load envirorment variables
dotenv.config();

// Connect to MongoDB
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", function(e) {
  console.log(e);
  console.log(
    "MongoDB Connection Error. Please make sure that MongoDB is running."
  );
  process.exit(1);
});

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use("/public", express.static("public"));

app.get("/", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.render("home", {
      data: resort
    });
  });
});
app.get("/api/getresorts", function(req, res) {
  Resorts.find({}, function(err, resort) {
    if (err) throw err;
    res.json(resort);
  });
});
app.get("/alphabetical", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.render("alphabetical", {
      data: resort.slice().sort((a, b) => (a.name >= b.name ? 1 : -1))
    });
  });
});
app.get("/api/alphabetical", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.json(resort.slice().sort((a, b) => (a.name >= b.name ? 1 : -1)));
  });
});
app.get("/eastcoast", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.render("eastcoast", {
      data: resort.slice().filter(x => x.location == "East Coast")
    });
  });
});
app.get("/api/eastcoast", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.json(resort.slice().filter(x => x.location == "East Coast"));
  });
});
app.get("/oldest", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.render("oldest", {
      data: resort
        .slice()
        .sort((a, b) => (a.year_opened >= b.year_opened ? 1 : -1))
    });
  });
});
app.get("/api/oldest", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.json(
      resort.slice().sort((a, b) => (a.year_opened >= b.year_opened ? 1 : -1))
    );
  });
});
app.get("/rating", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.render("rating", {
      data: resort
        .slice()
        .sort((a, b) => (a.rating <= b.rating ? 1 : -1))
        .filter(x => x.rating > 3.5)
    });
  });
});
app.get("/api/rating", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.json(
      resort
        .slice()
        .sort((a, b) => (a.rating <= b.rating ? 1 : -1))
        .filter(x => x.rating > 3.5)
    );
  });
});
app.get("/featurecount", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.render("features", {
      data: resort
        .slice()
        .sort((a, b) => (a.features <= b.features ? 1 : -1))
        .filter(x => x.features.length >= 3)
    });
  });
});
app.get("/api/featurecount", function(req, res) {
  Resorts.find({}, function(err, resort) {
    res.json(
      resort
        .slice()
        .sort((a, b) => (a.features <= b.features ? 1 : -1))
        .filter(x => x.features.length >= 3)
    );
  });
});

app.get("/chat", function(req, res) {
  res.render("chat");
});

app.get("/about", function(req, res) {
  res.render("about");
});

//An event listener to listen for client connecting to our server
io.on("connection", function(socket) {
  console.log("NEW connection");

  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", function() {
    console.log("User has disconnected");
  });
});

app.get("/reviews", function(req, res) {
  Reviews.find({}, function(err, review) {
    res.render("reviews", {
      data: review
    });
  });
});
app.get("api/getreviews", function(req, res) {
  Reviews.find({}, function(err, review) {
    if (err) throw err;
    res.json(review);
  });
});
app.get("/addreview", function(req, res) {
  res.render("addreview");
});
app.post("/addreview", function(req, res) {
  let body = req.body;

  body.name = validator.stripLow(body.name);
  body.comments = validator.stripLow(body.comments);
  if (parseFloat(body.rating) == 5) body.rating = 5.0;
  else body.rating = (parseFloat(body.rating) % 5).toFixed(2);

  Reviews.create(body, function(err, review) {
    if (err) return console.error(err);
    res.redirect("/reviews");
  });
});
app.post("/api/addreview", function(req, res) {
  let body = req.body;

  body.name = validator.stripLow(body.name);
  body.comments = validator.stripLow(body.comments);
  if (parseFloat(body.rating) == 5) body.rating = 5.0;
  else body.rating = (parseFloat(body.rating) % 5).toFixed(2);
  Reviews.create(body, function(err, review) {
    if (err) return console.error(err);
    res.send(review);
  });
});
app.get("/api/getreviews", function(req, res) {
  Reviews.find({}, function(err, rev) {
    if (err) throw err;
    res.json(rev);
  });
});

app.get("/addresort", function(req, res) {
  res.render("addresort");
});
app.post("/addresort", function(req, res) {
  let body = req.body;

  body.name = validator.stripLow(body.name);
  body.features = body.features.split(", ");
  if (parseFloat(body.rating) == 5) body.rating = 5.0;
  else body.rating = (parseFloat(body.rating) % 5).toFixed(2);
  body.year_opened = parseInt(body.year_opened);

  Resorts.create(body, function(err, resort) {
    if (err) return console.error(err);
    res.redirect("/");
  });
});
app.post("/api/addresort", function(req, res) {
  let body = req.body;

  body.name = validator.stripLow(body.name);
  body.features = body.features.split(", ");
  if (parseFloat(body.rating) == 5) body.rating = 5.0;
  else body.rating = (parseFloat(body.rating) % 5).toFixed(2);
  body.year_opened = parseInt(body.year_opened);

  Resorts.create(body, function(err, resort) {
    if (err) return console.error(err);
    res.send(resort);
  });
});

app.post("/chat", function(req, res) {
  var name = req.body.name;
  var message = req.body.message;

  var message = new Messages({
    message: validator.stripLow(message),
    name: validator.stripLow(name),
    timestamp: new Date()
  });

  Messages.create(message, function(err) {
    if (err) throw err;
    io.emit("new message", message);
    return res.send(message);
  });
});
app.get("/api/getmessages", function(req, res) {
  Messages.find({}, function(err, mes) {
    if (err) throw err;
    res.json(mes);
  });
});
app.get("/oldmessages", function(req, res) {
  Messages.find({}, function(err, mes) {
    res.render("oldmessages", {
      data: mes.reverse()
    });
  });
});

app.post("/api/chat", function(req, res) {
  let body = req.body;
  body.timestamp = new Date();
  body.message = validator.stripLow(message);
  body.name = validator.stripLow(name);
  Messages.create(body, function(err, message) {
    if (err) return console.error(err);
    res.send(message);
  });
});

app.delete("/api/deletereview", function(req, res) {
  // deletes a review by poster name, case sensitive
  Reviews.deleteOne({ name: req.body.name }, function(err) {
    if (err) return console.error(err);
    res.send("done");
  });
});

app.delete("/api/deleteresort", function(req, res) {
  // deletes a resort by name, case sensitive
  Resorts.deleteOne({ name: req.body.name }, function(err) {
    if (err) return console.error(err);
    res.send("done");
  });
});

http.listen(PORT, function() {
  console.log("Listening on port " + PORT);
});
