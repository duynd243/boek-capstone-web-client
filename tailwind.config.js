/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./constants/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                "progress-loading": {
                    "50%": {left: "107%"},
                },
            },
            animation: {
                "progress-loading": "progress-loading 4s linear infinite",
            },
        },
    },
    plugins: [
        require("@tailwindcss/line-clamp"),
        require("@tailwindcss/forms"),
        require("@headlessui/tailwindcss")({prefix: "ui"}),
    ],
};
