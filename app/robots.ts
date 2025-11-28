import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/chair/', '/api/'],
        },
        sitemap: 'https://arsenicsummit.com/sitemap.xml',
    };
}
