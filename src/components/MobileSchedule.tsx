import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getItem, setItem } from '../lib/store';
import { cn } from '../lib/utils';
import styles from './MobileSchedule.module.css';

const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAYS_FULL  = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const EVENT_KEY  = 'acm.weeklyEvents';

type WeekEvent = {
  id: string; name: string; day: number; start: string; end: string; color: string;
};

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
};

export default function MobileSchedule() {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [events, setEvents]           = useState<WeekEvent[]>([]);
  const [direction, setDirection]     = useState(0);
  const tabsRef    = useRef<HTMLDivElement>(null);
  const touchStart = useRef({ x: 0, y: 0 });

  async function loadEvents() {
    const data = await getItem<WeekEvent[]>(EVENT_KEY, []);
    setEvents(data);
  }

  useEffect(() => {
    loadEvents();
    const onAuth = (e: Event) => {
      if ((e as CustomEvent).detail?.authenticated) loadEvents();
    };
    window.addEventListener('acm:auth', onAuth);
    window.addEventListener('acm:events-updated', loadEvents);
    return () => {
      window.removeEventListener('acm:auth', onAuth);
      window.removeEventListener('acm:events-updated', loadEvents);
    };
  }, []);

  function goToDay(day: number) {
    if (day === selectedDay) return;
    setDirection(day > selectedDay ? 1 : -1);
    setSelectedDay(day);
    const tab = tabsRef.current?.children[day] as HTMLElement | undefined;
    tab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  async function deleteEvent(id: string) {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    await setItem(EVENT_KEY, updated);
    window.dispatchEvent(new CustomEvent('acm:events-updated'));
  }

  const dayEvents = events
    .filter(e => e.day === selectedDay)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

  return (
    <div className={styles.root}>

      {/* ── Day tabs ─────────────────────────────────────────────── */}
      <div ref={tabsRef} className={styles.tabs} role="tablist">
        {DAYS_SHORT.map((d, i) => (
          <button
            key={i}
            className={cn(
              styles.tab,
              i === selectedDay && styles.tabActive,
              i === todayIdx    && styles.tabToday,
            )}
            onClick={() => goToDay(i)}
            role="tab"
            aria-selected={i === selectedDay}
            type="button"
          >
            {d}
            {i === todayIdx && <span className={styles.todayDot} />}
          </button>
        ))}
      </div>

      {/* ── Day label ────────────────────────────────────────────── */}
      <div className={styles.dayLabel}>
        <span className={styles.dayName}>{DAYS_FULL[selectedDay]}</span>
        {selectedDay === todayIdx && (
          <span className={styles.todayBadge}>hoy</span>
        )}
      </div>

      {/* ── Animated event list (swipeable) ──────────────────────── */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={selectedDay}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onTouchStart={e => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            const dy = Math.abs(e.changedTouches[0].clientY - touchStart.current.y);
            if (Math.abs(dx) > 44 && dy < 36) {
              if (dx < 0 && selectedDay < 6) goToDay(selectedDay + 1);
              if (dx > 0 && selectedDay > 0) goToDay(selectedDay - 1);
            }
          }}
        >
          {dayEvents.length === 0 ? (
            <p className={styles.empty}>Sin clases este día.</p>
          ) : (
            <div className={styles.events}>
              {dayEvents.map(ev => (
                <div
                  key={ev.id}
                  className={styles.card}
                  style={{ borderLeftColor: ev.color, backgroundColor: ev.color + '1a' }}
                >
                  <span className={styles.cardTime}>{ev.start} → {ev.end}</span>
                  <span className={styles.cardName}>{ev.name}</span>
                  <button
                    className={styles.cardDel}
                    onClick={() => deleteEvent(ev.id)}
                    aria-label="Eliminar evento"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <p className={styles.swipeHint}>← desliza para cambiar de día →</p>
    </div>
  );
}
