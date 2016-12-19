import Ember from 'ember';
import {pluralize} from 'ember-inflector';

const {Logger, 
      String: S} = Ember;

function subscribeSSE(appInstance, eventType, supportJsonApi) {
   let sseService = appInstance.lookup('service:event-sse');
   let store = appInstance.lookup('service:store');
   let pluralized = S.camelize( pluralize(eventType) );

   sseService.subscribe(`/subscribe/${pluralized}`, eventType, (message) => {
     let data = JSON.parse(message.data);

     let normalized;
     if(supportJsonApi) {
       normalized = data;
     } else {
       let modelClass = store.modelFor(eventType);
       let serializer = store.serializerFor(eventType);
       normalized =  serializer.normalizeSingleResponse(store, modelClass, data);
     }
     store.push(normalized);
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
    let message = "Missing Section in Environment configuration under APP. Please specify the subscriptions under APP. Use key 'event-sse':[{}]"; 
    Logger.warn(message);
    notifier.alert(message);
    return;
  } else {
    eventSSEConfig.forEach((eventDefinition) => {
      let event = eventDefinition.eventName;
      let eventType = eventDefinition.eventType;
      let supportJsonApi = eventDefinition.supportJsonApi;
      switch (eventType) {
        case "update":
          if(typeof supportJsonApi === "undefined") {
            supportJsonApi = false;
          }
          subscribeSSE(appInstance, event, supportJsonApi);
      }
    });
  }
}

export default {
  name: 'event-sse',
  initialize
};