'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactSortableHoc = require('react-sortable-hoc');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = wp.element.Component;

var Sortable = function (_Component) {
    _inherits(Sortable, _Component);

    //constructor
    function Sortable() {
        _classCallCheck(this, Sortable);

        var _this = _possibleConstructorReturn(this, (Sortable.__proto__ || Object.getPrototypeOf(Sortable)).apply(this, arguments));

        _this.focusIndex = null;

        _this.onSortStart = _this.onSortStart.bind(_this);
        _this.onSortEnd = _this.onSortEnd.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        return _this;
    }

    /**
     * Get the sortable list:
     */


    _createClass(Sortable, [{
        key: 'getSortableList',
        value: function getSortableList() {
            var _this2 = this;

            var _props = this.props,
                items = _props.items,
                children = _props.children,
                className = _props.className;

            //create the sortable container:

            return (0, _reactSortableHoc.SortableContainer)(function () {

                //loop through all available children
                return _react2.default.createElement(
                    'div',
                    { className: (0, _classnames2.default)('components-sortable', className) },
                    children.map(function (child, index) {

                        child.props['tabindex'] = '0';
                        child.props['onKeyDown'] = _this2.onKeyDown;

                        //generate a SortableElement using the item and the child
                        var SortableItem = (0, _reactSortableHoc.SortableElement)(function () {
                            return child;
                        });

                        //set a temporary class so we can find it post-render:
                        if (index == _this2.focusIndex) {
                            child.props['class'] = (0, _classnames2.default)('sortable-focus', child.props.className);
                        }

                        //display Sortable Element
                        return _react2.default.createElement(SortableItem, { key: 'item-' + index, index: index, item: items[index] });
                    })
                );
            });
        }

        /**
         * Render the component
         */

    }, {
        key: 'render',
        value: function render() {
            var items = this.props.items;
            var SortableList = this.getSortableList();

            //reset key-focus after refresh:
            this.resetKeyboardFocus();

            return (
                //return the sortable list, with props from our upper-lever component
                _react2.default.createElement(SortableList, {
                    axis: this.getAxis(),
                    items: items,
                    onSortEnd: this.onSortEnd
                })
            );
        }

        /*************************************/
        /**         Evens                    */
        /*************************************/

        /**
         * What to do on sort start ?
         * 
         * @param Object
         */

    }, {
        key: 'onSortStart',
        value: function onSortStart(_ref, event) {
            var node = _ref.node,
                index = _ref.index,
                collection = _ref.collection;

            //run the corresponding function in the upper-lever component:
            if (typeof this.props.onSortStart === 'function') {
                this.props.onSortStart({ node: node, index: index, collection: collection }, event);
            }
        }

        /**
         * What to do on sort end?
         * 
         * @param Object holding old and new indexes and the collection 
         */

    }, {
        key: 'onSortEnd',
        value: function onSortEnd(_ref2) {
            var oldIndex = _ref2.oldIndex,
                newIndex = _ref2.newIndex;


            //create a new items array:
            var _items = (0, _reactSortableHoc.arrayMove)(this.props.items, oldIndex, newIndex);

            //and run the corresponding function in the upper-lever component:
            if (typeof this.props.onSortEnd === 'function') {
                this.props.onSortEnd(_items);
            }
        }

        /*************************************/
        /**         Helpers                  */
        /*************************************/

        /**
         * Get a default axis, and allow for the "grid" axis type
         */

    }, {
        key: 'getAxis',
        value: function getAxis() {
            if (typeof this.props.axis == 'undefined') {
                return 'y';
            } else if (this.props.axis == 'grid') {
                return 'xy';
            }

            return this.props.axis;
        }

        /*************************************/
        /**         Keyboard Accesibility    */
        /*************************************/

        /**
         * Keyboard accessibility:
         */

    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {

            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
                e.stopPropagation();
            }

            var key = e.keyCode;
            var oldIndex = this.getIndex(e.target);
            var newIndex = oldIndex;

            switch (key) {

                case 37: //left
                case 38:
                    //top
                    newIndex = parseInt(oldIndex - 1);
                    break;
                case 39: //right
                case 40:
                    //down
                    newIndex = parseInt(oldIndex + 1);
                    break;
            }

            if (oldIndex !== newIndex) {
                this.focusIndex = newIndex;
                this.onSortEnd({ oldIndex: oldIndex, newIndex: newIndex });
            }
        }

        /**
         * Get the index of a child
         * 
         * @param Element child 
         */

    }, {
        key: 'getIndex',
        value: function getIndex(child) {
            var parent = child.parentNode;
            var children = parent.children;
            var i = children.length - 1;
            for (; i >= 0; i--) {
                if (child == children[i]) {
                    break;
                }
            }
            return i;
        }

        /**
         * After a render, reset the keyboard focus:
         */

    }, {
        key: 'resetKeyboardFocus',
        value: function resetKeyboardFocus() {
            var _this3 = this;

            setTimeout(function () {
                if (_this3.focusIndex !== null) {
                    var focusElement = document.getElementsByClassName('sortable-focus')[0];
                    focusElement.focus();
                    focusElement.classList.remove('sortable-focus');
                    _this3.focusIndex = null;
                }
            }, 10);
        }
    }]);

    return Sortable;
}(Component);

exports.default = Sortable;