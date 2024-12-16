var fuse; // holds our search engine
var searchVisible = false; 
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var resultsAvailable = false; // Did we get any search results?

// ==========================================
// The main keyboard event listener running the show
//
document.addEventListener('keydown', function(event) {
  
  // CMD-/ to show / hide Search
  if (event.metaKey && event.key === '/') {
    // 补充代码，防止在触发后再输入框中输入 / 
      event.preventDefault(); // Prevent default behavior (e.g., typing / into the input field)

      // Load json search index if first time invoking search
      // Means we don't load json unless searches are going to happen; keep user payload small unless needed
      if(firstRun) {
        loadSearch(); // loads our json data and builds fuse.js search index
        firstRun = false; // let's never do this again
      }
      
      // Toggle visibility of search box
      if (!searchVisible) {
        document.getElementById("fastSearch").style.visibility = "visible"; // show search box
        document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
        searchVisible = true; // search visible
      }
      else {
        document.getElementById("fastSearch").style.visibility = "hidden"; // hide search box
        document.activeElement.blur(); // remove focus from search box 
        searchVisible = false; // search not visible
      }
  }


  // Allow ESC (27) to close search box
  if (event.key == 'Escape') {
    if (searchVisible) {
      document.getElementById("fastSearch").style.visibility = "hidden";
      document.activeElement.blur();
      searchVisible = false;
    }
  }

  // DOWN (40) arrow
  if (event.key == 'ArrowDown') {
    if (searchVisible && resultsAvailable) {
      // console.log("down");
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
      else if ( document.activeElement == last ) { last.focus(); } // if we're at the bottom, stay there
      else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
    }
  }

  // UP (38) arrow
  if (event.key == 'ArrowUp') {
    if (searchVisible && resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
      else if ( document.activeElement == first) { maininput.focus(); } // If we're at the first item, go to input box
      else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
    }
  }
});


// ***********************人补充额外的搜索相关快捷键*************************************


// 个人补充额外的搜索按钮
document.getElementById("search-btn").addEventListener("click", function() {
      // Load json search index if first time invoking search
      // Means we don't load json unless searches are going to happen; keep user payload small unless needed
      if(firstRun) {
        loadSearch(); // loads our json data and builds fuse.js search index
        firstRun = false; // let's never do this again
      }
      
      // Toggle visibility of search box
      if (!searchVisible) {
        document.getElementById("fastSearch").style.visibility = "visible"; // show search box
        document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
        searchVisible = true; // search visible
      }
      else {
        document.getElementById("fastSearch").style.visibility = "hidden"; // hide search box
        document.activeElement.blur(); // remove focus from search box 
        searchVisible = false; // search not visible
      }
});

// 个人补充额外的搜索快捷键：空格键 + f键 + f键
document.addEventListener('keydown', function(event) { 
  // Check if space is pressed
  if (event.key === ' ' && event.repeat === false) { // space key pressed
    let fCount = 0;

    // Wait for the 'f' key press twice in a row
    const fListener = function(event) {
      if (event.key === 'f') {
        // Prevent 'f' from being typed into the input box
        event.preventDefault();
        
        fCount++;
        if (fCount === 2) {
          // Trigger your action here after space + 2 'f' keys
          if (firstRun) {
            loadSearch(); // Load json search index
            firstRun = false; // Don't load again
          }

          // Toggle visibility of search box
          if (!searchVisible) {
            document.getElementById("fastSearch").style.visibility = "visible"; // Show search box
            document.getElementById("searchInput").focus(); // Put focus in input box
            searchVisible = true;
          } else {
            document.getElementById("fastSearch").style.visibility = "hidden"; // Hide search box
            document.activeElement.blur(); // Remove focus from search box
            searchVisible = false;
          }

          // Remove the event listener after the sequence is handled
          document.removeEventListener('keydown', fListener);
        }
      }
    };

    // Add the event listener to count 'f' key presses
    document.addEventListener('keydown', fListener);
  }
});

