import Ember from 'ember';
import {pluralize} from 'ember-inflector';

const {Logger, 
      String: S} = Ember;

function subscribeSSE(appInstance, eventDefinition) {
   let notifier = appInstance.lookup('service:notify');
   let sseService = appInstance.lookup('service:event-sse');
   let store = appInstance.lookup('service:store');

   let eventType = eventDefinition.eventType;
   let pluralized = S.camelize( pluralize(eventDefinition.eventName) );
   let supportJsonApi = eventDefinition.supportJsonApi;

   let url;
   if(typeof eventDefinition.origin === undefined) {
      url = `/subscribe/${pluralized}`;
   } else {
      url = `${eventDefinition.origin}/subscribe/${pluralized}`;
   }
   sseService.subscribe(url, eventDefinition.eventName, (message) => {
     let data = JSON.parse(message.data);
     switch(eventType) {
       case 'update': {
          let offline = eventDefinition.offline === undefined || eventDefinition.offline;
          if(offline) {
            let record = store.createRecord(eventDefinition.eventName, data);
            record.save();
          } else {
            let normalized;
            if(supportJsonApi) {
              normalized = data;
            } else {
              let modelClass = store.modelFor(eventDefinition.eventName);
              let serializer = store.serializerFor(eventDefinition.eventName);
              normalized =  serializer.normalizeSingleResponse(store, modelClass, data);
            }
            store.push(normalized);
          }
          break;
        }
       case 'notification': {
          Logger.warn(message);
          notifier.alert(message);
          return;
       }
     }
   });

}

export function initialize(appInstance) {
  let notifier = appInstance.lookup('service:notify');
  //
  // See this: http://discuss.emberjs.com/t/best-practices-accessing-app-config-from-addon-code/7006/21
  // => to get an instance of Configuration in the addon code.
  // The following commented code doesn't work because config:environment isnt registered as a Singleton. 
  // let ENV = appInstance.lookup('config:environment', {
  //   "instantiate": false
  // });
  let ENV = appInstance.resolveRegistration('config:environment');
  let eventSSEConfig = ENV.APP['event-sse'];
  if(typeof eventSSEConfig === "undefined") {
    let message = "Missing Section in Environment configuration under APP. Please specify the subscriptions under APP. Use key 'event-sse':{ origin: <optional parameter. It can be any url if other than the server>, 'configuration': [{}]}"; 
    Logger.warn(message);
    notifier.alert(message);
    return;
  } else {
    let sseDefaultOrigin = eventSSEConfig.origin;
    eventSSEConfig['configuration'].forEach((eventDefinition) => {
      if(typeof eventDefinition.origin === undefined && sseDefaultOrigin !== undefined) {
        eventDefinition.origin = sseDefaultOrigin;
      }
      subscribeSSE(appInstance, eventDefinition);
    });
  }
}

export default {
  name: 'event-sse',
  initialize
};