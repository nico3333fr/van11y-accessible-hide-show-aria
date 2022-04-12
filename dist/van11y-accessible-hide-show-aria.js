/**
 * van11y-accessible-hide-show-aria - ES2015 accessible hide-show system (collapsible regions), using ARIA (compatible IE9+ when transpiled)
 * @version v3.0.1
 * @link https://van11y.net/accessible-hide-show/
 * @license MIT : https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE
 */

(function () {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /*
   * ES2015 simple and accessible hide-show system (collapsible regions), using ARIA
   * Website: https://van11y.net/accessible-hide-show/
   * License MIT: https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE
   */
  var loadConfig = function loadConfig() {
    var CACHE = {};

    var set = function set(id, config) {
      CACHE[id] = config;
    };

    var get = function get(id) {
      return CACHE[id];
    };

    var remove = function remove(id) {
      return CACHE[id];
    };

    return {
      set: set,
      get: get,
      remove: remove
    };
  };

  var DATA_HASH_ID = 'data-hash-id';
  var pluginConfig = loadConfig();

  var findById = function findById(id, hash) {
    return document.querySelector("#".concat(id, "[").concat(DATA_HASH_ID, "=\"").concat(hash, "\"]"));
  };

  var addClass = function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className); // IE 10+
    } else {
      el.className += ' ' + className; // IE 8+
    }
  };

  var removeClass = function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className); // IE 10+
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
    }
  };

  var hasClass = function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className); // IE 10+
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
    }
  };

  var setAttributes = function setAttributes(node, attrs) {
    Object.keys(attrs).forEach(function (attribute) {
      node.setAttribute(attribute, attrs[attribute]);
    });
  };

  var triggerEvent = function triggerEvent(el, event_type) {
    if (el.fireEvent) {
      el.fireEvent('on' + event_type);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(event_type, true, false);
      el.dispatchEvent(evObj);
    }
  };
  /* gets an element el, search if it is element with class or child of parent class, returns id of the element founded */


  var searchParentHashId = function searchParentHashId(el, hashId) {
    var found = false;
    var parentElement = el;

    while (parentElement.nodeType === 1 && parentElement && found === false) {
      if (parentElement.hasAttribute(hashId) === true) {
        found = true;
      } else {
        parentElement = parentElement.parentNode;
      }
    }

    if (found === true) {
      return parentElement.getAttribute(hashId);
    } else {
      return '';
    }
  };

  var searchParent = function searchParent(el, parentClass, hashId) {
    var found = false;
    var parentElement = el;

    while (parentElement && found === false) {
      if (hasClass(parentElement, parentClass) === true && parentElement.getAttribute(DATA_HASH_ID) === hashId) {
        found = true;
      } else {
        parentElement = parentElement.parentNode;
      }
    }

    if (found === true) {
      return parentElement.getAttribute('id');
    } else {
      return '';
    }
  };

  var plugin = function plugin() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var CONFIG = _objectSpread2({
      HIDESHOW_EXPAND: 'js-expandmore',
      HIDESHOW_BUTTON_EXPAND: 'js-expandmore-button',
      HIDESHOW_BUTTON_EXPAND_STYLE: 'expandmore__button',
      HIDESHOW_BUTTON_LABEL_ID: 'label_expand_',
      DATA_PREFIX_CLASS: 'data-hideshow-prefix-class',
      HIDESHOW_BUTTON_EMPTY_ELEMENT_SYMBOL: 'expandmore__symbol',
      HIDESHOW_BUTTON_EMPTY_ELEMENT_TAG: 'span',
      ATTR_HIDESHOW_BUTTON_EMPTY_ELEMENT: 'aria-hidden',
      HIDESHOW_TO_EXPAND_ID: 'expand_',
      HIDESHOW_TO_EXPAND_STYLE: 'expandmore__to_expand',

      /*
       recommended settings by a11y expert
      */
      ATTR_CONTROL: 'data-controls',
      ATTR_EXPANDED: 'aria-expanded',
      ATTR_LABELLEDBY: 'data-labelledby',
      ATTR_HIDDEN: 'data-hidden',
      IS_OPENED_CLASS: 'is-opened',
      DISPLAY_FIRST_LOAD: 'js-first_load',
      DISPLAY_FIRST_LOAD_DELAY: '1500'
    }, config);

    var HASH_ID = Math.random().toString(32).slice(2, 12);
    pluginConfig.set(HASH_ID, CONFIG);
    /** Find all expand inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */

    var $listHideShows = function $listHideShows() {
      var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      return [].slice.call(node.querySelectorAll('.' + CONFIG.HIDESHOW_EXPAND));
    }; //[...node.querySelectorAll('.' + CONFIG.HIDESHOW_EXPAND)]; // that does not work on IE when transpiled :-(

    /**
     * Build expands for a container
     * @param  {Node} node
     */


    var attach = function attach(node) {
      $listHideShows(node).forEach(function (expand_node) {
        var _setAttributes, _setAttributes2, _setAttributes3;

        var iLisible = Math.random().toString(32).slice(2, 12); // let prefixClassName = typeof expand_node.getAttribute(DATA_PREFIX_CLASS) !== 'undefined' ? expand_node.getAttribute(DATA_PREFIX_CLASS) + '-' : '' ; // IE11+

        var prefixClassName = expand_node.hasAttribute(CONFIG.DATA_PREFIX_CLASS) === true ? expand_node.getAttribute(CONFIG.DATA_PREFIX_CLASS) + '-' : '';
        var toExpand = expand_node.nextElementSibling;
        var expandmoreText = expand_node.innerHTML;
        var expandButton = document.createElement("BUTTON");
        var expandButtonEmptyElement = document.createElement(CONFIG.HIDESHOW_BUTTON_EMPTY_ELEMENT_TAG);
        expand_node.setAttribute(DATA_HASH_ID, HASH_ID); // empty element for symbol

        addClass(expandButtonEmptyElement, prefixClassName + CONFIG.HIDESHOW_BUTTON_EMPTY_ELEMENT_SYMBOL);
        setAttributes(expandButtonEmptyElement, (_setAttributes = {}, _defineProperty(_setAttributes, CONFIG.ATTR_HIDESHOW_BUTTON_EMPTY_ELEMENT, true), _defineProperty(_setAttributes, DATA_HASH_ID, HASH_ID), _setAttributes)); // clear element before adding button to it

        expand_node.innerHTML = ''; // create a button with all attributes

        addClass(expandButton, prefixClassName + CONFIG.HIDESHOW_BUTTON_EXPAND_STYLE);
        addClass(expandButton, CONFIG.HIDESHOW_BUTTON_EXPAND);
        setAttributes(expandButton, (_setAttributes2 = {}, _defineProperty(_setAttributes2, CONFIG.ATTR_CONTROL, CONFIG.HIDESHOW_TO_EXPAND_ID + iLisible), _defineProperty(_setAttributes2, CONFIG.ATTR_EXPANDED, 'false'), _defineProperty(_setAttributes2, 'id', CONFIG.HIDESHOW_BUTTON_LABEL_ID + iLisible), _defineProperty(_setAttributes2, 'type', 'button'), _defineProperty(_setAttributes2, DATA_HASH_ID, HASH_ID), _setAttributes2));
        expandButton.innerHTML = expandmoreText; // Button goes into node

        expand_node.appendChild(expandButton);
        expandButton.insertBefore(expandButtonEmptyElement, expandButton.firstChild); // to expand attributes

        setAttributes(toExpand, (_setAttributes3 = {}, _defineProperty(_setAttributes3, CONFIG.ATTR_LABELLEDBY, CONFIG.HIDESHOW_BUTTON_LABEL_ID + iLisible), _defineProperty(_setAttributes3, CONFIG.ATTR_HIDDEN, 'true'), _defineProperty(_setAttributes3, 'id', CONFIG.HIDESHOW_TO_EXPAND_ID + iLisible), _defineProperty(_setAttributes3, DATA_HASH_ID, HASH_ID), _setAttributes3)); // add delay if DISPLAY_FIRST_LOAD

        addClass(toExpand, prefixClassName + CONFIG.HIDESHOW_TO_EXPAND_STYLE);

        if (hasClass(toExpand, CONFIG.DISPLAY_FIRST_LOAD) === true) {
          setTimeout(function () {
            removeClass(toExpand, CONFIG.DISPLAY_FIRST_LOAD);
          }, CONFIG.DISPLAY_FIRST_LOAD_DELAY);
        } // quick tip to open


        if (hasClass(toExpand, CONFIG.IS_OPENED_CLASS) === true) {
          addClass(expandButton, CONFIG.IS_OPENED_CLASS);
          expandButton.setAttribute(CONFIG.ATTR_EXPANDED, 'true');
          removeClass(toExpand, CONFIG.IS_OPENED_CLASS);
          toExpand.removeAttribute(CONFIG.ATTR_HIDDEN);
        }
      });
    };
    /*const destroy = (node) => {
        $listHideShows(node)
        .forEach((expand_node) => {
         });
    };*/


    return {
      attach: attach
      /*,
              destroy*/

    };
  };

  var main = function main() {
    /* listeners for all configs */
    ['click', 'keydown'].forEach(function (eventName) {
      document.body.addEventListener(eventName, function (e) {
        var hashId = searchParentHashId(e.target, DATA_HASH_ID); //e.target.dataset.hashId;
        // search if click on button or on element in a button contains data-hash-id (it is needed to load config and know which class to search)

        if (hashId !== '') {
          // loading config from element
          var CONFIG = pluginConfig.get(hashId); // search if click on button or on element in a button (fix for Chrome)

          var id_expand_button = searchParent(e.target, CONFIG.HIDESHOW_BUTTON_EXPAND, hashId); // click on button

          if (id_expand_button !== '' && eventName === 'click') {
            var button_tag = findById(id_expand_button, hashId);
            var destination = findById(button_tag.getAttribute(CONFIG.ATTR_CONTROL), hashId);
            var etat_button = button_tag.getAttribute(CONFIG.ATTR_EXPANDED); // if closed

            if (etat_button === 'false') {
              button_tag.setAttribute(CONFIG.ATTR_EXPANDED, true);
              addClass(button_tag, CONFIG.IS_OPENED_CLASS);
              destination.removeAttribute(CONFIG.ATTR_HIDDEN);
            } else {
              button_tag.setAttribute(CONFIG.ATTR_EXPANDED, false);
              removeClass(button_tag, CONFIG.IS_OPENED_CLASS);
              destination.setAttribute(CONFIG.ATTR_HIDDEN, true);
            }
          } // click on hx (fix for voiceover = click or keydown on hx => click on button.
          // this makes no sense, but somebody has to do the job to make it fucking work


          if (hasClass(e.target, CONFIG.HIDESHOW_EXPAND) === true) {
            var hx_tag = e.target;
            var button_in = hx_tag.querySelector('.' + CONFIG.HIDESHOW_BUTTON_EXPAND);

            if (hx_tag != button_in) {
              if (eventName === 'click') {
                triggerEvent(button_in, 'click');
                return false;
              }

              if (eventName === 'keydown' && (13 === e.keyCode || 32 === e.keyCode)) {
                triggerEvent(button_in, 'click');
                return false;
              }
            }
          }
        }
      }, true);
    });
    return plugin;
  };

  window.van11yAccessibleHideShowAria = main();

  var onLoad = function onLoad() {
    var expand_default = window.van11yAccessibleHideShowAria();
    expand_default.attach();
    document.removeEventListener('DOMContentLoaded', onLoad);
  };

  document.addEventListener('DOMContentLoaded', onLoad);

})();
