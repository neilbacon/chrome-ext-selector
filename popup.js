/*
function debug() {
  console.log(arguments);
}

const error = debug;
*/

/*
 * Without both these steps it doesn't work!
 * It appears that the port is closed when the dev tools close.
 * Do I need a 'background' page?
 * 1. click on extension to show popup
 * 2. right click on extension -> Inspect popup to show its dev tools
 */

/**
 * tabFn should be chrome.tabs.insertCSS or chrome.tabs.executeScript
 * adds debug logging and error handling
 */
function doTabFn(tabFn, tabId, details, callback) {
  tabFn(tabId, details, result => {
    if (chrome.runtime.lastError) {
      console.log('doTabFn error: details =', details, ', error =', chrome.runtime.lastError.message);
    } else {
      console.log('doTabFn success: details =', details, ', result =', result);
      callback(result);
    }
  });
};

function getActiveTab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const tabId = tabs[0].id;
    console.log('getActiveTab: tabId =', tabId);
    callback(tabId);
  });
}

function msgListener(msg) {
  console.log('msgListener: msg =', msg);
  if (msg.path) {
    const div = $('#content div').has(':checked');
    $('input', div).val(msg.path);
  }
  // port.postMessage("ack");
}

function doWithTab(tabId) {
  const port = chrome.tabs.connect(tabId, {name: "port"});
  port.onMessage.addListener(msgListener);
  doTabFn(chrome.tabs.insertCSS, tabId, { code: '.highlightSelector { border: 1px solid red; }' }, () => {
    doTabFn(chrome.tabs.executeScript, tabId, { file: "jquery-3.2.1.slim.min.js" }, () => {
      doTabFn(chrome.tabs.executeScript, tabId, { file: "css-selector-generator.min.js" }, () => {
        doTabFn(chrome.tabs.executeScript, tabId, { file: "injected.js" }, () => {
          $('#content input[type=text]').change(e => {
            const path = $(e.target).val();
            console.log('createUI path change: path =', path);
            port.postMessage({path: path});
          });
        });
      });
    });
  });
}

const mkRadio = (name, id, text, val) => [
  $('<input>').attr({ id: id, type: 'radio', name: name, value: val}),
  $('<label>').attr({for: id, class: 'radioLabel'}).text(text)
];
const chkRadio = arr => {
  arr[0].attr('checked', 'checked');
  return arr;
};
// const radioVal = name => $(`input[name=${name}]:checked`).val();

function createUI() {
  const widgets = [
    { id: 'price', name: 'Price'}, 
    { id: 'username', name: 'User Name'}, 
    { id: 'rating', name: 'Rating'}
  ].map((x, idx) => {
    const arr = mkRadio('infoEle', 'infoEle_' + x.id, x.name, idx);
    if (idx == 0) chkRadio(arr);
    arr.push($('<input>').attr({ id: x.id, type: 'text', name: x.id, class: 'path' }));
    return $('<div>').append(arr);
  });
  $('#content').append(widgets);
}

$(document).ready(() => {
  createUI();
  getActiveTab(doWithTab);
});
