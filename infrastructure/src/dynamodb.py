from troposphere import Output, Parameter, Ref, Template
from troposphere.dynamodb import (KeySchema, AttributeDefinition,
                                  ProvisionedThroughput,GlobalSecondaryIndex,
                                  Projection)
from troposphere.dynamodb import Table

t = Template()
t.add_description("DynamoDB Table for tubealert")

readunits = t.add_parameter(Parameter(
    "ReadCapacityUnits",
    Description="Provisioned read throughput",
    Type="Number",
    Default="5",
    MinValue="1",
    MaxValue="10000",
    ConstraintDescription="should be between 5 and 10000"
))

writeunits = t.add_parameter(Parameter(
    "WriteCapacityUnits",
    Description="Provisioned write throughput",
    Type="Number",
    Default="5",
    MinValue="1",
    MaxValue="10000",
    ConstraintDescription="should be between 5 and 10000"
))

t.add_resource(Table(
    "TubeAlertSubscriptionsTable",
    TableName="tubealert.co.uk_subscriptions",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName="UserID",
            AttributeType="S"
        ),
        AttributeDefinition(
            AttributeName="LineSlot",
            AttributeType="S"
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName="UserID",
            KeyType="HASH"
        ),
        KeySchema(
            AttributeName="LineSlot",
            KeyType="RANGE"
        ),
    ],
    ProvisionedThroughput=ProvisionedThroughput(
        ReadCapacityUnits=Ref(readunits),
        WriteCapacityUnits=Ref(writeunits)
    ),
    GlobalSecondaryIndexes=[
        GlobalSecondaryIndex(
            IndexName="index_lineSlot",
            KeySchema=[
                KeySchema(
                    AttributeName="LineSlot",
                    KeyType="HASH",
                )
            ],
            Projection=Projection(
                ProjectionType="ALL"
            ),
            ProvisionedThroughput=ProvisionedThroughput(
                ReadCapacityUnits=Ref(readunits),
                WriteCapacityUnits=Ref(writeunits)
            )
        )
    ]
))

t.add_resource(Table(
    "TubeAlertStatusesTable",
    TableName="tubealert.co.uk_statuses",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName="TubeDate",
            AttributeType="S"
        ),
        AttributeDefinition(
            AttributeName="Timestamp",
            AttributeType="N"
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName="TubeDate",
            KeyType="HASH"
        ),
        KeySchema(
            AttributeName="Timestamp",
            KeyType="RANGE"
        ),
    ],
    ProvisionedThroughput=ProvisionedThroughput(
        ReadCapacityUnits=Ref(readunits),
        WriteCapacityUnits=Ref(writeunits)
    )
))


print(t.to_json())
