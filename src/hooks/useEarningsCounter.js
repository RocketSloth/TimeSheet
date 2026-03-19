import { useState, useEffect } from 'react';

/**
 * useEarningsCounter
 *
 * A custom hook that calculates per-second earnings based on an hourly rate
 * and a clock-in timestamp. The returned value updates every 1 000 ms.
 *
 * @param {number} hourlyRate       - The employee's hourly pay rate (e.g. 25 for $25/hr)
 * @param {string|null} clockInTime - ISO timestamp of when the user clocked in,
 *                                    or null/undefined when not clocked in.
 * @returns {number} currentEarnings - Earnings accumulated since clockInTime.
 *                                     Returns 0 when not clocked in.
 */
function useEarningsCounter(hourlyRate, clockInTime) {
  const [currentEarnings, setCurrentEarnings] = useState(0);

  useEffect(() => {
    // Criterion 5: when not clocked in, return 0 and do not start an interval
    if (!clockInTime) {
      setCurrentEarnings(0);
      return;
    }

    // Criterion 3: earnings formula
    const calculateEarnings = () => {
      const elapsedSeconds = (Date.now() - new Date(clockInTime).getTime()) / 1000;
      const earnings = (hourlyRate / 3600) * elapsedSeconds;
      setCurrentEarnings(earnings);
    };

    // Run once immediately so the value is correct before the first tick
    calculateEarnings();

    // Criterion 2: update every 1 000 ms
    const intervalId = setInterval(calculateEarnings, 1000);

    // Criterion 4: clear the interval on unmount (or when deps change)
    return () => {
      clearInterval(intervalId);
    };
  }, [hourlyRate, clockInTime]);

  return currentEarnings;
}

export default useEarningsCounter;
