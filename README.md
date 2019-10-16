React Visibility Tracking Hooks

====

React Hooks for tracking visibility status of elements in viewport, inspired by [react-visibility-sensor](https://github.com/joshwnj/react-visibility-sensor)


Installation
----

using npm

`npm install react-visibility-tracking-hooks`

or with yarn

`yarn add react-visibility-tracking-hooks`


Example
----

TBD

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

Options
----


- `minElementOffset`: (default {}) 

| Option                | Description                                                                                                                                                                                                          | Default                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `onVisibilityChange`  | callback for whenever the element visibility status changes (every window "scroll" or "resize")                                                                                                                      | `undefined`                                               |
| `partiallyVisible`    | If true, consider element visible even when only a part of it is visible. The value can also be 'top', 'left', 'bottom', or 'right' in case we want to specifically consider only one part of the element as visible | `false`                                                   |
| `scrollCheck`         | If true, "scroll" event listener will be enabled                                                                                                                                                                     | `true`                                                    |
| `scrollThrottleLimit` | Throttle delay for "scroll" event                                                                                                                                                                                    | `250`                                                     |
| `resizeCheck`         | If true, "resize" event listener will be enabled                                                                                                                                                                     | `false`                                                   |
| `resizeThrottleLimit` | Throttle delay for "resize" event                                                                                                                                                                                    | `250`                                                     |
| `minElementOffset`    | Offset padding (in `px`) for each side of element, positive value will padded *inside* element (rectangle will be smaller) and vice versa for negative value                                                         | ```javascript { top: 0, left: 0, bottom: 0, right: 0 }``` |
    
----

TO-DO
----

- Example
  - [ ] Example on Code Sandbox
  - [ ] Building and Running Example Locally

- Test
  - [ ] Write Test using [react-testing-library](https://github.com/testing-library/react-testing-library)

License
----

MIT
