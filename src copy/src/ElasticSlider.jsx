import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import "./ElasticSeekSlider.css";

const MAX_OVERFLOW = 20;

export default function ElasticSeekSlider({
  currentTime,
  duration,
  onSeek,
  onSeekStart,
  onSeekEnd,
}) {
  const [value, setValue] = useState(currentTime);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  // Синхронизация с музыкой, только если не тащим сами
  useEffect(() => {
    if (!isDragging) {
      setValue(currentTime);
    }
  }, [currentTime, isDragging]);

  useMotionValueEvent(clientX, "change", (latest) => {
    if (sliderRef.current && isDragging) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue;

      if (latest < left) {
        newValue = left - latest;
      } else if (latest > right) {
        newValue = latest - right;
      } else {
        newValue = 0;
      }
      // Эффект пружины (decay)
      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = (e) => {
    if (isDragging && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      // Вычисляем новое время на основе позиции курсора
      let newValue = ((e.clientX - left) / width) * duration;

      // Ограничиваем границами трека
      newValue = Math.min(Math.max(newValue, 0), duration);
      
      setValue(newValue);
      onSeek(newValue); // Передаем наверх для плавности UI
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    onSeekStart && onSeekStart(); // Останавливаем обновление извне
    
    if (sliderRef.current) {
        const { left, width } = sliderRef.current.getBoundingClientRect();
        let newValue = ((e.clientX - left) / width) * duration;
        newValue = Math.min(Math.max(newValue, 0), duration);
        setValue(newValue);
        onSeek(newValue);
    }
    
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    onSeekEnd && onSeekEnd(value); // Реальная перемотка аудио
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
    animate(scale, 1);
  };

  // Форматирование времени (0:00)
  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Процент заполнения
  const getProgressPercent = () => {
    if (!duration) return 0;
    return (value / duration) * 100;
  };

  return (
    <motion.div
      className="seek-slider-container"
      onHoverStart={() => animate(scale, 1.05)}
      onHoverEnd={() => animate(scale, 1)}
      onTouchStart={() => animate(scale, 1.05)}
      onTouchEnd={() => animate(scale, 1)}
    >
      {/* ЦИФРЫ СВЕРХУ */}
      <div className="seek-labels">
        <span className="time-current">{formatTime(value)}</span>
        <span className="time-duration">{formatTime(duration)}</span>
      </div>

      <div
        ref={sliderRef}
        className="seek-track-root"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <motion.div
          style={{
            scaleX: useTransform(() => {
              if (sliderRef.current) {
                const { width } = sliderRef.current.getBoundingClientRect();
                return 1 + overflow.get() / width;
              }
              return 1;
            }),
            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
            transformOrigin: useTransform(() => {
              if (sliderRef.current) {
                const { left, width } = sliderRef.current.getBoundingClientRect();
                return clientX.get() < left + width / 2 ? "right" : "left";
              }
              return "center";
            }),
            height: useTransform(scale, [1, 1.05], [6, 10]), // Утолщение при наведении
          }}
          className="seek-track-wrapper"
        >
          <div className="seek-track-bg">
            <div
              className="seek-track-fill"
              style={{ width: `${getProgressPercent()}%` }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Вспомогательная физика
function decay(value, max) {
  if (max === 0) return 0;
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}