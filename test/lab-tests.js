const assert = require('assert');
const couchbase = require('couchbase');
const { couchbaseConnect } = require('../app/repository/connectionManager');

describe('Lab3-test', function() {

    describe ('Test Connection to Couchbase ', function() {
      it('should return a connection', async function() {
        const cluster = await couchbaseConnect();
        assert(cluster, 'Failed to connect');
        const pingResult = cluster.ping();
        assert((await pingResult).id, "Connection is not responding");
        cluster.close();
      });
    });
  });
