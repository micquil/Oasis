/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
  	extend: {
		boxShadow: {

			neon: "0 0 5px theme('colors.purple.300'), 0 0 20px theme('colors.purple.800')",
		}
  		// borderRadius: {
  		// 	lg: 'var(--radius)',
  		// 	md: 'calc(var(--radius) - 2px)',
  		// 	sm: 'calc(var(--radius) - 4px)'
  		// },
  		// colors: {},

		
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
