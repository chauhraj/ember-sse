# Ember SSE(Server Sent Event)

[![Build Status](https://travis-ci.org/chauhraj/ember-sse.svg?branch=master)](https://travis-ci.org/chauhraj/ember-sse)
[![EmberJS](https://img.shields.io/badge/emberjs-2.10.0-orange.svg)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This addon enables the ability to add [Server Sent Events](https://www.html5rocks.com/en/tutorials/eventsource/basics/) in Emberjs APPs. The capability is added as a service. The service itself is named as `event-sse`.

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
