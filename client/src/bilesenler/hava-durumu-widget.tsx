// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    description: string;
    emoji: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    windDescription: string;
    feelsLike: number;
    pressure: number;
    visibility: number;
    precipitation: number;
  };
  hourlyForecast: Array<{
    time: string;
    hour: number;
    temperature: number;
    emoji: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
  }>;
  sunData: {
    sunrise: string;
    sunset: string;
    dayLength: string;
  };
  forecast: Array<{
    date: string;
    dayName: string;
    temperature: {
      max: number;
      min: number;
    };
    description: string;
    emoji: string;
    humidity: number;
    windSpeed: number;
  }>;
  uvIndex: {
    value: number;
    level: string;
    description: string;
  };
  airQuality: {
    aqi: number;
    level: string;
    description: string;
    components: {
      pm2_5: number;
      pm10: number;
      o3: number;
    };
  } | null;
  lifeIndices: {
    exercise: {
      level: string;
      emoji: string;
      description: string;
    };
    clothing: {
      level: string;
      emoji: string;
      description: string;
    };
    travel: {
      level: string;
      emoji: string;
      description: string;
    };
    skin: {
      level: string;
      emoji: string;
      description: string;
    };
    driving: {
      level: string;
      emoji: string;
      description: string;
    };
    comfort: {
      level: string;
      emoji: string;
      description: string;
    };
  };
}

export function WeatherWidget() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-3">Hava Durumu</h3>
      <div className="text-center">
        <div className="text-3xl mb-2">🔧</div>
        <div className="text-muted-foreground mb-2">Hava durumu servisi güncelleniyor</div>
        <div className="text-sm text-muted-foreground">Yeni API entegrasyonu yapılıyor...</div>
      </div>
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
