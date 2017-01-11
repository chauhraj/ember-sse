# Ember SSE(Server Sent Event)

[![Build Status](https://travis-ci.org/chauhraj/ember-sse.svg?branch=master)](https://travis-ci.org/chauhraj/ember-sse)
[![EmberJS](https://img.shields.io/badge/emberjs-2.10.0-orange.svg)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This addon enables the ability to interact with [Server Sent Events](https://www.html5rocks.com/en/tutorials/eventsource/basics/) in Emberjs APPs. In most of the applications, 
the applications mostly require push updates or notifications, then in such cases, SSE makes more sense. 
The add on adds SSE as a service named as `event-sse`. All the SSE can be configured through the configuration
defined in `environment.js` of the application itself. 

```json
APP: {
    'event-sse': {
        origin: <optional url if reading SSE from external host/origin> // eg: http://my-machine:8000
        configuration: [{
             // allows to override origin per SSE/event type basis
            origin: <same as above>

            // eventName defines the event type one is interested in. Lets say, interested in getting updates
            // on stock quotes, then eventName would be Quote or quote. This would result in subscribing SSE on url
            // http://<origin>/subscribe/quotes. Note, addon itself pluralizes the eventType to `quotes`
            eventName: <identifier for events interested in> // for eg, Quote

            // event type indicates if this SSE is some important update or just plain notification. Currently
            // supports only two values update|notification. In case of 'update', it will try to push the
            // update in the Ember data store and in the case of notification, it will just publish the SSE as
            // the notification.

            eventType: 'update' // for eg

            // If the SSE supports JSON API. Be default, it is false.
            supportJsonApi: false //
        }]
    }
}
```

This README outlines the details of collaborating on this Ember addon.

## Installation

### Development Version
* `git clone <repository-url>` this repository
* `cd ember-sse && npm install && bower install`
* Execute, `npm link` in directory `ember-sse` and then in the root project, execute `npm link ember-sse`

### Prodution Version
* Work in Progress.
* Though it should be as simple as executing `ember install ember-sse`

## Running Tests

> Still learning Ember. Still need to write tests. Becomes difficult to test something like EventSource.

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
