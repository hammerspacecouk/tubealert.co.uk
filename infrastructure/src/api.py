from troposphere import Ref, Template, Parameter, Output, Join, GetAtt, ImportValue
from troposphere.apigateway import RestApi, Method
from troposphere.apigateway import Resource, MethodResponse
from troposphere.apigateway import Integration, IntegrationResponse
from troposphere.apigateway import Deployment, QuotaSettings, ThrottleSettings
from troposphere.apigateway import ApiKey, StageKey, UsagePlan, ApiStage
from troposphere import awslambda



'''
Create OPTIONS method
Add 200 Method Response with Empty Response Model to OPTIONS method
Add Mock Integration to OPTIONS method
Add 200 Integration Response to OPTIONS method
Add Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin Method Response Headers to OPTIONS method
Add Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin Integration Response Header Mappings to OPTIONS method
Add Access-Control-Allow-Origin Method Response Header to POST method
Add Access-Control-Allow-Origin Integration Response Header Mapping to POST method
'''

t = Template()
t.add_description('API Gateway as proxy to lambda functions (subscribe, unsubscribe)')
t.add_version('2010-09-09')

SubscribeLambdaArn = t.add_parameter(Parameter(
    "SubscribeLambdaArn",
    Type="String",
    Description="The name of Lambda Function for subscribing",
))

# Create the Api Gateway
rest_api = t.add_resource(RestApi(
    "TubeAlertApi",
    Name="TubeAlertApi"
))

# Create a resource to map the lambda function to
resource = t.add_resource(Resource(
    "TubeAlertApiSubscribeResource",
    RestApiId=Ref(rest_api),
    PathPart="subscribe",
    ParentId=GetAtt("TubeAlertApi", "RootResourceId")
))

# Create a Lambda API method for the Lambda resource
method = t.add_resource(Method(
    "LambdaMethod",
    RestApiId=Ref(rest_api),
    ApiKeyRequired=False,
    AuthorizationType="NONE",
    ResourceId=Ref(resource),
    HttpMethod="POST",
    Integration=Integration(
        Type="AWS_PROXY",
        IntegrationHttpMethod="POST",
        Uri=Join("", [
            "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/",
            Ref(SubscribeLambdaArn),
            "/invocations"
        ])
    ),
    MethodResponses=[
        MethodResponse(
            "CatResponse",
            StatusCode='200',
            ResponseParameters={
                "method.response.header.Set-Cookie": False,
                "method.response.header.Access-Control-Allow-Credentials": False,
                "method.response.header.Access-Control-Allow-Origin": False
            }
        )
    ]
))

# Create a deployment
deployment = t.add_resource(Deployment(
    "Deployment",
    DependsOn="LambdaMethod",
    RestApiId=Ref(rest_api),
    StageName="prod"
))

# Make sure this can trigger lambda
t.add_resource(awslambda.Permission(
    "APILambdaPermission",
    Action="lambda:InvokeFunction",
    FunctionName=Ref(SubscribeLambdaArn),
    Principal="apigateway.amazonaws.com",
    SourceArn=Join("", [
        "arn:aws:execute-api:",
        Ref("AWS::Region"),
        ":",
        Ref("AWS::AccountId"),
        ":",
        Ref(rest_api),
        "/*/*/*"
    ])
))

print(t.to_json())