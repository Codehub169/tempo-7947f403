/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add './src/app/**/*.{js,ts,jsx,tsx,mdx}' if using Next.js App Router
  ],
  theme: {
    extend: {
      colors: {
        'crm-primary': '#0056B3',        // Primary: Professional and trustworthy blue
        'crm-secondary': '#F8F9FA',      // Secondary: Light neutral grey/off-white for backgrounds
        'crm-accent': '#28A745',         // Accent: Vibrant green for positive actions
        'crm-text-dark': '#212529',      // Dark text
        'crm-text-secondary': '#6C757D', // Secondary text, icons
        'crm-border': '#DEE2E6',         // Borders, dividers
        'crm-input-bg': '#E9ECEF',       // Input backgrounds
        'crm-success': '#28A745',        // Success states (same as accent)
        'crm-warning': '#FFC107',        // Warning states
        'crm-error': '#DC3545',          // Error states
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],     // Primary font: Modern, readable sans-serif for UI text
        poppins: ['Poppins', 'sans-serif'], // Secondary font: Geometric sans-serif for headings and accents
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // Consider adding if extensive form styling is needed
  ],
};
