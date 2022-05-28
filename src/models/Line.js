class Line {
  static getAll() {
    return [
      {
        name: "Bakerloo Line",
        shortName: "Bakerloo",
        urlKey: "bakerloo-line",
        tflKey: "bakerloo",
        displayOrder: 1,
      },
      {
        name: "Central Line",
        shortName: "Central",
        urlKey: "central-line",
        tflKey: "central",
        displayOrder: 2,
      },
      {
        name: "Circle Line",
        shortName: "Circle",
        urlKey: "circle-line",
        tflKey: "circle",
        displayOrder: 3,
      },
      {
        name: "District Line",
        shortName: "District",
        urlKey: "district-line",
        tflKey: "district",
        displayOrder: 4,
      },
      {
        name: "Hammersmith \u0026 City Line",
        shortName: "Hammersmith \u0026 City",
        urlKey: "hammersmith-city-line",
        tflKey: "hammersmith-city",
        displayOrder: 5,
      },
      {
        name: "Jubilee Line",
        shortName: "Jubilee",
        urlKey: "jubilee-line",
        tflKey: "jubilee",
        displayOrder: 6,
      },
      {
        name: "Metropolitan Line",
        shortName: "Metropolitan",
        urlKey: "metropolitan-line",
        tflKey: "metropolitan",
        displayOrder: 7,
      },
      {
        name: "Northern Line",
        shortName: "Northern",
        urlKey: "northern-line",
        tflKey: "northern",
        displayOrder: 8,
      },
      {
        name: "Piccadilly Line",
        shortName: "Piccadilly",
        urlKey: "piccadilly-line",
        tflKey: "piccadilly",
        displayOrder: 9,
      },
      {
        name: "Victoria Line",
        shortName: "Victoria",
        urlKey: "victoria-line",
        tflKey: "victoria",
        displayOrder: 10,
      },
      {
        name: "Waterloo \u0026 City Line",
        shortName: "Waterloo \u0026 City",
        urlKey: "waterloo-city-line",
        tflKey: "waterloo-city",
        displayOrder: 11,
      },
      {
        name: "Elizabeth Line",
        shortName: "Elizabeth",
        urlKey: "elizabeth-line",
        tflKey: "elizabeth",
        displayOrder: 12,
      },
      {
        name: "London Overground",
        shortName: "London Overground",
        urlKey: "london-overground",
        tflKey: "london-overground",
        displayOrder: 13,
      },
      {
        name: "DLR",
        shortName: "DLR",
        urlKey: "dlr",
        tflKey: "dlr",
        displayOrder: 14,
      },
    ];
  }

  static getSeverities() {
    return {
      1: {
        title: "Closed",
        disrupted: true,
        displayOrder: 1,
      },
      2: {
        title: "Suspended",
        disrupted: true,
        displayOrder: 1,
      },
      3: {
        title: "Part Suspended",
        disrupted: true,
        displayOrder: 1,
      },
      4: {
        title: "Planned Closure",
        disrupted: true,
        displayOrder: 1,
      },
      5: {
        title: "Part Closure",
        disrupted: true,
        displayOrder: 1,
      },
      6: {
        title: "Severe Delays",
        disrupted: true,
        displayOrder: 5,
      },
      7: {
        title: "Reduced Service",
        disrupted: true,
        displayOrder: 5,
      },
      8: {
        title: "Bus Service",
        disrupted: true,
        displayOrder: 5,
      },
      9: {
        title: "Minor Delays",
        disrupted: true,
        displayOrder: 10,
      },
      10: {
        title: "Good Service",
        disrupted: false,
        displayOrder: 100,
      },
      11: {
        title: "Part Closed",
        disrupted: true,
        displayOrder: 5,
      },
      12: {
        title: "Exist Only",
        disrupted: true,
        displayOrder: 20,
      },
      13: {
        title: "No Step Free Access",
        disrupted: true,
        displayOrder: 20,
      },
      14: {
        title: "Change of frequency",
        disrupted: true,
        displayOrder: 20,
      },
      15: {
        title: "Diverted",
        disrupted: true,
        displayOrder: 20,
      },
      16: {
        title: "Not Running",
        disrupted: true,
        displayOrder: 1,
      },
      17: {
        title: "Issues Reported",
        disrupted: true,
        displayOrder: 25,
      },
      18: {
        title: "No Issues",
        disrupted: false,
        displayOrder: 50,
      },
      19: {
        title: "Information",
        disrupted: false,
        displayOrder: 50,
      },
      20: {
        title: "Service Closed",
        disrupted: true,
        displayOrder: 1,
      },
    };
  }
}

module.exports = Line;
