import { useQuery } from "@tanstack/react-query";
import { COLLECTIONS } from "./schema";

// Generic hook for fetching via API
async function fetchFromAPI<T>(endpoint: string): Promise<T[]> {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const data = await res.json();
    return data[Object.keys(data).find(k => Array.isArray(data[k])) as string] || [];
}

// Specific hooks for each collection (public data via API)
export function useEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: () => fetchFromAPI("/api/admin/events"),
    });
}

export function useCommittees() {
    return useQuery({
        queryKey: ["committees"],
        queryFn: () => fetchFromAPI("/api/admin/committees"),
    });
}

export function useRegistrations() {
    return useQuery({
        queryKey: ["registrations"],
        queryFn: () => fetchFromAPI("/api/admin/registrations"),
    });
}

export function useTeamMembers() {
    return useQuery({
        queryKey: ["team-members"],
        queryFn: () => fetchFromAPI("/api/admin/team"),
    });
}

export function useSponsors() {
    return useQuery({
        queryKey: ["sponsors"],
        queryFn: () => fetchFromAPI("/api/admin/sponsors"),
    });
}

export function useGallery() {
    return useQuery({
        queryKey: ["gallery"],
        queryFn: () => fetchFromAPI("/api/admin/gallery"),
    });
}

export function useFAQs() {
    return useQuery({
        queryKey: ["faqs"],
        queryFn: () => fetchFromAPI("/api/admin/faqs"),
    });
}

export function useContactSubmissions() {
    return useQuery({
        queryKey: ["contact-submissions"],
        queryFn: () => fetchFromAPI("/api/admin/contact"),
    });
}

export function useAwards() {
    return useQuery({
        queryKey: ["awards"],
        queryFn: () => fetchFromAPI("/api/admin/awards"),
    });
}

export function useAlumni() {
    return useQuery({
        queryKey: ["alumni"],
        queryFn: () => fetchFromAPI("/api/admin/alumni"),
    });
}

export function useCoupons() {
    return useQuery({
        queryKey: ["coupons"],
        queryFn: () => fetchFromAPI("/api/admin/coupons"),
    });
}
