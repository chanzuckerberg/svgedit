/**
  * Called internally.
  * @function module:SVGEditor.setIcon
  * @param {string|Element|external:jQuery} elem
  * @param {string|external:jQuery} iconId
  * @param {Float} forcedSize Not in use
  * @returns {void}
  */

const setIcon = function (elem, iconId, forcedSize) {
  const icon = (typeof iconId === 'string') ? $.getSvgIcon(iconId, true) : iconId.clone();
  if (!icon) {
    // Todo: Investigate why this still occurs in some cases
    console.log('NOTE: Icon image missing: ' + iconId); // eslint-disable-line no-console
    return;
  }
  $(elem).empty().append(icon);
};

/**
  * See {@link http://api.jquery.com/bind/#bind-eventType-eventData-handler}.
  * @callback module:SVGEditor.DropDownCallback
  * @param {external:jQuery.Event} ev See {@link http://api.jquery.com/Types/#Event}
  * @listens external:jQuery.Event
  * @returns {void|boolean} Calls `preventDefault()` and `stopPropagation()`
 */
/**
 * @function module:SVGEditor.addDropDown
 * @param {Element|string} elem DOM Element or selector
 * @param {module:SVGEditor.DropDownCallback} callback Mouseup callback
 * @param {boolean} dropUp
 * @returns {void}
*/

const addDropDown = (elem, callback, dropUp) => {
  if (!elem) { return; } // Quit if called on non-existent element
  const button = elem.querySelectorAll('button')[0];
  const list = elem.querySelectorAll('ul');
  list.id = `${elem.id}-list`;
  if (dropUp) {
    elem.classList.add('dropup');
  } else {
    // Move list to place where it can overflow container
    document.getElementById('option_lists').appendChild(list[0]);
  }
  list[0].querySelectorAll('li').forEach((li) => li.addEventListener('mouseup', callback));

  let onButton = false;
  window.addEventListener('mouseup', (evt) => {
    if (!onButton) {
      button.classList.remove('down');
      list[0].style.display = 'none';
    }
    onButton = false;
  });

  button.addEventListener('mousedown', () => {
    if (!button.classList.contains('down')) {
      if (!dropUp) {
        list[0].style.top = elem.offsetTop + 24;
        list[0].style.left = elem.offsetLeft - 10;
      }
      list[0].style.display = 'block';
      onButton = true;
    } else {
      list[0].style.display = 'none';
    }
    button.classList.toggle('down');
  });
  button.addEventListener('hover', () => {
    onButton = true;
  });
  button.addEventListener('mouseout', () => {
    onButton = false;
  });
};

/**
* @param {string} elemSel
* @param {string} listSel
* @param {external:jQuery.Function} callback
* @param {PlainObject} opts
* @param {boolean} opts.dropUp
* @param {boolean} opts.seticon
* @param {boolean} opts.multiclick
* @todo Combine this with `addDropDown` or find other way to optimize.
* @returns {void}
*/
/* global $ */
const addAltDropDown = function (elemSel, listSel, callback, opts) {
  const button = $(elemSel);
  const {dropUp} = opts;
  const list = $(listSel);
  if (dropUp) {
    $(elemSel).addClass('dropup');
  }
  list.find('li').bind('mouseup', function (...args) {
    if (opts.seticon) {
      setIcon('#cur_' + button[0].id, $(this).children());
      $(this).addClass('current').siblings().removeClass('current');
    }
    callback.apply(this, ...args);
  });

  let onButton = false;
  $(window).mouseup(function (evt) {
    if (!onButton) {
      button.removeClass('down');
      list.hide();
      list.css({top: 0, left: 0});
    }
    onButton = false;
  });

  // const height = list.height(); // Currently unused
  button.bind('mousedown', function () {
    const off = button.offset();
    if (dropUp) {
      off.top -= list.height();
      off.left += 8;
    } else {
      off.top += button.height();
    }
    list.offset(off);

    if (!button.hasClass('down')) {
      list.show();
      onButton = true;
    } else {
      // CSS position must be reset for Webkit
      list.hide();
      list.css({top: 0, left: 0});
    }
    button.toggleClass('down');
  }).hover(function () {
    onButton = true;
  }).mouseout(function () {
    onButton = false;
  });

  if (opts.multiclick) {
    list.mousedown(function () {
      onButton = true;
    });
  }
};

export {addDropDown, addAltDropDown, setIcon};
