import { Metadata, Route } from 'next';

export default function sitemap(): Metadata {
    const baseUrl = 'https://arsenicsummit.com';

    // Static routes
    const routes = [
        '',
        '/about',
        '/events',
        '/gallery',
        '/team',
        '/results',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes as any; // Type casting to avoid strict Metadata type issues in some Next.js versions
}
