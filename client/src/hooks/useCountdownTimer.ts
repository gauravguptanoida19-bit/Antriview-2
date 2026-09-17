import { useState, useEffect, useCallback, useRef } from 'react';

interface CountdownTimerProps {
  initialMinutes: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export const useCountdownTimer = ({
  initialMinutes,
  onExpire,
  autoStart = true,
}: CountdownTimerProps) => {
  const totalSeconds = initialMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(totalSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(!autoStart);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      if (onExpireRef.current) {
        onExpireRef.current();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpireRef.current) onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, secondsLeft]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const toggle = useCallback(() => setIsPaused((prev) => !prev), []);
  const reset = useCallback(() => {
    setSecondsLeft(totalSeconds);
    setIsPaused(false);
  }, [totalSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const elapsedSeconds = totalSeconds - secondsLeft;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100));
  const isCritical = secondsLeft <= 120 && secondsLeft > 0;

  return {
    secondsLeft,
    elapsedSeconds,
    formattedTime,
    progressPercent,
    isPaused,
    isCritical,
    pause,
    resume,
    toggle,
    reset,
  };
};
