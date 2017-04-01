from troposphere import Ref, Template, Parameter, Output, Join, GetAtt, ImportValue
from troposphere.apigateway import RestApi, Method
from troposphere.apigateway import Resource, MethodResponse
from troposphere.apigateway import Integration, IntegrationResponse
from troposphere.apigateway import Deployment, QuotaSettings, ThrottleSettings
from troposphere.apigateway import ApiKey, StageKey, UsagePlan, ApiStage
from troposphere import awslambda

t = Template()
t.add_description('API Gateway as proxy to lambda functions (subscribe, unsubscribe)')
t.add_version('2010-09-09')

SubscribeLambdaArn = t.add_parameter(Parameter(
    "SubscribeLambdaArn",
    Type="String",
    Description="The name of Lambda Function for subscribing",
))
UnsubscribeLambdaArn = t.add_parameter(Parameter(
    "UnsubscribeLambdaArn",
    Type="String",
    Description="The name of Lambda Function for unsubscribing",
))
AllLambdaArn = t.add_parameter(Parameter(
    "AllLambdaArn",
    Type="String",
    Description="The name of Lambda Function for getting the current status of all",
))

# Create the Api Gateway
rest_api = t.add_resource(RestApi(
    "TubeAlertApi",
    Name="TubeAlertApi",
    Description="The API for subscribing and unsubscribing for tubealert.co.uk"
))

# Create a resource to map the lambda function to
subscribe_resource = t.add_resource(Resource(
    "TubeAlertApiSubscribeResource",
    RestApiId=Ref(rest_api),
    PathPart="subscribe",
    ParentId=GetAtt("TubeAlertApi", "RootResourceId")
))
unsubscribe_resource = t.add_resource(Resource(
    "TubeAlertApiUnsubscribeResource",
    RestApiId=Ref(rest_api),
    PathPart="unsubscribe",
    ParentId=GetAtt("TubeAlertApi", "RootResourceId")
))
all_resource = t.add_resource(Resource(
    "TubeAlertApiAllResource",
    RestApiId=Ref(rest_api),
    PathPart="all",
    ParentId=GetAtt("TubeAlertApi", "RootResourceId")
))

# Create Lambda API methods for the Lambda resource
t.add_resource(Method(
    "SubscribePostMethod",
    RestApiId=Ref(rest_api),
    ApiKeyRequired=False,
    AuthorizationType="NONE",
    ResourceId=Ref(subscribe_resource),
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
            StatusCode="200",
            ResponseParameters={
                "method.response.header.Set-Cookie": False,
                "method.response.header.Access-Control-Allow-Credentials": False,
                "method.response.header.Access-Control-Allow-Origin": False
            }
        )
    ]
))

t.add_resource(Method(
    "UnsubscribePostMethod",
    RestApiId=Ref(rest_api),
    ApiKeyRequired=False,
    AuthorizationType="NONE",
    ResourceId=Ref(unsubscribe_resource),
    HttpMethod="POST",
    Integration=Integration(
        Type="AWS_PROXY",
        IntegrationHttpMethod="POST",
        Uri=Join("", [
            "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/",
            Ref(UnsubscribeLambdaArn),
            "/invocations"
        ])
    ),
    MethodResponses=[
        MethodResponse(
            StatusCode="200",
            ResponseParameters={
                "method.response.header.Access-Control-Allow-Origin": True
            }
        )
    ]
))

t.add_resource(Method(
    "AllGetMethod",
    RestApiId=Ref(rest_api),
    ApiKeyRequired=False,
    AuthorizationType="NONE",
    ResourceId=Ref(all_resource),
    HttpMethod="GET",
    Integration=Integration(
        Type="AWS_PROXY",
        IntegrationHttpMethod="POST",
        Uri=Join("", [
            "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/",
            Ref(AllLambdaArn),
            "/invocations"
        ])
    ),
    MethodResponses=[
        MethodResponse(
            StatusCode="200",
            ResponseParameters={
                "method.response.header.Access-Control-Allow-Origin": True
            }
        )
    ]
))

# Create a deployment
deployment = t.add_resource(Deployment(
    "Deployment",
    DependsOn=[
        "SubscribePostMethod",
        "UnsubscribePostMethod",
        "AllGetMethod"
    ],
    RestApiId=Ref(rest_api),
    StageName="prod"
))

# Make sure this can trigger lambda
t.add_resource(awslambda.Permission(
    "SubscribeLambdaPermission",
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

t.add_resource(awslambda.Permission(
    "UnsubscribeLambdaPermission",
    Action="lambda:InvokeFunction",
    FunctionName=Ref(UnsubscribeLambdaArn),
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

t.add_resource(awslambda.Permission(
    "AllLambdaPermission",
    Action="lambda:InvokeFunction",
    FunctionName=Ref(AllLambdaArn),
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
