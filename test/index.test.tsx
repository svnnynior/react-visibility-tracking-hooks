import { computePercentVisible, VisibilityRect } from '../src';

describe('computePercentVisible function', () => {
  it('should return 0 percent, when containment element has no size', () => {
    const nodeRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 200,
      right: 200,
    };
    const containmentRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };

    const percentVisible = computePercentVisible(nodeRect, containmentRect);
    expect(percentVisible.horizontalPercent).toBe(0);
    expect(percentVisible.verticalPercent).toBe(0);
    expect(percentVisible.overallPercent).toBe(0);
  });

  it('should return 0 percent, when referenced element has no size', () => {
    const nodeRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };
    const containmentRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 200,
      right: 200,
    };

    const percentVisible = computePercentVisible(nodeRect, containmentRect);
    expect(percentVisible.horizontalPercent).toBe(0);
    expect(percentVisible.verticalPercent).toBe(0);
    expect(percentVisible.overallPercent).toBe(0);
  });

  it('should return 0 percent, when both containment element and referenced element have no size', () => {
    const nodeRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };
    const containmentRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };

    const percentVisible = computePercentVisible(nodeRect, containmentRect);
    expect(percentVisible.horizontalPercent).toBe(0);
    expect(percentVisible.verticalPercent).toBe(0);
    expect(percentVisible.overallPercent).toBe(0);
  });

  it('should return ratio of containment/referenced element, when referenced element is bigger than containment element, and they are fully intersect', () => {
    const nodeRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
    };
    const containmentRect: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 50,
      right: 50,
    };
    const verticalIntersect =
      (containmentRect.bottom - containmentRect.top) /
      (nodeRect.bottom - nodeRect.top);
    const horizontalIntersect =
      (containmentRect.right - containmentRect.left) /
      (nodeRect.right - nodeRect.left);

    const percentVisible = computePercentVisible(nodeRect, containmentRect);
    expect(percentVisible.horizontalPercent).toBe(verticalIntersect);
    expect(percentVisible.verticalPercent).toBe(horizontalIntersect);
    expect(percentVisible.overallPercent).toBe(
      verticalIntersect * horizontalIntersect
    );
  });

  it('should return all 100 percent visibility, when it is fully overlap', () => {
    const nodeRect_1: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 50,
      right: 50,
    };
    const containmentRect_1: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 50,
      right: 50,
    };

    const percentVisible_1 = computePercentVisible(
      nodeRect_1,
      containmentRect_1
    );
    expect(percentVisible_1.horizontalPercent).toBe(1);
    expect(percentVisible_1.verticalPercent).toBe(1);
    expect(percentVisible_1.overallPercent).toBe(1);

    const nodeRect_2: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 50,
      right: 50,
    };
    const containmentRect_2: VisibilityRect = {
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
    };

    const percentVisible_2 = computePercentVisible(
      nodeRect_2,
      containmentRect_2
    );
    expect(percentVisible_2.horizontalPercent).toBe(1);
    expect(percentVisible_2.verticalPercent).toBe(1);
    expect(percentVisible_2.overallPercent).toBe(1);
  });
});
