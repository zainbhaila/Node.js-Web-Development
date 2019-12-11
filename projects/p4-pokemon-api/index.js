var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json.
// Leave this here if you want to restore the original dataset
// and reverse the edits you made.
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state
// after you restart your server.
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable.
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    let contents = "";
    _.each(_DATA, function(i) {
        contents += `<tr><td>${i.id}</td><td><a href="/pokemon/${i.id}">${i.name}</a></td></tr>\n`;
    })
    let html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    let _id = parseInt(req.params.pokemon_id);
    let result = _.findWhere(_DATA, {id: _id})
    if (!result) return res.json("Error: Pokemon not found");

    let contents = "";
    for (let i in result) {
        contents += `<tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;
    }
    let html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    let _id = parseInt(req.params.pokemon_id);
    let result = _.findWhere(_DATA, {id: _id})
    if (!result) return res.json("Error: Pokemon not found");

    let html = `<html>\n<body>\n<img src=${result.img}>\n</body>\n</html>`
    res.send(html);
});

app.get("/api/id/:pokemon_id", function(req, res) {
    let _id = parseInt(req.params.pokemon_id);
    let result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
      let _name = req.params.pokemon_name;
      let result = _.findWhere(_DATA, { name: _name })
      if (!result) return res.json([]);
      let _prev = []
      let _next = []

      if (result.prev_evolution) {
        for (let poke of result.prev_evolution) {
          _prev.push(poke.name)
        }
      }
      if (result.next_evolution) {
        for (let poke of result.next_evolution) {
          _next.push(poke.name)
        }
      }

      res.json(_prev.concat([_name]).concat(_next))
});

app.get("/api/type/:type", function(req, res) {
  let _type = req.params.type;

  let filter = _.filter(_DATA, function(poke) {
        return poke.type.includes(_type)
  });

  let result = []
  for (let poke of filter) {
    result.push(poke.name)
  }

  res.send(result);
});

app.get("/api/type/:type/heaviest", function(req, res) {
  let _type = req.params.type;

  let filter = _.filter(_DATA, function(poke) {
        return poke.type.includes(_type)
  });

  let max = {}
  for (let poke of filter) {
    if (max.weight === undefined || parseInt(poke.weight.split(" ")[0]) > max.weight) {
      max.name = poke.name
      max.weight = parseInt(poke.weight.split(" ")[0])
    }
  }

  res.send(max);
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    let _name = req.params.pokemon_name
    let _weakness = req.params.weakness_name
    let result = _.findWhere(_DATA, {name: _name})
    if (!result) return res.json({})

    if(!result.weaknesses.includes(_weakness)) {
        result.weaknesses.push(_weakness)
    }
    let loc = _.indexOf(_DATA, result);
    _DATA[loc] = result;
    let retVal = {name: result.name, weaknesses: result.weaknesses};
    pokeDataUtil.saveData(_DATA);

    res.send(retVal);
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    let _name = req.params.pokemon_name
    let _weakness = req.params.weakness_name
    let result = _.findWhere(_DATA, {name: _name})
    if (!result) return res.json({})

    if(result.weaknesses.includes(_weakness)) {
        result.weaknesses = result.weaknesses.filter(function(weak) {
          return weak != _weakness
        })
    }
    let loc = _.indexOf(_DATA, result);
    _DATA[loc] = result;
    let retVal = {name: result.name, weaknesses: result.weaknesses};
    pokeDataUtil.saveData(_DATA);

    res.send(retVal);
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
