import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export const accounts = [['ajithberlin', 'users'], ['AlphBerlin', 'orgs'], ['bytamilan', 'orgs']];
export function normalize(repo) {
  return { name: repo.name, full_name: repo.full_name, owner: repo.owner.login,
    description: repo.description || '', url: repo.html_url,
    homepage: /^https?:\/\//i.test(repo.homepage || '') ? repo.homepage : '',
    language: repo.language || 'Other', stars: repo.stargazers_count, forks: repo.forks_count,
    fork: repo.fork, archived: repo.archived, updated_at: repo.pushed_at, topics: repo.topics || [] };
}
export async function fetchAccount(account, type, request = fetch) {
  const repos = [];
  for (let page = 1; ; page++) {
    const response = await request(`https://api.github.com/${type}/${account}/repos?type=public&sort=pushed&per_page=100&page=${page}`, {
      headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) throw new Error(`${account}: GitHub returned ${response.status}`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error(`${account}: invalid response`);
    repos.push(...batch.filter(r => r.private === false && r.visibility !== 'private').map(normalize));
    if (batch.length < 100) break;
  }
  return repos;
}
export async function sync() {
  // All accounts must succeed before replacing the checked-in fallback snapshot.
  const repos = (await Promise.all(accounts.map(([a, t]) => fetchAccount(a, t)))).flat();
  const unique = [...new Map(repos.map(r => [r.full_name.toLowerCase(), r])).values()];
  await writeFile(new URL('../src/data/repos.json', import.meta.url), JSON.stringify({ updatedAt: new Date().toISOString(), repos: unique }, null, 2) + '\n');
  console.log(`Synced ${unique.length} public repositories across ${accounts.length} accounts.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await sync();
