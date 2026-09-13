import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAccount, normalize } from './sync-github.mjs';
const repo = { name: 'demo', full_name: 'owner/demo', owner: {login:'owner'}, private: false, html_url: 'https://github.com/owner/demo', homepage: 'javascript:alert(1)' };
test('paginates, excludes private repositories, and rejects unsafe homepage URLs', async () => {
  let calls = 0;
  const result = await fetchAccount('owner', 'orgs', async () => ({ ok:true, json: async () => ++calls === 1 ? Array.from({length:100}, (_, i) => ({...repo, private:i===0})) : [repo] }));
  assert.equal(calls, 2); assert.equal(result.length, 100); assert.equal(normalize(repo).homepage, '');
});
test('fails on API errors instead of publishing an empty account', async () => {
  await assert.rejects(fetchAccount('owner', 'users', async () => ({ok:false, status:403})), /403/);
});
