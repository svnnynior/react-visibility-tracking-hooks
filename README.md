# React Visibility Tracking Hooks

React Hooks for tracking visibility status of elements in viewport, inspired by [react-visibility-sensor](https://github.com/joshwnj/react-visibility-sensor)


Installation
----

using npm

```shell
npm install react-visibility-tracking-hooks
```

or with yarn

```shell
yarn add react-visibility-tracking-hooks
```


Example
----

You can find an example [here](https://svnnynior.github.io/react-visibility-tracking-hooks/)

or if you want to run it locally, clone this project and then:

```shell
 cd example
 npm install
 npm start
```

Usage
---

```js
import useVisibilityTracking from "react-visibility-tracking-hooks"

function onVisibilityChange (isVisible, percentVisible) {
  console.log(`Element is visible ?: ${isVisible}`);
  console.log(`Visibility Percent - horizontal: ${percentVisible.horizontalPercent} - vertical: ${percentVisible.verticalPercent} - overall: ${percentVisible.overallPercent}`);
}

function MyComponent() {
  const [ref, { rect, isVisible, percentVisible }] = useVisibilityTracking({
    onVisibilityChange: onVisibilityChange,
    partiallyVisible: false,
    scrollCheck: true,
    scrollThrottleLimit: 250,
    resizeCheck: false,
    resizeThrottleLimit: 250,
    minElementOffset: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
  })

  return (
    <div ref={ref}>
      This element will be tracked !!
    </div>
  )
}
```

### Options


| Option                | Description                                                                                                                                                                                                          | Default                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `onVisibilityChange`  | callback for whenever the element visibility status changes (every window "scroll" or "resize")                                                                                                                      | `undefined`                                |
| `partiallyVisible`    | If true, consider element visible even when only a part of it is visible. The value can also be 'top', 'left', 'bottom', or 'right' in case we want to specifically consider only one part of the element as visible | `false`                                    |
| `scrollCheck`         | If true, "scroll" event listener will be enabled                                                                                                                                                                     | `true`                                     |
| `scrollThrottleLimit` | Throttle delay for "scroll" event                                                                                                                                                                                    | `250`                                      |
| `resizeCheck`         | If true, "resize" event listener will be enabled                                                                                                                                                                     | `false`                                    |
| `resizeThrottleLimit` | Throttle delay for "resize" event                                                                                                                                                                                    | `250`                                      |
| `minElementOffset`    | Offset padding (in `px`) for each side of element, positive value will padded *inside* element (rectangle will be smaller) and vice versa for negative value                                                         | `{ top: 0, left: 0, bottom: 0, right: 0 }` |
    
### Utility

- `checkIsVisible(nodeRect, containmentRect, minElementOffset, partiallyVisible)`: Function for checking if *nodeRect* is visible inside *containmentRect* 
- `computePercentVisible(nodeRect, containmentRect)`: Function to compute how much (in percent) *nodeRect* is inside *containmentRect*

#### Note: 
- nodeRect and containmentRect need to be in this format 
  ```javascript
  // position relative to window viewport (px)
  { 
    top: 0, 
    left: 0, 
    bottom: 0, 
    ight: 0 
  }
  ```

TO-DO
----

- Test
  - [ ] Write Test using [react-testing-library](https://github.com/testing-library/react-testing-library) 
    - End-to-end test seems to be impossible because jsdom does not do layouting, read [this issues](https://github.com/testing-library/react-testing-library/issues/353))
    - So we will divide test into *unit testing* (`checkIsVisible` and `computePercentVisible`) and *integration testing* (ref callback, event listener, etc.)
  

License
----

MIT
