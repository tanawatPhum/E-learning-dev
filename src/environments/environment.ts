// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SERVER_SITE:'https://smartdoc.alworks.io',
  FRONTEND_SITE:'https://smartdoc.alworks.io',
  GET_IMAGE:'/api/getImage/?originalPath='
  // SERVER_SITE:process.env.serverSite || 'http://localhost:3001',
  // FRONTEND_SITE:process.env.frontendSite|| 'http://localhost:4200',
  // GET_IMAGE:process.env.getImage|| '/api/getImage/?originalPath='
  // SERVER_SITE:window["env"]["serverSite"] || 'http://localhost:3001',
  // FRONTEND_SITE:window["env"]["frontendSite"] || 'http://localhost:4200',
  // GET_IMAGE:["env"]["getImage"] || '/api/getImage/?originalPath='
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
