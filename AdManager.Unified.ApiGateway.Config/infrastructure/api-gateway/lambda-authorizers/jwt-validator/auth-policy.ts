import { AuthResponse, PolicyDocument, Statement } from 'aws-lambda';

/**
 * Generates an IAM policy document for an API Gateway Lambda authorizer.
 * (3.2.4, REQ-IAM-007)
 *
 * @param principalId The identifier for the user/principal associated with the token.
 * @param effect 'Allow' or 'Deny' access to the resource.
 * @param resource The ARN of the API Gateway resource (method) being accessed. Can be a string or an array of strings.
 * @param context Optional key-value object to be passed to the backend integration (for Request-based authorizers).
 * @returns An AuthResponse object containing the principalId, policyDocument, and optional context.
 */
export const generatePolicy = (
    principalId: string,
    effect: 'Allow' | 'Deny',
    resource: string | string[],
    context?: { [key: string]: string | number | boolean }
): AuthResponse => {
    const policyDocument: PolicyDocument = {
        Version: '2012-10-17', // IAM Policy language version
        Statement: [],
    };

    const resourcesArray = Array.isArray(resource) ? resource : [resource];

    resourcesArray.forEach(res => {
        const statement: Statement = {
            Action: 'execute-api:Invoke', // The action to allow/deny for API Gateway
            Effect: effect,
            Resource: res,
        };
        policyDocument.Statement.push(statement);
    });
    

    const authResponse: AuthResponse = {
        principalId: principalId,
        policyDocument: policyDocument,
    };

    // Context is primarily for REQUEST based authorizers.
    // For TOKEN based authorizers, API Gateway primarily uses principalId and the policy.
    // However, including it doesn't hurt, and some configurations might leverage it.
    if (context) {
        authResponse.context = context;
    }

    console.log('Generated IAM policy:', JSON.stringify(authResponse, null, 2));
    return authResponse;
};