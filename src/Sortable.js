import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import classnames from 'classnames';
import React from 'react';

const { Component } = wp.element;

class Sortable extends Component {

    //constructor
    constructor() {
        super(...arguments);

        this.focusIndex = null;

        this.onSortStart = this.onSortStart.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }


    /**
     * Get the sortable list:
     */
    getSortableList() {

        const { items, children, className } = this.props;

        //create the sortable container:
        return SortableContainer(() => {

            //loop through all available children
            return (
                <div className={classnames('components-sortable', className)}>
                    {children.map((child, index) => {

                        child.props['tabindex'] = '0';
                        child.props['onKeyDown'] = this.onKeyDown;

                        //generate a SortableElement using the item and the child
                        let SortableItem = SortableElement(() => {
                            return (child)
                        });

                        //set a temporary class so we can find it post-render:
                        if (index == this.focusIndex) {
                            child.props['class'] = classnames('sortable-focus', child.props.className);
                        }

                        //display Sortable Element
                        return (
                            <SortableItem key={`item-${index}`} index={index} item={items[index]} />
                        )
                    })}
                </div>
            )
        });
    }


    /**
     * Render the component
     */
    render() {
        const items = this.props.items;
        const SortableList = this.getSortableList();

        //reset key-focus after refresh:
        this.resetKeyboardFocus();

        return (
            //return the sortable list, with props from our upper-lever component
            <SortableList
                axis={this.getAxis()}
                items={items}
                onSortStart={this.onSortStart}
                onSortEnd={this.onSortEnd}
            />
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
    onSortStart({ node, index, collection }, event) {
        //run the corresponding function in the upper-lever component:
        if (typeof (this.props.onSortStart) === 'function') {
            this.props.onSortStart({ node, index, collection }, event);
        }
    }

    /**
     * What to do on sort end?
     * 
     * @param Object holding old and new indexes and the collection 
     */
    onSortEnd({ oldIndex, newIndex }) {

        //create a new items array:
        let _items = arrayMove(this.props.items, oldIndex, newIndex);

        //and run the corresponding function in the upper-lever component:
        if (typeof (this.props.onSortEnd) === 'function') {
            this.props.onSortEnd(_items);
        }
    }


    /*************************************/
    /**         Helpers                  */
    /*************************************/

    /**
     * Get a default axis, and allow for the "grid" axis type
     */
    getAxis() {
        if (typeof (this.props.axis) == 'undefined') {
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
    onKeyDown(e) {

        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            e.stopPropagation();
        }

        const key = e.keyCode;
        const oldIndex = this.getIndex(e.target);
        let newIndex = oldIndex;

        switch (key) {

            case 37: //left
            case 38: //top
                newIndex = parseInt(oldIndex - 1);
                break
            case 39: //right
            case 40: //down
                newIndex = parseInt(oldIndex + 1);
                break;
        }

        if (oldIndex !== newIndex) {
            this.focusIndex = newIndex;
            this.onSortEnd({ oldIndex, newIndex });
        }
    }

    /**
     * Get the index of a child
     * 
     * @param Element child 
     */
    getIndex(child) {
        const parent = child.parentNode;
        const children = parent.children;
        let i = children.length - 1;
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
    resetKeyboardFocus() {
        setTimeout(() => {
            if (this.focusIndex !== null) {
                const focusElement = document.getElementsByClassName('sortable-focus')[0];
                focusElement.focus();
                focusElement.classList.remove('sortable-focus');
                this.focusIndex = null;
            }
        }, 10);
    }
}

export default Sortable;