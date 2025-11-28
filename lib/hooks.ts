import { useQuery } from "@tanstack/react-query";
import { databases, DATABASE_ID } from "./appwrite";
import { COLLECTIONS } from "./schema";

// Generic hook for fetching Appwrite collections
export function useCollection<T>(collectionName: string, queryKey: string[]) {
    return useQuery({
        queryKey,
        queryFn: async () => {
            const response = await databases.listDocuments(
                DATABASE_ID,
                collectionName
            );
            return response.documents as T[];
        },
    });
}

// Specific hooks for each collection
export function useEvents() {
    return useCollection(COLLECTIONS.EVENTS, ["events"]);
}

export function useCommittees() {
    return useCollection(COLLECTIONS.COMMITTEES, ["committees"]);
}

export function useRegistrations() {
    return useCollection(COLLECTIONS.REGISTRATIONS, ["registrations"]);
}

export function useTeamMembers() {
    return useCollection(COLLECTIONS.TEAM_MEMBERS, ["team-members"]);
}

export function useSponsors() {
    return useCollection(COLLECTIONS.SPONSORS, ["sponsors"]);
}

export function useGallery() {
    return useCollection(COLLECTIONS.GALLERY, ["gallery"]);
}

export function useFAQs() {
    return useCollection(COLLECTIONS.FAQS, ["faqs"]);
}

export function useContactSubmissions() {
    return useCollection(COLLECTIONS.CONTACT_SUBMISSIONS, ["contact-submissions"]);
}

export function useAwards() {
    return useCollection(COLLECTIONS.AWARDS, ["awards"]);
}

export function useAlumni() {
    return useCollection(COLLECTIONS.ALUMNI, ["alumni"]);
}

export function useCoupons() {
    return useCollection(COLLECTIONS.COUPONS, ["coupons"]);
}
