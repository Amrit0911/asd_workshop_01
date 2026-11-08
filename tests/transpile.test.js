const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

let server;
let baseUrl;

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, '127.0.0.1', resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
});

test('POST /transpile converts Python to JavaScript', async () => {
    const response = await fetch(`${baseUrl}/transpile`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: 'def add(a, b):\n    return a + b\n\nprint(add(2, 3))' }),
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
        javascript: 'function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));\n',
    });
});

test('POST /transpile validates the request body', async () => {
    const response = await fetch(`${baseUrl}/transpile`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
    });

    assert.equal(response.status, 400);
    assert.match((await response.json()).message, /Python source string/);
});

test('POST /transpile reports unsupported Python with source location', async () => {
    const response = await fetch(`${baseUrl}/transpile`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: 'class Example:\n    pass' }),
    });
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.kind, 'unsupported');
    assert.equal(body.line, 1);
    assert.equal(body.column, 1);
});
