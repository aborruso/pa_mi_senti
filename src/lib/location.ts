interface Coordinates {
  latitude: number;
  longitude: number;
}

const formatCoordinate = (value: number): string => value.toFixed(5);

export const buildGoogleMapsLink = (coords: Coordinates): string => {
  const lat = formatCoordinate(coords.latitude);
  const lng = formatCoordinate(coords.longitude);
  return `https://www.google.com/maps/place/${lat},${lng}`;
};

export const requestCurrentPosition = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Geolocalizzazione non supportata'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });

interface MaybeAppendLocationOptions {
  confirmMessage?: string;
  onRequestStart?: () => void;
  onRequestEnd?: () => void;
}

export const maybeAppendLocationLink = async (
  message: string,
  options?: MaybeAppendLocationOptions
): Promise<string> => {
  if (typeof window === 'undefined') {
    return message;
  }

  const wantsLocation = window.confirm(
    options?.confirmMessage ??
      'Vuoi aggiungere un link con la tua posizione attuale al messaggio?'
  );

  if (!wantsLocation) {
    return message;
  }

  try {
    options?.onRequestStart?.();
    const coords = await requestCurrentPosition();
    const mapsLink = buildGoogleMapsLink(coords);
    const trimmed = message.trim();
    return trimmed ? `${trimmed} ${mapsLink}` : mapsLink;
  } catch (error) {
    window.alert('Non è stato possibile recuperare la tua posizione.');
    return message;
  } finally {
    options?.onRequestEnd?.();
  }
};
