import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Clock3, CloudSun, MapPin, ThermometerSun } from 'lucide-react';

// P12: Standardized smooth spring configuration
const springSmooth = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.2 };
const SURATGARH_TIME_ZONE = 'Asia/Kolkata';
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=29.32&longitude=73.90&current_weather=true&timezone=Asia%2FKolkata';

const weatherCodeLabels: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Misty',
  48: 'Misty',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
};

interface WeatherState {
  temperature: number | null;
  windspeed: number | null;
  code: number | null;
  isLoading: boolean;
}

function formatSuratgarhTime(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: SURATGARH_TIME_ZONE,
  }).format(date);
}

export default function LocalStatusWidget({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherState>({
    temperature: null,
    windspeed: null,
    code: null,
    isLoading: true,
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const response = await fetch(WEATHER_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Weather unavailable');
        const data = await response.json();
        const current = data?.current_weather;
        if (!isMounted || !current) return;
        setWeather({
          temperature: typeof current.temperature === 'number' ? Math.round(current.temperature) : null,
          windspeed: typeof current.windspeed === 'number' ? Math.round(current.windspeed) : null,
          code: typeof current.weathercode === 'number' ? current.weathercode : null,
          isLoading: false,
        });
      } catch {
        if (!isMounted) return;
        setWeather((previous) => ({ ...previous, isLoading: false }));
      }
    }

    loadWeather();
    const refresh = window.setInterval(loadWeather, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(refresh);
    };
  }, []);

  const weatherLabel = useMemo(() => {
    if (weather.isLoading) return 'Updating';
    if (weather.code === null) return 'Local time';
    return weatherCodeLabels[weather.code] ?? 'Current weather';
  }, [weather.code, weather.isLoading]);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSmooth, delay: 1.05 }}
      className={`w-full max-w-md rounded-lg border border-[#E0C9A6]/25 bg-[#1B263B]/55 px-4 py-3 text-left text-white shadow-[0_20px_60px_rgba(4,11,18,0.22)] backdrop-blur-md sm:px-5 ${className}`}
      aria-live="polite"
      aria-label="Current Suratgarh time and weather"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0C9A6]/30 bg-white/10 text-[#E0C9A6]">
            <Clock3 size={18} />
          </span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#E0C9A6]">
              Suratgarh Now
            </p>
            <p className="font-serif text-2xl font-light leading-none">{formatSuratgarhTime(now)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-white/75 sm:min-w-[180px]">
          <span className="flex items-center gap-1.5">
            <CloudSun size={14} className="text-[#E0C9A6]" />
            {weatherLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <ThermometerSun size={14} className="text-[#E0C9A6]" />
            {weather.temperature === null ? 'Live temp' : `${weather.temperature}C`}
          </span>
          <span className="col-span-2 flex items-center gap-1.5 text-white/55">
            <MapPin size={13} className="text-[#E0C9A6]" />
            Near New Bus Stand, Suratgarh, Rajasthan
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
