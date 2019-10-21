import React from 'react';
import useVisibilityTracking, { VisibilityTrackingProps } from '../../src';

interface Props {
  testElementStyle: React.CSSProperties;
  visibleText: string;
  notVisibleText: string;
  visibilityTrackingOptions?: VisibilityTrackingProps;
}
const TestComponent: React.FC<Props> = ({
  testElementStyle,
  visibleText,
  notVisibleText,
  visibilityTrackingOptions,
}) => {
  const [ref, { isVisible }] = useVisibilityTracking(visibilityTrackingOptions);
  return (
    <div
      id="container"
      style={testElementStyle}
      ref={ref}
      data-testid="container"
    >
      {isVisible ? visibleText : notVisibleText}
    </div>
  );
};

export default TestComponent;
