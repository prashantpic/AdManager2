// cypress/tasks/index.ts
import * as apiTasks from './apiTasks';
// import * as dbTasks from './dbTasks'; // If you add database tasks

const registerTasks = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  on('task', {
    ...apiTasks,
    // ...dbTasks, // Uncomment if you add dbTasks
    log(message: string | object): null { // Example generic task
      console.log(message);
      return null;
    },
    table(message: any[][]): null { // Example task for logging tables
      console.table(message);
      return null;
    }
  });
  // It's good practice to return the config object
  //  if it's not modified, or the modified version if it is.
  return config;
};

export default registerTasks;