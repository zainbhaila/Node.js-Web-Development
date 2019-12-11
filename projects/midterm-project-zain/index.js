var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var dataUtil = require("./data-util");
var logger = require('morgan');
var exphbs = require('express-handlebars');
var handlebars = exphbs.handlebars;
var app = express();
var PORT = process.env.PORT || 3000;

var _DATA = dataUtil.loadData().ski_resorts;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

app.get('/',function(req,res){
  res.render('home',{
    data: _DATA
  });
})
app.get("/api/getresorts", function(req, res) {
    res.json(dataUtil.loadData());
});
app.get('/alphabetical',function(req,res){
  data = _DATA.slice().sort((a,b) => (a.name >= b.name) ? 1 : -1)
  res.render('alphabetical',{
    data: data
  });
})
app.get("/api/alphabetical", function(req, res) {
    res.json(_DATA.slice().sort((a,b) => (a.name >= b.name) ? 1 : -1));
});
app.get('/eastcoast',function(req,res){
  data = _DATA.slice().filter(x => x.location == "East Coast")
  res.render('eastcoast',{
    data: data
  });
})
app.get("/api/eastcoast", function(req, res) {
    res.json(_DATA.slice().filter(x => x.location == "East Coast"));
});
app.get('/oldest',function(req,res){
  data = _DATA.slice().sort((a,b) => (a.year_opened >= b.year_opened) ? 1 : -1)
  res.render('oldest',{
    data: data
  });
})
app.get("/api/oldest", function(req, res) {
    res.json(_DATA.slice().sort((a,b) => (a.year_opened >= b.year_opened) ? 1 : -1));
});
app.get('/rating',function(req,res){
  data = _DATA.slice().sort((a,b) => (a.rating <= b.rating) ? 1 : -1).filter(x => x.rating>3.5)
  res.render('rating',{
    data: data
  });
})
app.get("/api/rating", function(req, res) {
    res.json(_DATA.slice().sort((a,b) => (a.rating <= b.rating) ? 1 : -1).filter(x => x.rating>3.5));
});
app.get('/featurecount',function(req,res){
  data = _DATA.slice().sort((a,b) => (a.features <= b.features) ? 1 : -1).filter(x => x.features.length >= 3)
  res.render('features',{
    data: data
  });
})
app.get("/api/featurecount", function(req, res) {
    res.json(_DATA.slice().sort((a,b) => (a.features <= b.features) ? 1 : -1).filter(x => x.features.length >= 3));
});

app.get('/addresort',function(req,res){
  res.render('addresort');
})
app.post('/addresort', function(req, res) {
    let body = req.body;

    body.features = body.features.split(", ");
    body.rating = (parseFloat(body.rating)%5).toFixed(1)
    body.year_opened = parseInt(body.year_opened)

    _DATA.push(body);
    dataUtil.saveData(_DATA);
    res.redirect("/");
});
app.post('/api/addresort', function(req, res) {
    let body = req.body;

    body.features = body.features.split(", ");
    body.rating = (parseFloat(body.rating)%5).toFixed(1)
    body.year_opened = parseInt(body.year_opened)

    _DATA.push(body);
    dataUtil.saveData(_DATA);
    res.send(_DATA);
});

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT);
});
