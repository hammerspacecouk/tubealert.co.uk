'use strict';

const TubeAlert = require('tubealert');

const createDeleteRequest = item => ({
    DeleteRequest : {
        Key: {
            UserID: item.UserID,
            LineSlot: item.LineSlot
        }
    }
});

exports.handler = (event, context) => {

    const body = JSON.parse(event.body);
    const userID = body.userID;
    let total = 0;
    console.log('Unsubscribing ' + userID);

    TubeAlert.Data.getUserSubscriptions(userID)
        .then(data => {
            const requests = data.map(createDeleteRequest);
            total = requests.length;
            console.log(total + ' items total');
            return requests;
        })
        .then(TubeAlert.Data.batchWrite)
        .then(() => {
            context.succeed({
                "statusCode": 200,
                "headers": {"access-control-allow-origin" : "*"},
                "body": JSON.stringify({status : "ok", removed : total})
            });
        })
        .catch(err => {
            console.error(err);
            context.fail({
                "statusCode": 500,
                "headers": {"access-control-allow-origin" : "*"},
                "body": JSON.stringify({status:"error"})
            });
        });
};
