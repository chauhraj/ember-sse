import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/event-sse';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';

module('Unit | Instance Initializer | event sse', {
  beforeEach() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it fails', function(assert) {
  console.log("Found instance:" + this.appInstance);
  initialize(this.appInstance);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
