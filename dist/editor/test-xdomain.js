/* eslint import/unambiguous: "off" */
/* eslint no-alert: "off" */
/* eslint no-console: "off" */

(function () {
// This file isn't production ready.
// This is only used as an example to show how to work with the embeded editor.
const SVG_DEFAULT_STRING = `
  <svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
    <g class="layer">
      <title>Layer 1</title>
      <circle cx="200" cy="200" fill="red" id="svg_1" r="100" stroke="black" stroke-width="3"/>
    </g>
  </svg>
`.trim();

/**
 * @param {string} id
 * @returns {Element}
 */
function el (id) {
  return document.getElementById(id);
}

/**
 * @returns {string}
 */
function uuid () {
  uuid.seed = uuid.seed || 1;
  uuid.seed++;
  return (
    'uuid_' +
      uuid.seed +
      '_' +
      Math.round(Math.random() * 1000000000000).toString(36)
  );
}

/**
 * @param {string} name
 * @param {GenericArray} args
 * @param {GenericCallback} resolve
 * @param {GenericCallback} reject
 * @returns {void}
 */
function postMessageToEditor (name, args, resolve, reject) {
  const callbackID = uuid();
  const message = {
    args: args || [],
    id: callbackID,
    name,
    namespace: 'svgCanvas'
  };
  const callback = (evt) => {
    console.log('receive message', evt);
    if (!evt.isTrusted) {
      return;
    }
    let json;
    try {
      json = JSON.parse(evt.data);
    } catch (ex) {
      console.warn(ex);
      return;
    }
    if (!json || typeof json !== 'object' || json.id !== callbackID) {
      return;
    }
    window.removeEventListener('message', callback, false);
    if (json.error) {
      reject && reject(json.error);
    } else {
      resolve && resolve(json.result);
    }
  };

  window.addEventListener('message', callback, false);
  const editor = document.getElementById('editor');
  console.log('post message', 'postMessageToEditor');
  editor.contentWindow.postMessage(JSON.stringify(message), '*');
}

/**
 * @returns {void}
 */
function exportSVG () {
  postMessageToEditor('getSvgString', null, (result) => {
    console.log(result);
  });
}

/**
 * @returns {void}
 */
function clearSVG () {
  postMessageToEditor('clear', [], (result) => {
    console.log(result);
  });
}

/**
 * @param {string} defaultSVG
 * @returns {void}
 */
function importSVG (defaultSVG) {
  const svg = (window.prompt('SVG string', defaultSVG || '') || '').trim();
  if (!svg) {
    return;
  }
  console.log('import ' + svg);
  postMessageToEditor('clear', [], () => {
    postMessageToEditor('importSvgString', [svg], (result) => {
      console.log(result);
    });
  });
}

/**
 * @returns {void}
 */
function loadEditor () {
  const domain = '127.0.0.1';
  if (document.domain !== domain) {
    alert(`This file should be tested at from ${domain}`);
  }
  const {port} = window.location;
  const path = window.location.pathname.replace(
    'test-xdomain.html',
    'xdomain-index.html'
  );
  const src = `http://localhost:${port}${path}?extensions=ext-xdomain-messaging`;
  el('editor').src = src;
}

/**
 * @returns {void}
 */
function main () {
  loadEditor();
  const clickHandlers = {
    'export-button': exportSVG,
    'import-button': importSVG.bind(null, null),
    'import-default-button': importSVG.bind(null, SVG_DEFAULT_STRING),
    'clear-button': clearSVG
  };
  Object.keys(clickHandlers).forEach((id) => {
    el(id).addEventListener('click', clickHandlers[id], false);
  });
}

window.addEventListener('load', main);
})();
