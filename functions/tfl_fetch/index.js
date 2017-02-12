'use strict';

const AWS = require('aws-sdk');
const HTTPS = require('https');
const Lines = require('lines');
const now = new Date();

function fetcher() {}

fetcher.handler = (event, context, callback) => {
    console.info('Setting ENV variables');

    const TFL_APP_ID = process.env.TFL_APP_ID;
    const TFL_APP_KEY = process.env.TFL_APP_KEY;
    const TFL_HOST = 'api.tfl.gov.uk';
    const TFL_PATH = '/Line/Mode/tube,dlr,tflrail,overground/Status' +
        '?app_id=' + TFL_APP_ID +
        '&app_key=' + TFL_APP_KEY;

    console.info("Fetching from TFL");
    HTTPS.get({
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
    console.error(e);
    callback(e.message);
};

fetcher.handleData = (data, callback) => {
    // work through all of the lines we want in order
    // and build up a JSON object of their statuses
    console.info("Manipulating result into preferred format");
    const statusData = Lines.all().map((lineData) => {
        const lineStatus = data.find((status) => {
            return status.id === lineData.tflKey;
        });

        return fetcher.addStatusData(lineData, lineStatus);
    });

    // we now have the statusData in the format we want.
    // now we have to store it on S3
    fetcher.store(statusData, callback);

};

fetcher.store = (data, callback) => {
    const s3 = new AWS.S3();
    const params = {
        'Bucket': 'tubealert.co.uk',
        'Key': 'all.json',
        'Body': JSON.stringify(data),
        'ContentType' : 'application/json',
        'CacheControl' : 'public, max-age=120'
    };
    console.info("Uploading to S3");
    s3.upload(params, (err) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        callback(null, "Complete");
    });
};

fetcher.addStatusData = (lineData, lineStatus) => {
    // set some defaults
    delete lineData.tflKey;
    lineData.isDisrupted = null;
    lineData.updatedAt = now.toISOString();
    lineData.statusSummary = "No Information";
    lineData.latestStatus = {
        updatedAt : now.toISOString(),
        isDisrupted : null,
        title : "No Information",
        shortTitle : "No Information",
        descriptions : null
    };

    if (lineStatus) {
        const severities = Lines.severities();
        const sortedStatuses = lineStatus.lineStatuses.sort((a, b) => {
            return severities[a.statusSeverity-1].displayOrder - severities[b.statusSeverity-1].displayOrder;
        });

        // get sorted titles and reasons, ensuring unique values
        const titles = sortedStatuses.map((s) => {
           return s.statusSeverityDescription;
        }).filter((value, index, self) => { return (self.indexOf(value) === index) });
        const reasons = sortedStatuses.map((s) => {
            return s.reason || null;
        }).filter((value, index, self) => { return (value !== null && self.indexOf(value) === index) });

        lineData.latestStatus.isDisrupted = sortedStatuses.reduce((value, status) => {
            if (severities[status.statusSeverity-1].disrupted) {
                value = true;
            }
            return value;
        }, false);
        lineData.latestStatus.title = titles.join(', ');
        lineData.latestStatus.shortTitle = titles.slice(0, 2).join(', ');
        lineData.latestStatus.descriptions = reasons;

        lineData.isDisrupted = lineData.latestStatus.isDisrupted;
        lineData.statusSummary = lineData.latestStatus.shortTitle;
    }

    return lineData;
};

exports.handler = fetcher.handler;