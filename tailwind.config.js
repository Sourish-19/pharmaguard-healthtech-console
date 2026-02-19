/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    850: '#151f32',
                    900: '#0f172a',
                    950: '#020617',
                },
                cyan: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                    900: '#083344',
                },
                emerald: {
                    400: '#34d399',
                    500: '#10b981',
                    900: '#064e3b',
                },
                crimson: {
                    400: '#f472b6', // pink-400 as fallback/similar
                    500: '#ec4899', // pink-500
                    900: '#831843',
                },
                amber: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                    900: '#78350f',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
