export interface HubPhoto {
  photoUri: string;
  source: string;
  expiresAt: string;
  attributions?: Array<{
    displayName?: string;
    uri?: string;
    photoUri?: string;
  }>;
}

export interface Hub {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  country: string;
  rating?: number;
  userRatingCount?: number;
  photo?: HubPhoto;
  photos?: HubPhoto[];
  googleMapsUri?: string;
  broadAreas?: string[];
  formattedAddress?: string;
  location?: { lat: number; lng: number };
  description?: string;
  isDemo?: boolean;
  checkedInCount?: number;
  demoPresence?: any;
  guide?: any;
  placeId: string;
  currentIntentSummary?: any;
}
