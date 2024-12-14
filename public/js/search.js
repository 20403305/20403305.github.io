var searchIndex = {{ .Site.Data.searchIndex | jsonify }};
var idx = lunr(function() {
  this.ref('url');
  this.field('title');
  this.field('content');

  searchIndex.forEach(function(doc) {
    this.add(doc);
  }, this);
});

var searchInput = document.getElementById('search-input');
var searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', function() {
  var query = searchInput.value;
  if (query.length > 2) {
    var results = idx.search(query);
    searchResults.innerHTML = results.map(function(result) {
      var doc = searchIndex.find(function(d) { return d.url === result.ref; });
      return '<div><a href="' + doc.url + '">' + doc.title + '</a></div>';
    }).join('');
  } else {
    searchResults.innerHTML = '';
  }
});
