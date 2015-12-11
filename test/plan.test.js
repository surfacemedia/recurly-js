import assert from 'assert';
import {Recurly} from '../lib/recurly';
import helpers from './support/helpers';

helpers.apiTest(function (requestMethod) {
  describe('Recurly.plan (' + requestMethod + ')', function () {
    const valid = 'basic';
    const invalid = 'invalid';
    let recurly;

    beforeEach(function () {
      recurly = new Recurly;
      recurly.configure({
        publicKey: 'test',
        api: '//' + window.location.host,
        cors: requestMethod === 'cors'
      });
    });

    it('requires a callback', function () {
      try {
        recurly.plan(valid);
      } catch (e) {
        assert(~e.message.indexOf('callback'));
      }
    });

    it('requires Recurly.configure', function () {
      try {
        recurly = new Recurly();
        recurly.plan(valid, () => {});
      } catch (e) {
        assert(~e.message.indexOf('configure'));
      }
    });

    describe('when given an invalid plan', function () {
      it('produces an error', function (done) {
        recurly.plan(invalid, function (err, plan) {
          assert(err);
          assert(!plan);
          done();
        });
      });
    });

    describe('when given a valid plan', function () {
      it('yields a plan', function (done) {
        recurly.plan(valid, function (err, plan) {
          assert(!err);
          assert(plan);
          assert(plan.code === 'basic');
          assert(plan.name === 'Basic');
          assert(plan.period);
          assert(plan.price);
          assert(plan.accepted_card_types);
          assert(typeof plan.tax_exempt === 'boolean');
          done();
        });
      });
    });
  });
});
