import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const workflow = JSON.parse(readFileSync(new URL('../reddit-business-ideas-from-pain-points-to-google-sheets.json', import.meta.url)));
const nodes = new Map(workflow.nodes.map((node) => [node.name, node]));
const now = Date.parse('2026-10-23T08:00:00Z');
const day = 86400000;
const item = (json) => ({ json });
const row = (id, days, problem = 'Keep repair receipts') => ({
  url: `https://www.reddit.com/r/smallbusiness/comments/${id}/example/`,
  foundAt: new Date(now - days * day).toISOString(),
  problem,
  audience: 'Small landlords',
  title: problem,
  score: '8',
  firstScore: '9',
});
const run = (name, input, refs) => JSON.parse(JSON.stringify(runInNewContext(
  `(function () {\n${nodes.get(name).parameters.jsCode}\n})()`,
  {
    $input: { all: () => input.map(item), first: () => item(input[0]) },
    $: (name) => ({ all: () => refs[name].map(item), first: () => item(refs[name][0]) }),
    $now: { toMillis: () => now, toISODate: () => '2026-10-23' },
    DateTime: { fromISO: (value) => ({ toMillis: () => Date.parse(value) }) },
  },
  { timeout: 1000, filename: name },
)));
const prepare = (current, history) => run('This week and earlier', history, { 'Still good after comments': current })[0].json;
const count = (source, groups) => run('Count and rank trend evidence', [{ output: { groups } }], { 'This week and earlier': [source] }).map((i) => i.json);

test('counts distinct threads and rolling weeks despite repeated sheet rows', () => {
  const current = [row('a1', 0), row('a2', 1), row('b1', 0, 'Reduce appointment cancellations')];
  const history = [current[0], { ...current[0], url: current[0].url + '?share=1' }, row('a3', 8), row('a4', 15), row('a5', 18), row('h1', 8, 'Track marketing spend')];
  const source = prepare(current, history);
  assert.equal(source.trendIdeas.length, 7);
  const trends = count(source, [
    { problem: 'Repair records', audience: 'Landlords', ids: ['a1', 'a2', 'a3', 'a4', 'a5'] },
    { problem: 'Cancellations', audience: 'Service firms', ids: ['b1'] },
    { problem: 'Marketing spend', audience: 'Small firms', ids: ['h1'] },
  ]);
  assert.equal(trends.length, 3);
  assert.deepEqual({ ...trends[0], evidenceUrls: undefined }, {
    weekEnding: '2026-10-23', problem: 'Repair records', audience: 'Landlords',
    thisWeekThreads: 2, previousWeekThreads: 1, change: 1, status: 'rising',
    threadsSeen: 5, weeksSeen: 3, evidenceUrls: undefined,
  });
  assert.equal(trends[0].evidenceUrls.split('\n').length, 5);
  assert.equal(trends[1].status, 'new');
  assert.equal(trends[2].thisWeekThreads, 0);
  assert.equal(trends[2].change, -1);
  assert.equal(trends[2].status, 'lower');
});

test('a first run works with an empty Sheets result and does not invent recurrence', () => {
  const source = prepare([row('a1', 0)], [{}]);
  const [trend] = count(source, [{ problem: 'Repair records', audience: 'Landlords', ids: ['a1'] }]);
  assert.equal(trend.status, 'new');
  assert.equal(trend.previousWeekThreads, 0);
  assert.equal(trend.threadsSeen, 1);
  assert.equal(trend.weeksSeen, 1);
});

test('unknown and repeated model references never inflate counts; omitted ideas survive', () => {
  const source = prepare([row('a1', 0), row('b1', 0, 'Reduce cancellations')], []);
  const trends = count(source, [
    { problem: 'Repairs', audience: 'Landlords', ids: ['a1', 'a1', 'invented'] },
    { problem: 'Duplicate', audience: 'Landlords', ids: ['a1', 'invented'] },
  ]);
  assert.equal(trends.length, 2);
  assert.equal(trends.reduce((sum, r) => sum + r.threadsSeen, 0), 2);
  assert.equal(trends[1].problem, 'Reduce cancellations');
  assert.ok(trends.every((r) => !r.evidenceUrls.includes('invented')));
});

test('7-day periods and the eight-week horizon have no gap or future evidence', () => {
  const source = prepare([row('a1', 0)], [
    row('b1', 7), row('c1', 14), row('d1', 55.999), row('e1', 56),
    row('f1', -1), { ...row('g1', 1), foundAt: 'not a date' },
  ]);
  assert.deepEqual(source.trendIdeas.map(({ id, period }) => [id, period]), [['a1', 0], ['b1', 1], ['c1', 2], ['d1', 7]]);
});

test('saved history maps all evidence fields as literal values and produces one brief', () => {
  const save = nodes.get('Save weekly trend history');
  assert.equal(save.parameters.options.cellFormat, 'RAW');
  assert.deepEqual(Object.keys(save.parameters.columns.value), ['weekEnding', 'problem', 'audience', 'thisWeekThreads', 'previousWeekThreads', 'change', 'status', 'threadsSeen', 'weeksSeen', 'evidenceUrls']);
  assert.equal(nodes.get('Read earlier ideas').executeOnce, true);
  assert.equal(nodes.get('Write the weekly brief').executeOnce, true);
  assert.equal(workflow.connections['Count and rank trend evidence'].main[0][0].node, 'Save weekly trend history');
  assert.equal(workflow.connections['Save weekly trend history'].main[0][0].node, 'Write the weekly brief');
});
