import { renderHook, act } from '@testing-library/react';
import useEarningsCounter from './useEarningsCounter';

// Use fake timers so we can control setInterval without waiting real time
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useEarningsCounter', () => {
  // ─── Criterion 5 ────────────────────────────────────────────────────────────
  test('returns 0 when clockInTime is null (not clocked in)', () => {
    const { result } = renderHook(() => useEarningsCounter(20, null));
    expect(result.current).toBe(0);
  });

  test('returns 0 when clockInTime is undefined (not clocked in)', () => {
    const { result } = renderHook(() => useEarningsCounter(20, undefined));
    expect(result.current).toBe(0);
  });

  // ─── Criterion 1 & 2 ────────────────────────────────────────────────────────
  test('returns a non-zero currentEarnings when clocked in', () => {
    // Clock in 60 seconds ago
    const clockInTime = new Date(Date.now() - 60_000).toISOString();
    const { result } = renderHook(() => useEarningsCounter(36, clockInTime));

    // After mount the value should already be calculated (immediate call)
    // 36 / 3600 * 60 = 0.6
    expect(result.current).toBeCloseTo(0.6, 1);
  });

  // ─── Criterion 2 ────────────────────────────────────────────────────────────
  test('updates currentEarnings every 1000ms via setInterval', () => {
    const clockInTime = new Date(Date.now()).toISOString();
    const { result } = renderHook(() => useEarningsCounter(3600, clockInTime));

    // At t=0 earnings ≈ 0
    expect(result.current).toBeCloseTo(0, 1);

    // Advance 1 second → earnings should be ≈ 1 (3600/3600 * 1)
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current).toBeCloseTo(1, 0);

    // Advance another 4 seconds → earnings should be ≈ 5
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(result.current).toBeCloseTo(5, 0);
  });

  // ─── Criterion 3 ────────────────────────────────────────────────────────────
  test('uses the formula (hourlyRate / 3600) * elapsedSeconds', () => {
    const hourlyRate = 7200; // $7200/hr → $2/s
    const clockInTime = new Date(Date.now() - 10_000).toISOString(); // 10 s ago

    const { result } = renderHook(() => useEarningsCounter(hourlyRate, clockInTime));

    // Expected: (7200 / 3600) * 10 = 20
    expect(result.current).toBeCloseTo(20, 0);
  });

  // ─── Criterion 4 ────────────────────────────────────────────────────────────
  test('clears the interval on unmount to prevent memory leaks', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const clockInTime = new Date().toISOString();

    const { unmount } = renderHook(() => useEarningsCounter(20, clockInTime));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  // ─── Criterion 5 (transition) ────────────────────────────────────────────────
  test('resets to 0 when clockInTime changes from a value to null', () => {
    const clockInTime = new Date().toISOString();

    const { result, rerender } = renderHook(
      ({ rate, time }) => useEarningsCounter(rate, time),
      { initialProps: { rate: 20, time: clockInTime } }
    );

    // Advance time so earnings are non-zero
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current).toBeGreaterThan(0);

    // Clock out
    rerender({ rate: 20, time: null });
    expect(result.current).toBe(0);
  });
});
