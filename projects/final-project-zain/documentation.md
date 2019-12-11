# Ski Resorts

---

Name: Zain Bhaila and Alex Wallish

Date: 12/06/2019

Project Topic: Skiing

URL: https://final-project-cmsc389k-zain.herokuapp.com/

---

### 1. Data Format and Storage

Data point fields for Resorts:

- `Field 1`: Name `Type: String`
- `Field 2`: Rating `Type: Float`
- `Field 3`: Location `Type: String`
- `Field 4`: Year Opened `Type: Integer`
- `Field 5`: Features `Type: [String]`

Schema:

```javascript
{
  name: String,
  location: String,
  rating: Number,
  year_opened: Number,
  features: [String]
}
```

Data point fields for Reviews:

- `Field 1`: Name `Type: String`
- `Field 2`: Rating `Type: Number`
- `Field 3`: Comments `Type: String`

Schema:

```javascript
{
  name: String,
  comments: String,
  rating: Number
}
```

Data point fields for Messages:

- `Field 1`: Name `Type: String`
- `Field 2`: Message `Type: String`
- `Field 3`: Timestamp `Type: Date`

Schema:

```javascript
{
  name: String,
  message: String,
  timestamp: Number
}
```

### 2. Add New Data API (3 total)

HTML form route: `/addresort`

POST endpoint route: `/api/addresort`

Example Node.js POST request to endpoint:

```javascript
var request = require("request");

var options = {
  method: "POST",
  url: "https://final-project-cmsc389k-zain.herokuapp.com/api/addresort",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  },
  form: {
    name: "Materhorn",
    location: "Europe",
    rating: 4.7,
    year_opened: 1940,
    features: ["lodge", "guides"]
  }
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

HTML form route: `/addreview`

POST endpoint route: `/api/addreview`

Example Node.js POST request to endpoint:

```javascript
var request = require("request");

var options = {
  method: "POST",
  url: "https://final-project-cmsc389k-zain.herokuapp.com/api/addreview",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  },
  form: {
    name: "Alex",
    comments: "great!",
    rating: 4.7
  }
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

HTML form route: `/chat`

POST endpoint route: `/api/chat`

Example Node.js POST request to endpoint:

```javascript
var request = require("request");

var options = {
  method: "POST",
  url: "https://final-project-cmsc389k-zain.herokuapp.com/api/chat",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  },
  form: {
    name: "Zain",
    message: "hi",
    timestamp: new Date()
  }
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data API (7 total)

GET endpoint route: `/api/getresorts`
GET endpoint route: `/api/getreviews`
GET endpoint route: `/api/getmessages`
GET endpoint route: `/api/eastcoast`
GET endpoint route: `/api/alphabetical`
GET endpoint route: `/api/rating`
GET endpoint route: `/api/featurecount`

### 4. Search Data

Search Field: name

### 5. Navigation Pages

1. Alphabetical Resorts -> `/alphabetical`
2. Oldest Resorts -> `/oldest`
3. East Coast Resorts -> `/eastcoast`
4. Highest Rated Resorts -> `/rating`
5. Most Features Resorts -> `/featurecount`
6. Chat (Sockets are Included Here) -> `/chat`
7. Site Reviews -> `/reviews`
8. View All Previous Messages -> `/oldmessages`
9. Add New Resort -> `/addresort`
10. About Page -> `/about`

### 6. New NPM Packages Used

1. validator -> Used to sanitize input strings.
2. prettier -> Used to format our code.

### 7. New Modules Added

1. Messages -> Mongoose schema for messages.
2. Resorts -> Mongoose schema for resorts.
3. Reviews -> Mongoose schema for reviews.

### 8. Delete Data API (2 total)

DELETE endpoint route: `/api/deletereview`

Example Node.js DELETE request to endpoint:

```javascript
var request = require("request");

var options = {
  method: "DELETE",
  url: "https://final-project-cmsc389k-zain.herokuapp.com/api/deletereview",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  },
  form: {
    name: "Zain"
  }
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

DELETE endpoint route: `/api/deleteresort`

Example Node.js DELETE request to endpoint:

```javascript
var request = require("request");

var options = {
  method: "DELETE",
  url: "https://final-project-cmsc389k-zain.herokuapp.com/api/deleteresort",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  },
  form: {
    name: "Roundtop"
  }
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```
