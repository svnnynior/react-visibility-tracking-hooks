import { useState, useEffect, useCallback, useRef } from 'react';

interface Offset {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}
interface VisibilityRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

interface VisibilityPercent {
  verticalPercent: number;
  horizontalPercent: number;
  overallPercent: number;
}
interface VisibilityObject {
  rect: ClientRect | DOMRect | null;
  isVisible: boolean;
  percentVisible: VisibilityPercent;
}
type RefCallback = (node: HTMLElement | null) => void;
interface EventListenerInfo {
  eventListenerFn: () => void;
  getTimeout: () => NodeJS.Timeout | null;
}

interface EventListeners {
  scroll?: EventListenerInfo;
  resize?: EventListenerInfo;
}
type ObservedEvent = keyof EventListeners;

interface VisibilityTrackingProps {
  onVisibilityChange?: (
    isVisible: boolean,
    percentVisible: VisibilityPercent
  ) => any;
  partiallyVisible?: boolean | keyof VisibilityRect;
  scrollCheck?: boolean;
  scrollDelay?: number;
  scrollThrottleLimit?: number;
  resizeCheck?: boolean;
  resizeDelay?: number;
  resizeThrottleLimit?: number;
  minElementOffset?: Offset;
}

function getVisibilityRect(rect: ClientRect | DOMRect): VisibilityRect {
  let visibilityRect: VisibilityRect = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };
  if (rect instanceof DOMRect) {
    visibilityRect = {
      top: Math.floor(rect.y),
      left: Math.floor(rect.x),
      bottom: Math.floor(rect.y + rect.height),
      right: Math.floor(rect.x + rect.width),
    };
  } else {
    visibilityRect = {
      top: Math.floor(rect.top),
      left: Math.floor(rect.left),
      bottom: Math.floor(rect.bottom),
      right: Math.floor(rect.right),
    };
  }

  return visibilityRect;
}

function getContainmentRect(): VisibilityRect {
  const containmentRect = {
    top: 0,
    left: 0,
    bottom: window.innerHeight || document.documentElement.clientHeight,
    right: window.innerWidth || document.documentElement.clientWidth,
  };

  return containmentRect;
}

export function checkIsVisible(
  nodeRect: VisibilityRect,
  containmentRect: VisibilityRect,
  minElementOffset: Offset,
  partiallyVisible: boolean | keyof VisibilityRect
): boolean {
  const nodeWidth = nodeRect.right - nodeRect.left;
  const nodeHeight = nodeRect.bottom - nodeRect.top;
  const hasSize = nodeWidth > 0 && nodeHeight > 0;
  const partialNodeRect = {
    top: nodeRect.top,
    left: nodeRect.left,
    bottom: nodeRect.bottom,
    right: nodeRect.right,
  };
  if (minElementOffset) {
    partialNodeRect.top += minElementOffset.top || 0;
    partialNodeRect.left += minElementOffset.left || 0;
    partialNodeRect.bottom -= minElementOffset.bottom || 0;
    partialNodeRect.right -= minElementOffset.right || 0;
  }
  const visibilityObject = {
    top: partialNodeRect.top >= containmentRect.top,
    left: partialNodeRect.left >= containmentRect.left,
    bottom: partialNodeRect.bottom <= containmentRect.bottom,
    right: partialNodeRect.right <= containmentRect.right,
  };

  if (partiallyVisible) {
    if (partiallyVisible === true) {
      return Object.values(visibilityObject).some(isVisible => isVisible);
    } else {
      return visibilityObject[partiallyVisible];
    }
  } else {
    const isVisible =
      hasSize &&
      visibilityObject.top &&
      visibilityObject.left &&
      visibilityObject.bottom &&
      visibilityObject.right;

    return isVisible;
  }
}

export function computePercentVisible(
  nodeRect: VisibilityRect,
  containmentRect: VisibilityRect
): VisibilityPercent {
  // No Intersection Case
  if (
    nodeRect.left > containmentRect.right ||
    nodeRect.right < containmentRect.left ||
    nodeRect.top > containmentRect.bottom ||
    nodeRect.bottom < containmentRect.top
  ) {
    return {
      horizontalPercent: 0,
      verticalPercent: 0,
      overallPercent: 0,
    };
  }
  const nodeWidth = nodeRect.right - nodeRect.left;
  const nodeHeight = nodeRect.bottom - nodeRect.top;
  const horizontalIntersect = Math.min(
    containmentRect.right - containmentRect.left,
    containmentRect.right - nodeRect.left,
    nodeRect.right - containmentRect.left,
    nodeRect.right - nodeRect.left
  );
  const verticalIntersect = Math.min(
    containmentRect.bottom - containmentRect.top,
    containmentRect.bottom - nodeRect.top,
    nodeRect.bottom - containmentRect.top,
    nodeRect.bottom - nodeRect.top
  );

  const horizontalPercent = horizontalIntersect / nodeWidth;
  const verticalPercent = verticalIntersect / nodeHeight;
  const overallPercent =
    (horizontalIntersect * verticalIntersect) / (nodeWidth * nodeHeight);

  return {
    horizontalPercent,
    verticalPercent,
    overallPercent,
  };
}

