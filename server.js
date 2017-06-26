var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()

mongoose.connect('mongodb://localhost/simpletest');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String}
});
var User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/user', function (req, res) {
  User.find({}, function(err, users){
    if(err){
      res.send('Something went really wrong');
      next();
    }
    res.json(users);
  });
})

app.get('/user/:id', function (req, res) {
    User.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).end();
            }
            return res.status(200).json(doc);
    })
    .catch(err=>next(err));git
})


app.post('/user', function (req, res) {
  var user = new User(req.body);
  user.save(function(err, user){
    res.json(user);
  });
})

app.put('/user/:id', function (req, res) {
    var conditions ={ _id : req.params.id}
    User.update(conditions,req.body)
        .then(doc=>{
            if(!doc){ return res.status(404).end(); }
            return res.status(200).json(doc);
    })
    .catch(err => next(err));
})

app.delete('/user/:id', function (req, res) {
  User
      .findByIdAndRemove(req.params.id)
      .exec()
      .then(doc => {
        if (!doc) { return res.status(404).end(); }
        return res.status(204).end();
      })
    .catch(err => next(err));
})