QUnit.module('Revised Text-Parser');

QUnit.test('Headings processor', (assert) => {
  assert.equal(processHeadings('#This is some content'.split('')), '<h1>This is some content</h1>');
  assert.equal(processHeadings('# This is some content'.split('')), '<h1> This is some content</h1>');
  assert.equal(processHeadings('##This is some content'.split('')), '<h2>This is some content</h2>');
  assert.equal(processHeadings('###This is some content'.split('')), '<h3>This is some content</h3>');
  assert.equal(processHeadings('####This is some content'.split('')), '<h4>This is some content</h4>');
  assert.equal(processHeadings('#####This is some content'.split('')), '<h5>This is some content</h5>');
  assert.equal(processHeadings('######This is some content'.split('')), '<h6>This is some content</h6>');
  assert.equal(processHeadings('This is some content'.split('')), 'This is some content');
});
