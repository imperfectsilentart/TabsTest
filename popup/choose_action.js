

/**
 * Listen for clicks on the buttons, and perform appropriate action on click.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    /**
     * Dump all tabs of current browser window to console.
     */
    function dumpTabs(tabs) {
      let firstTab = tabs[0];
      console.log("Dumping all "+tabs.length+" tabs of current browser window with id "+firstTab.windowId);

      var dumpedTabsIds = [];
      for (let [key, tab] of tabs.entries() ) {
        console.log("tab no. "+tab.id+" (intex: "+tab.index+"): "+tab.title+", "+tab.url);
        if(tab.active && tab.currentWindow){
          console.log("This is the active tab!");
        }
        dumpedTabsIds.push(tab.id);
      }

      return dumpedTabsIds
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Error while processing current tabs: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "dumpTabs()" and "closeTabs()" as appropriate.
     */
    console.log("Classlist of clicked element: "+e.target.classList);
    if ( e.target.classList.contains("close") && e.target.classList.contains("dump")  ) {
      browser.tabs.query({currentWindow: true})
        .then(allTabs => dumpTabs(allTabs))
        .then(dumpedTabsIds =>    {
          console.log("Closing all "+dumpedTabsIds.length+" previously dumped tabs of current browser window.");
          browser.tabs.remove(dumpedTabsIds);
        })
        .catch(reportError);
    } else if (e.target.classList.contains("dump")) {
      browser.tabs.query({currentWindow: true})
        .then(dumpTabs)
        .catch(reportError);
    }
  });
}




/**
 * When the popup loads, add a click handler.
 * If adding the handler caused an exception/error, handle the error.
 */
try{
  listenForClicks();
}catch(error){
  /**
   * There was an error executing the script.
   * Display the popup's error message, and hide the normal UI.
   */
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to add click handler: ${error.message}`);
}
