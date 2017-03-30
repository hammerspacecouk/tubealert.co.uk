var params = {
    TableName: 'tubealert.co.uk_subscriptions',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'user_id',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'line_slot',
            KeyType: 'RANGE',
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'user_id',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'line_slot',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2,
    },
    GlobalSecondaryIndexes: [ // optional (list of GlobalSecondaryIndex)
        {
            IndexName: 'index_line',
            KeySchema: [
                { // Required HASH type attribute
                    AttributeName: 'line_slot',
                    KeyType: 'HASH',
                }
            ],
            Projection: { // attributes to project into the index
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: { // throughput to provision to the index
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 2,
            },
        },
    ],
};
dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response

});