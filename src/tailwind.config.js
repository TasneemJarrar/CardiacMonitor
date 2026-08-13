export default {
  content: ["./index.html", "./assets/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E6BE6",
          light: "#63A4FF",
          dark: "#1E4FB8",
        },
        secondary: "#63A4FF",
        accent: "#7FD8FF",

        background: {
          DEFAULT: "#EAF2FF",
          end: "#FFFFFF",
          dark: "#0F172A",
          "dark-end": "#020617",
        },

        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1E293B",
        },

        text: {
          primary: "#16233D",
          secondary: "#5B6B85",
          muted: "#98A7BE",
          "primary-dark": "#F1F5F9",
          "secondary-dark": "#94A3B8",
          "muted-dark": "#64748B",
        },

        border: {
          DEFAULT: "#E3EDFB",
          dark: "#334155",
        },

        status: {
          success: "#35C48F",
          warning: "#FFB84D",
          error: "#FF6B6B",
          info: "#63A4FF",
          "success-dark": "#10B981",
          "warning-dark": "#F59E0B",
          "error-dark": "#EF4444",
          "info-dark": "#38BDF8",
        },

        role: {
          doctor: "#07419A",
          nurse: "#00695C",
          receptionist: "#E7590B",
          "doctor-bg": "#E5EBF4",
          "nurse-bg": "#E0F2F1",
          "receptionist-bg": "#FFF8E1",
          "doctor-dark": "#5B9DFF",
          "nurse-dark": "#4FD1C5",
          "receptionist-dark": "#FF9248",
        },
      },
      backgroundImage: {
        "gradient-wash": "linear-gradient(135deg, #EAF2FF 0%, #FFFFFF 100%)",
        "gradient-blue": "linear-gradient(135deg, #63A4FF 0%, #2E6BE6 100%)",
        "gradient-hero": "linear-gradient(135deg, #7FD8FF 0%, #2E6BE6 100%)",
        "gradient-wash-dark":
          "radial-gradient(ellipse 500px 400px at 50% 0%, rgba(46,107,230,0.18), transparent 70%), " +
          "radial-gradient(ellipse 400px 400px at 10% 30%, rgba(53,196,143,0.08), transparent 70%), " +
          "radial-gradient(ellipse 400px 400px at 90% 30%, rgba(255,184,77,0.08), transparent 70%), " +
          "linear-gradient(180deg, #0F172A 0%, #020617 100%)",
        "gradient-blue-dark":
          "linear-gradient(135deg, #1E4FB8 0%, #0B2C7A 100%)",
        "gradient-hero-dark":
          "linear-gradient(135deg, #2E6BE6 0%, #1E4FB8 100%)",
      },
    },
  },
  plugins: [],
};