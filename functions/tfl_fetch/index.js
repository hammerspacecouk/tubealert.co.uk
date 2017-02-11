'use strict';

const https = require('https');
const lines = require('lines');
const now = new Date();

function fetcher() {}

fetcher.handler = (event, context, callback) => {
    console.log('Setting ENV variables');

    const TFL_APP_ID = process.env.TFL_APP_ID;
    const TFL_APP_KEY = process.env.TFL_APP_KEY;
    const TFL_HOST = 'api.tfl.gov.uk';
    const TFL_PATH = '/Line/Mode/tube,dlr,tflrail,overground/Status' +
        '?app_id=' + TFL_APP_ID +
        '&app_key=' + TFL_APP_KEY;

    https.get({
        host: TFL_HOST,
        path: TFL_PATH
    }, (response) => {
        if (response.statusCode !== 200) {
            return callback('Did not receive a 200');
        }
        let body = '';
        response.on('data', (d) => {body += d});
        response.on('end', () => {fetcher.handleData(JSON.parse(body), callback)});
    });
};

fetcher.handleError = (e, callback) => {
    console.log(e);
    callback(e.message);
};

fetcher.handleData = (data, callback) => {
    // work through all of the lines we want in order
    // and build up a JSON object of their statuses
    const statusData = lines.all().map((lineData) => {
        const lineStatus = data.find((status) => {
            return status.id === lineData.tflKey;
        });

        return fetcher.addStatusData(lineData, lineStatus);
    });

    callback(null, statusData);
};

fetcher.addStatusData = (lineData, lineStatus) => {
    // set some defaults
    lineData.isDisrupted = null;
    lineData.statusSummary = "Unknown";
    lineData.latestStatus = {
        updatedAt : now.toISOString(),
        isDisrupted : null,
        title : "Unknown",
        shortTitle : "Unknown",
        descriptions : null
    };

    if (lineStatus) {

    }

    return lineData;
};

exports.handler = fetcher.handler;