function useVisibilityTracking({
  onVisibilityChange,
  partiallyVisible = false,
  scrollCheck = true,
  scrollThrottleLimit = 250,
  resizeCheck = false,
  resizeThrottleLimit = 250,
  minElementOffset = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}: VisibilityTrackingProps = {}): [RefCallback, VisibilityObject] {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [percentVisible, setPercentVisible] = useState<VisibilityPercent>({
    horizontalPercent: 0,
    verticalPercent: 0,
    overallPercent: 0,
  });
  const nodeRef = useRef<HTMLElement | null>(null);
  const eventListenersRef = useRef<EventListeners | null>(null);

  const checkVisibility = useCallback(() => {
    const rect =
      nodeRef && nodeRef.current
        ? nodeRef.current.getBoundingClientRect()
        : null;
    if (!rect) return;
    const nodeRect = getVisibilityRect(rect);
    const containmentRect = getContainmentRect();
    const nextIsVisible = checkIsVisible(
      nodeRect,
      containmentRect,
      minElementOffset,
      partiallyVisible
    );
    const percentVisible = computePercentVisible(nodeRect, containmentRect);

    setIsVisible(nextIsVisible);
    setPercentVisible(percentVisible);
    if (onVisibilityChange) onVisibilityChange(nextIsVisible, percentVisible);
  }, [minElementOffset, onVisibilityChange, partiallyVisible]);

  const addEventListener = useCallback(
    (event: ObservedEvent, throttleLimit: number) => {
      if (!eventListenersRef.current) {
        eventListenersRef.current = {};
      }
      const eventListeners = eventListenersRef.current;
      let timeout: NodeJS.Timeout | null;

      const checkVisibilityCallback = () => {
        timeout = null;
        checkVisibility();
      };

      const eventListenerFn = () => {
        if (timeout !== null) {
          timeout = setTimeout(
            checkVisibilityCallback,
            throttleLimit < 0 ? 0 : throttleLimit
          );
        }
      };

      const eventListenerInfo: EventListenerInfo = {
        eventListenerFn: eventListenerFn,
        getTimeout: () => {
          return timeout;
        },
      };

      window.addEventListener(event, eventListenerInfo.eventListenerFn);
      eventListeners[event] = eventListenerInfo;

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout);
        }
      };
    },
    [checkVisibility]
  );

  // use "callback ref" instead of normal useRef
  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const elementCallbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (node !== null) {
        nodeRef.current = node;
        if (scrollCheck) {
          addEventListener('scroll', scrollThrottleLimit);
        }
        if (resizeCheck) {
          addEventListener('resize', resizeThrottleLimit);
        }
      } else {
        const eventListeners = eventListenersRef.current;
        for (const event in eventListeners) {
          const eventListenerInfo = eventListeners[event as ObservedEvent];
          if (eventListenerInfo !== undefined) {
            if (eventListenerInfo.getTimeout() !== null) {
              clearTimeout(eventListenerInfo.getTimeout()!);
            }
            window.removeEventListener(
              event,
              eventListenerInfo.eventListenerFn
            );
          }
        }
      }
    },
    [
      scrollCheck,
      resizeCheck,
      addEventListener,
      scrollThrottleLimit,
      resizeThrottleLimit,
    ]
  );

  useEffect(() => {
    return () => {
      const eventListeners = eventListenersRef.current;
      for (const event in eventListeners) {
        const eventListenerInfo = eventListeners[event as ObservedEvent];
        if (eventListenerInfo !== undefined) {
          if (eventListenerInfo.getTimeout() !== null) {
            clearTimeout(eventListenerInfo.getTimeout()!);
          }
          window.removeEventListener(event, eventListenerInfo.eventListenerFn);
        }
      }
    };
  }, []);

  const rect =
    nodeRef && nodeRef.current && nodeRef.current.getBoundingClientRect();
  return [elementCallbackRef, { rect, isVisible, percentVisible }];
}

export default useVisibilityTracking;
