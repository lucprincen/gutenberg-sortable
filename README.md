# Gutenberg Sortable
A Gutenberg component to turn anything into an animated, touch- and a11y-friendly sortable list. 
Like these images in a block with desktop wallpapers:

![images in a wallpaper block that are sorted by dragging and dropping](http://staging.lucp.nl/static/gutenberg-sortable.gif)

---

## Features

- Locked axises
- Events
- Smooth animations
- Auto-scrolling
- Horizontal, vertical and grid lists
- Touch support 👌
- Keyboard support 💪


## Installation

Using npm:
`$ npm install gutenberg-sortable --save`

And then, using a module bundler that supports ES2015 modules (like [webpack](https://webpack.js.org/)):
```javascript
import Sortable from 'gutenberg-sortable';

//or, if you're not using ES6:
var Sortable = require('gutenberg-sortable');
```


## Usage

Here's a basic example of the Sortable gutenberg component, used in a block.
```javascript
    //... skipping the usual registerBlockType settings, and getting straight to the attributes:
    attributes: {
        images: {
            source: 'query',
            selector: 'img',
            query: {
                url: { source: 'attribute', attribute: 'src' },
                alt: { source: 'attribute', attribute: 'alt' }
            }
        }
    },
    edit( props ) {

        let images = ( !props.attributes.images ? [] : props.attributes.images );
        const { className, setAttributes } = props

        return (
            <div className={className}>
                <Sortable
                    className="gallery"
                    items={images}
                    axis="grid"
                    onSortEnd={ ( images ) => setAttributes({ images }) }
                >
                    {images.map((image) =>
                        <img src={image.url} alt={image.alt} class="gallery-image" />
                    )}
                </Sortable>
            </div>
        )
    },
    //... rest of the block logic
```

Let's break that down:

### Attributes
When you register an attribute to work with Sortable, it's probably easiest to use a source: 'query' attribute. This makes it so you can just add html or components to your Sortable.

### Sortable 
Sortable is meant as a wrapper. Wrap it around everything you'd like to be sortable. It will add a parent div around all the children. You should also pass the attribute (in this case images) as a prop called "items". This ensures you will get back the re-sorted prop in your sortable events.


## Options

There's a few options you can pass the component:

**axis** - The axis you'd like to sort on. This example is set to 'grid', but X and Y are also available. Y is the default.

**onSortStart** - What to do when sorting starts. This is a function that will get the node and it's index plus the event as it's properties returned. A simple example for this:
```javascript
const highlight = ({node, index}, event) => {
    node.classList.add('highlight');
    console.log( 'the element you\'ve picked up has an index of '+index );
}

<Sortable onSortStart={highlight}>
```
This will give the picked up node a "highlight" class and log a message with the nodes current index.


**onSortEnd** - What to do when sorting has finished. This function will return the items you passed along as a prop, but now reordered according to the users' action. In the basic example above we just reset the attribute with the new sorted values.

## FAQ

#### Module not found: can't resolve React-DOM
If you encounter this error while compiling your block, you haven't loaded in React and React Dom from WP Core as an external in your build process. This is because Sortable uses a native React component to provide certain functionality. 
Add the following to your webpack.config.js, and everything should work fine:

```javascript
externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
},
```


## Dependencies

Gutenberg Sortable depends on the [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) package by [Claudéric Demers](https://github.com/clauderic).


## Contributions

All help is welcome! Please leave your feature- and/org pull-request here! 😉