// 个人补充额外的搜索快捷键： q键 + q键
document.addEventListener('keydown', function(event) {
  if (event.key === 'q' && event.repeat === false) { // Check if 'f' is pressed and not repeated
    let currentTime = new Date().getTime(); // Get the current time
    let lastFTime = window.lastFTime || 0; // Store the last 'f' press time, default to 0 if undefined
    let doubleFTimeout = 500; // 500ms interval for double press

    // Check if two 'f' presses happened within 500ms
    if (lastFTime && currentTime - lastFTime <= doubleFTimeout) {
      // Trigger your action here after two 'f' keys pressed in sequence
      console.log("Double 'f' pressed! Showing search box");
      event.preventDefault();
      if (firstRun) {
        loadSearch(); // Load json data and build the Fuse.js search index
        firstRun = false; // Prevent loading again
      }

      // Always show the search box on double 'f' press
      document.getElementById("fastSearch").style.visibility = "visible"; // Show search box
      document.getElementById("searchInput").focus(); // Focus on the input box so the user can start typing immediately
      searchVisible = true; // Mark search as visible

      // Optionally, add any other action you'd like to perform on double 'f' press.
    }

    // Update lastFTime to the current time
    window.lastFTime = currentTime;
  }
});


document.addEventListener('keydown', function(event) {
  // ALT + J to go down (next item)
  if (event.altKey && event.key === 'j') {
    if (searchVisible && resultsAvailable) {
      event.preventDefault(); // Prevent default behavior (scrolling)

      if (document.activeElement == maininput) {
        first.focus(); // If focus is on the main input, focus the first search result
      } else if (document.activeElement == last) {
        last.focus(); // If we're at the last item, stay there
      } else {
        // Otherwise, move focus to the next search result
        document.activeElement.parentElement.nextSibling.firstElementChild.focus();
      }
    }
  }

  // ALT + K to go up (previous item)
  if (event.altKey && event.key === 'k') {
    if (searchVisible && resultsAvailable) {
      event.preventDefault(); // Prevent default behavior (scrolling)

      if (document.activeElement == maininput) {
        maininput.focus(); // If focus is on the input box, do nothing
      } else if (document.activeElement == first) {
        maininput.focus(); // If we're at the first item, go back to the input box
      } else {
        // Otherwise, move focus to the previous search result
        document.activeElement.parentElement.previousSibling.firstElementChild.focus();
      }
    }
  }

});



// ***********************人补充额外的搜索相关快捷键*************************************









// ==========================================
// execute search as each character is typed
//
document.getElementById("searchInput").onkeyup = function(e) { 
  executeSearch(this.value);
}


// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
              var data = JSON.parse(httpRequest.responseText);
              if (callback) callback(data);
          }
      }
  };
  httpRequest.open('GET', path);
  httpRequest.send(); 
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() { 
  fetchJSONFile('/index.json', function(data){

      var options = { // fuse.js options; check fuse.js website for details
        shouldSort: true,
        location: 0,
        distance: 100, 
        threshold: 0.4,
        // minMatchCharLength: 2,
        minMatchCharLength: 1,
        keys: [
          'title',
          'permalink',
          'summary',
          'contents',    // 搜索正文内容
          'tags',       // 如果需要，可以搜索标签
          'categories'  // 如果需要，可以搜索分类
          ]
      };

      fuse = new Fuse(data, options); // build the index from the json file
      
  });
}


// ==========================================
// using the index we loaded on CMD-/, run 
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  console.log(results);  // debug print the full result item
  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '';
  } else { // build our html 
    for (let item in results.slice(0,5)) { // only show first 5 results
      console.log(results[item].item);
      searchitems = searchitems + '<li><a href="' + results[item].item.permalink + '" tabindex="0">' + '<span class="title">' + results[item].item.title + '</span><br /> <span class="sc">'+ results[item].item.tags +'</span> — ' + results[item].item.date + ' — <em>' + results[item].item.desc + '</em></a></li>'; 

    }
    resultsAvailable = true;
  }
  
  document.getElementById("searchResults").innerHTML = searchitems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
    last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
  }
}