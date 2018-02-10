const predictionData = [{
  "category": "NBA",
  "events": [{
    "name": "Sacramento Kings @ Philadelphia 76ers",
    "id": 120932,
    "time": "2017-12-19T18:00:00Z",
    "lines": [{
      "type": "total",
      "choice": "over",
      "number": 207.0,
      "odds": 1.87,
      "provider": "Bovada"
    }, {
      "type": "moneyline",
      "choice": "Philadelphia 76ers",
      "number": 0,
      "odds": 1.27,
      "provider": "Unibet"
    }]
  }]
},
  {
    "category": "NHL",
    "events": [{
      "name": "Los Angeles Kings @ Anaheim Ducks",
      "id": 120420,
      "time": "2017-12-19T22:00:00Z",
      "lines": [{
        "type": "total",
        "choice": "under",
        "number": 6.0,
        "odds": 1.91,
        "provider": "Bovada"
      }, {
        "type": "spread",
        "choice": "Los Angeles Kings",
        "number": 1.5,
        "odds": 1.42,
        "provider": "Unibet"
      }]
    }, ]
  }
];

export default predictionData;
