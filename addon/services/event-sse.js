import Ember from 'ember';

const {Logger: logger, 
       Map: M
      } = Ember;

function registerHandlers(es, notifier, handler) {
    logger.info(`EventSource: ${es.url} opened for event-type ${es.eventType}`);
    es.onopen = function(open) {
        logger.info(`Received ${open} event`);
    };
    es.onerror = (error) => {
        logger.info(`Received error event ${error}`);
        notifier.alert(`Please verify if the service is running at ${es.url}`);
        // es.close();
    };
    es.addEventListener(es.eventType, handler, false);
}

export default Ember.Service.extend({
    
    events: M.create(),

    notify: Ember.inject.service(),

    subscribe(url, eventType, handler) {
     let eventSource = new EventSource(url, {withCredentials: true});
     eventSource.eventType = eventType;
     logger.info(`Subscribing to event of type ${eventType}`);

     registerHandlers(eventSource, this.get('notify'), handler);
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
