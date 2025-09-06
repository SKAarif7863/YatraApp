import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../index.js';

test('GET /api/items should return example list', async () => {
  const res = await request(app).get('/api/items');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
});
