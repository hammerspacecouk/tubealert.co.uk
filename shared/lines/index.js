'use strict';

const LINE_DATA = [
    {
        "name": "Bakerloo Line",
        "shortName": "Bakerloo",
        "urlKey": "bakerloo-line",
        "tflKey": "bakerloo",
        "displayOrder": 1
    },
    {
        "name": "Central Line",
        "shortName": "Central",
        "urlKey": "central-line",
        "tflKey": "central",
        "displayOrder": 2
    }, {
        "name": "Circle Line",
        "shortName": "Circle",
        "urlKey": "circle-line",
        "tflKey": "circle",
        "displayOrder": 3
    }, {
        "name": "District Line",
        "shortName": "District",
        "urlKey": "district-line",
        "tflKey": "district",
        "displayOrder": 4
    }, {
        "name": "Hammersmith \u0026 City Line",
        "shortName": "Hammersmith \u0026 City",
        "urlKey": "hammersmith-city-line",
        "tflKey": "hammersmith-city",
        "displayOrder": 5
    }, {
        "name": "Jubilee Line",
        "shortName": "Jubilee",
        "urlKey": "jubilee-line",
        "tflKey": "jubilee",
        "displayOrder": 6
    }, {
        "name": "Metropolitan Line",
        "shortName": "Metropolitan",
        "urlKey": "metropolitan-line",
        "tflKey": "metropolitan",
        "displayOrder": 7
    }, {
        "name": "Northern Line",
        "shortName": "Northern",
        "urlKey": "northern-line",
        "tflKey": "northern",
        "displayOrder": 8
    }, {
        "name": "Piccadilly Line",
        "shortName": "Piccadilly",
        "urlKey": "piccadilly-line",
        "tflKey": "piccadilly",
        "displayOrder": 9
    }, {
        "name": "Victoria Line",
        "shortName": "Victoria",
        "urlKey": "victoria-line",
        "tflKey": "victoria",
        "displayOrder": 10
    }, {
        "name": "Waterloo \u0026 City Line",
        "shortName": "Waterloo \u0026 City",
        "urlKey": "waterloo-city-line",
        "tflKey": "waterloo-city",
        "displayOrder": 11
    }, {
        "name": "DLR",
        "shortName": "DLR",
        "urlKey": "dlr",
        "tflKey": "dlr",
        "displayOrder": 12
    }, {
        "name": "London Overground",
        "shortName": "London Overground",
        "urlKey": "london-overground",
        "tflKey": "london-overground",
        "displayOrder": 13
    }, {
        "name": "TFL Rail",
        "shortName": "TFL Rail",
        "urlKey": "tfl-rail",
        "tflKey": "tfl-rail",
        "displayOrder": 14
    }
];

const STATUS_SEVERITIES_DATA = [
    {
        'title': 'Closed',
        'disrupted': true,
        'displayOrder': 1
    },
    {
        'title': 'Suspended',
        'disrupted': true,
        'displayOrder': 1
    },
    {
        'title': 'Part Suspended',
        'disrupted': true,
        'displayOrder': 1
    },
    {
        'title': 'Planned Closure',
        'disrupted': true,
        'displayOrder': 1
    },
    {
        'title': 'Part Closure',
        'disrupted': true,
        'displayOrder': 1
    },
    {
        'title': 'Severe Delays',
        'disrupted': true,
        'displayOrder': 5
    },
    {
        'title': 'Reduced Service',
        'disrupted': true,
        'displayOrder': 5
    },
    {
        'title': 'Bus Service',
        'disrupted': true,
        'displayOrder': 5
    },
    {
        'title': 'Minor Delays',
        'disrupted': true,
            'displayOrder': 10
    },
    {
        'title': 'Good Service',
        'disrupted': false,
        'displayOrder': 100
    },
    {
        'title': 'Part Closed',
        'disrupted': true,
        'displayOrder': 5
    },
    {
        'title': 'Exist Only',
        'disrupted': true,
        'displayOrder': 20
    },
    {
        'title': 'No Step Free Access',
        'disrupted': true,
        'displayOrder': 20
    },
    {
        'title': 'Change of frequency',
        'disrupted': true,
        'displayOrder': 20
    },
    {
        'title': 'Diverted',
        'disrupted': true,
        'displayOrder': 20
    },
    {
        'title': 'Not Running',
        'disrupted': true,
        'displayOrder': 1
    },
    {
        'title': 'Issues Reported',
        'disrupted': true,
        'displayOrder': 25
    },
    {
        'title': 'No Issues',
        'disrupted': false,
        'displayOrder': 50
    },
    {
        'title': 'Information',
        'disrupted': false,
        'displayOrder': 50
    },
    {
        'title': 'Service Closed',
        'disrupted': true,
        'displayOrder': 1
    }
];

exports.all = () => LINE_DATA;
exports.severities = () => STATUS_SEVERITIES_DATA;
