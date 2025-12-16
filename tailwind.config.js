import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-bricolage)", "sans-serif"],
                display: ["Clash Display", "sans-serif"],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': {
                        'backgroundPosition': '0% 50%',
                    },
                    '50%': {
                        'backgroundPosition': '100% 50%',
                    },
                },
            },
            animation: {
                'gradient-x': 'gradient-x 3s ease infinite',
            },
        },
    },
    darkMode: "class",
    plugins: [nextui()],
}
