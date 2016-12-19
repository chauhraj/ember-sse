import Ember from 'ember';

const {Logger: logger, 
       Map: M
      } = Ember;

function callbackWhenEventSourceOpened(es) {
    logger.info(`EventSource: ${es.url} opened for event-type ${es.eventType}`);
    let f = function closure() {

    };
    return f;
}

export default Ember.Service.extend({
    
    events: M.create(),

    subscribe(url, eventType, handler) {
     let eventSource = new EventSource(url);
     eventSource.eventType = eventType;
     logger.info(`Subscribing to event of type ${eventType}`);

     eventSource.onopen = callbackWhenEventSourceOpened(eventSource);
     eventSource.addEventListener(eventType, handler, false);
     this.get('events').set(eventType, eventSource);   
    },

    unsubscribe(eventType) {
        let eventSource = this.get('events').get(eventType);
        if(eventSource === undefined) {
            logger.warn(`No subscription found for EventType: ${eventType}`);
        } else {
            eventSource.close();
            logger.info(`Closed subscription for event-type: ${eventType}`);
        }
    },

    stop() {
        this.get('events').forEach((eventType, es) => {
            logger.info(`No more listening of ${eventType}`);
            es.close();
        });
    }
});
