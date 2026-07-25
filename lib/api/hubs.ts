import { fetchApi } from "./client";
import { Hub } from "./types";

export async function getHubs(isDashboard: boolean = false): Promise<Hub[]> {
  const data = await fetchApi(isDashboard ? "/api/dashboard/hubs" : "/api/hubs");
  return data.hubs || [];
}

const MOCK_MARKETING_HUBS: any[] = [
  {
    id: "mock-soho",
    name: "Soho House Istanbul",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    checkedInCount: 42,
    rating: 4.8,
    userRatingCount: 2501,
    description: "Exclusive members club and workspace.",
    photo: { photoUri: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80" },
    location: { lat: 41.028, lng: 28.974 },
    slug: "soho-house",
    broadAreas: ["Beyoğlu", "Creative Hub"]
  },
  {
    id: "mock-kolektif",
    name: "Kolektif House Levent",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    checkedInCount: 128,
    rating: 4.6,
    userRatingCount: 1483,
    description: "Vibrant coworking space for tech startups.",
    photo: { photoUri: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80" },
    location: { lat: 41.076, lng: 29.012 },
    slug: "kolektif-house",
    broadAreas: ["Levent", "Tech"]
  },
  {
    id: "mock-wework-sf",
    name: "WeWork Salesforce Tower",
    city: "San Francisco",
    country: "US",
    category: "coworking",
    checkedInCount: 85,
    rating: 4.5,
    userRatingCount: 890,
    description: "Premium workspace in the heart of SF.",
    photo: { photoUri: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    location: { lat: 37.789, lng: -122.396 },
    slug: "wework-sf",
    broadAreas: ["SOMA", "Enterprise"]
  }
];

export async function getHubBySlug(slug: string): Promise<Hub | null> {
  try {
    const data = await fetchApi(`/api/hubs/by-slug?slug=${slug}`);
    return data.hub || null;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const mockHub = MOCK_MARKETING_HUBS.find(h => h.slug === slug);
      if (mockHub) return mockHub;
    }
    return null;
  }
}

export async function getHubDetail(hubId: string): Promise<Hub> {
  return fetchApi(`/hubs/${hubId}`);
}
