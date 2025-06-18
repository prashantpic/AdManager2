export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  apiPrefix: process.env.API_PREFIX || 'api/v1/platform-admin',
  // JWT_SECRET: process.env.JWT_SECRET, // Auth guard would use this if JWT validation is handled here
  // Other service URLs if PlatformAdministrationService is a client
});