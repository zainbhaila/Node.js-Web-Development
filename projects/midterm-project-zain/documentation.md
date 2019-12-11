
# Ski Resorts

---

Name: Zain Bhaila

Date: 11/01/2019

Project Topic: Ski Resorts

URL: https://ancient-gorge-09392.herokuapp.com/

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     Name         `Type: String`
- `Field 2`:     Rating       `Type: Float`
- `Field 3`:     Location     `Type: String`
- `Field 4`:     Year Opened  `Type: Integer`
- `Field 5`:     Features     `Type: [String]`

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

### 2. Add New Data

HTML form route: `/addresort`

POST endpoint route: `/api/addresort`

Example Node.js POST request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/addresort',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        name: 'Materhorn',
        location: 'Europe',
        rating: 4.7,
        year_opened: 1940,
        features: ["lodge", "guides"]
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getresorts`

### 4. Search Data

Search Field: name

### 5. Navigation Pages

Navigation Filters
1. Alphabetical -> `  /alphabetical  `
2. Oldest -> `  /oldest  `
3. East Coast -> `  /eastcoast  `
4. Highest Rated -> `  /rating  `
5. Most Features -> `  /featurecount  `
