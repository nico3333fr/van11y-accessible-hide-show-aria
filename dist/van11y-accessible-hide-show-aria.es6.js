/*
 * ES2015 simple and accessible hide-show system (collapsible regions), using ARIA
 * Website: https://van11y.net/accessible-hide-show/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE
 */
(doc => {

    'use strict';

    const HIDESHOW_EXPAND = 'js-expandmore';
    const HIDESHOW_BUTTON_EXPAND = 'js-expandmore-button';
    const HIDESHOW_BUTTON_EXPAND_STYLE = 'expandmore__button';
    const HIDESHOW_BUTTON_LABEL_ID = 'label_expand_';

    const DATA_PREFIX_CLASS = 'data-hideshow-prefix-class';

    const HIDESHOW_BUTTON_EMPTY_ELEMENT_SYMBOL = 'expandmore__symbol';
    const HIDESHOW_BUTTON_EMPTY_ELEMENT_TAG = 'span';
    const ATTR_HIDESHOW_BUTTON_EMPTY_ELEMENT = 'aria-hidden';

    //const HIDESHOW_TO_EXPAND = 'js-to_expand';
    const HIDESHOW_TO_EXPAND_ID = 'expand_';
    const HIDESHOW_TO_EXPAND_STYLE = 'expandmore__to_expand';

    /*
     recommended settings by a11y expert
    */
    const ATTR_CONTROL = 'data-controls';
    const ATTR_EXPANDED = 'aria-expanded';
    const ATTR_LABELLEDBY = 'data-labelledby';
    const ATTR_HIDDEN = 'data-hidden';

    const IS_OPENED_CLASS = 'is-opened';

    const DISPLAY_FIRST_LOAD = 'js-first_load';
    const DISPLAY_FIRST_LOAD_DELAY = '1500';


    const findById = id => doc.getElementById(id);

    const addClass = (el, className) => {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
            el.className += ' ' + className; // IE 8+
        }
    }

    const removeClass = (el, className) => {
        if (el.classList) {
            el.classList.remove(className); // IE 10+
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
        }
    }

    const hasClass = (el, className) => {
        if (el.classList) {
            return el.classList.contains(className); // IE 10+
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
        }
    }

    const setAttributes = (node, attrs) => {
        Object
            .keys(attrs)
            .forEach((attribute) => {
                node.setAttribute(attribute, attrs[attribute]);
            });
    };

    const triggerEvent = (el, event_type) => {
        if (el.fireEvent) {
            el.fireEvent('on' + event_type);
        } else {
            let evObj = document.createEvent('Events');
            evObj.initEvent(event_type, true, false);
            el.dispatchEvent(evObj);
        }
    }

    /* gets an element el, search if it is element with class or child of parent class, returns id of the element founded */
    let searchParent = (el, parentClass) => {
        let found = false;
        let parentElement = el;
        while (parentElement && found === false) {
            if (hasClass(parentElement, parentClass) === true) {
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
    }


    /** Find all expand inside a container
     * @param  {Node} node Default document
     * @return {Array}      
     */
    const $listHideShows = (node = doc) => [].slice.call(node.querySelectorAll('.' + HIDESHOW_EXPAND));


    /**
     * Build expands for a container
     * @param  {Node} node 
     */
    const attach = (node) => {

        $listHideShows(node)
            .forEach((expand_node) => {

                let iLisible = Math.random().toString(32).slice(2, 12);
                // let prefixClassName = typeof expand_node.getAttribute(DATA_PREFIX_CLASS) !== 'undefined' ? expand_node.getAttribute(DATA_PREFIX_CLASS) + '-' : '' ; // IE11+
                let prefixClassName = expand_node.hasAttribute(DATA_PREFIX_CLASS) === true ? expand_node.getAttribute(DATA_PREFIX_CLASS) + '-' : '';
                let toExpand = expand_node.nextElementSibling;
                let expandmoreText = expand_node.innerHTML;
                let expandButton = doc.createElement("BUTTON");
                let expandButtonEmptyElement = doc.createElement(HIDESHOW_BUTTON_EMPTY_ELEMENT_TAG);

                // empty element for symbol
                addClass(expandButtonEmptyElement, prefixClassName + HIDESHOW_BUTTON_EMPTY_ELEMENT_SYMBOL);
                expandButtonEmptyElement.setAttribute(ATTR_HIDESHOW_BUTTON_EMPTY_ELEMENT, true);

                // clear element before adding button to it
                expand_node.innerHTML = '';

                // create a button with all attributes
                addClass(expandButton, prefixClassName + HIDESHOW_BUTTON_EXPAND_STYLE);
                addClass(expandButton, HIDESHOW_BUTTON_EXPAND);
                setAttributes(expandButton, {
                    [ATTR_CONTROL]: HIDESHOW_TO_EXPAND_ID + iLisible,
                    [ATTR_EXPANDED]: 'false',
                    'id': HIDESHOW_BUTTON_LABEL_ID + iLisible,
                    'type': 'button'
                });
                expandButton.innerHTML = expandmoreText;

                // Button goes into node
                expand_node.appendChild(expandButton);
                expandButton.insertBefore(expandButtonEmptyElement, expandButton.firstChild);

                // to expand attributes
                setAttributes(toExpand, {
                    [ATTR_LABELLEDBY]: HIDESHOW_BUTTON_LABEL_ID + iLisible,
                    [ATTR_HIDDEN]: 'true',
                    'id': HIDESHOW_TO_EXPAND_ID + iLisible
                });

                // add delay if DISPLAY_FIRST_LOAD
                addClass(toExpand, prefixClassName + HIDESHOW_TO_EXPAND_STYLE);
                if (hasClass(toExpand, DISPLAY_FIRST_LOAD) === true) {
                    setTimeout(function() {
                        removeClass(toExpand, DISPLAY_FIRST_LOAD);
                    }, DISPLAY_FIRST_LOAD_DELAY);
                }

                // quick tip to open
                if (hasClass(toExpand, IS_OPENED_CLASS) === true) {
                    addClass(expandButton, IS_OPENED_CLASS);
                    expandButton.setAttribute(ATTR_EXPANDED, 'true');

                    removeClass(toExpand, IS_OPENED_CLASS);
                    toExpand.removeAttribute(ATTR_HIDDEN);

                }

            });


    };

    /* listeners */
    ['click', 'keydown']
    .forEach(eventName => {

        doc.body
            .addEventListener(eventName, e => {

                // search if click on button or on element in a button (fix for Chrome)
                let id_expand_button = searchParent(e.target, HIDESHOW_BUTTON_EXPAND);

                // click on button
                if (id_expand_button !== '' && eventName === 'click') {
                    let button_tag = findById(id_expand_button);
                    let destination = findById(button_tag.getAttribute(ATTR_CONTROL));
                    let etat_button = button_tag.getAttribute(ATTR_EXPANDED);

                    // if closed
                    if (etat_button === 'false') {
                        button_tag.setAttribute(ATTR_EXPANDED, true);
                        addClass(button_tag, IS_OPENED_CLASS);
                        destination.removeAttribute(ATTR_HIDDEN);
                    } else {
                        button_tag.setAttribute(ATTR_EXPANDED, false);
                        removeClass(button_tag, IS_OPENED_CLASS);
                        destination.setAttribute(ATTR_HIDDEN, true);
                    }

                }
                // click on hx (fix for voiceover = click or keydown on hx => click on button.
                // this makes no sense, but somebody has to do the job to make it fucking work
                if (hasClass(e.target, HIDESHOW_EXPAND) === true) {
                    let hx_tag = e.target;
                    let button_in = hx_tag.querySelector('.' + HIDESHOW_BUTTON_EXPAND)

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
            }, true);


    });


    const onLoad = () => {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    }

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleHideShowAria = attach;



})(document);