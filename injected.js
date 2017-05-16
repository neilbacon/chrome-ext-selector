function debug() {
  console.log(arguments)
}

function error() {
  console.log(arguments)
}

function highlightSelector(sel) {
  $('.highlightSelector').removeClass('highlightSelector');
  $(sel).addClass('highlightSelector');
}

chrome.runtime.onConnect.addListener(port => {
  console.assert(port.name == "port");
  port.onMessage.addListener(msg => {
    debug('injected messageListener: msg =', msg);
    if (msg.path) {
      highlightSelector(msg.path);
    }
  });
  const cssSelGen = new CssSelectorGenerator();
  
  function handler(e) {
    e.preventDefault(); // don't follow clicked on links, buttons etc.
    e.stopPropagation(); // don't run handlers registered on nested elements
    debug('injected handler: target =', e.target);
    const sel = cssSelGen.getSelector(e.target);
    debug('injected handler: sel =', sel);
    highlightSelector(sel);
    port.postMessage({path: sel});
  }
  
  document.addEventListener(
    'click', handler,
    { capture: true } // call us BEFORE handlers registered on nested elements
  );
});

({ msg: "injected: done" });

