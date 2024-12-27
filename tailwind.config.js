module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // Emerald Green for primary actions
        secondary: "#1E3A8A", // Deep Blue for secondary elements
        accent: "#F59E0B", // Warm Yellow for highlights and buttons
        light: "#F3F4F6", // Light Gray for backgrounds
        dark: "#2D3748", // Dark Gray for text
        success: "#22C55E", // Bright Green for success
        error: "#EF4444", // Red for error
        warning: "#F97316", // Orange for warning
      },
      spacing: {
        "88": "22rem", // Custom spacing for cards or sections
        "100": "25rem", // Larger spacing for modals
      },
      borderRadius: {
        "xl": "1rem", // Rounded corners for cards and buttons
        "4xl": "2rem", // Larger rounded corners for modals
      },
      boxShadow: {
        smooth: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow for buttons and cards
        deep: "0 10px 15px rgba(0, 0, 0, 0.2)", // Deeper shadow for modals
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // Body font
        heading: ["Poppins", "sans-serif"], // Heading font
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
