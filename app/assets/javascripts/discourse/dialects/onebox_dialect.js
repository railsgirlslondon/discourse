/**
  Given a node in the document and its parent, determine whether it is on its
  own line or not.

  @method isOnOneLine
  @namespace Discourse.Dialect
**/
var isOnOneLine = function(link, parent) {
  if (!parent) { return false; }

  var siblings = parent.slice(1);
  if ((!siblings) || (siblings.length < 1)) { return false; }

  var idx = siblings.indexOf(link);
  if (idx === -1) { return false; }

  if (idx > 0) {
    var prev = siblings[idx-1];
    if (prev[0] !== 'br') { return false; }
  }

  if (idx < (siblings.length-1)) {
    var next = siblings[idx+1];
    if (next[0] !== 'br') { return false; }
  }

  return true;
};

/**
  We only onebox stuff that is on its own line. This navigates the JsonML tree and
  correctly inserts the oneboxes.

  @event parseNode
  @namespace Discourse.Dialect
**/
Discourse.Dialect.on("parseNode", function(event) {
  var node = event.node,
      path = event.path;

  // We only care about links
  if (node[0] !== 'a')  { return; }

  var parent = path[path.length - 1];

  // We don't onebox bbcode
  if (node[1]['data-bbcode']) {
    delete node[1]['data-bbcode'];
    return;
  }

  // Don't onebox links within a list
  for (var i=0; i<path.length; i++) {
    if (path[i][0] === 'li') { return; }
  }

  if (isOnOneLine(node, parent)) {
    node[1]['class'] = 'onebox';
    node[1].target = '_blank';

    // TODO:
    // if (Discourse && Discourse.Onebox) {
    //   onebox = Discourse.Onebox.lookupCache(url);
    // }
  }
});