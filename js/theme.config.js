// js/theme.config.js
//
// THIS is the one file to edit to restyle the site.
// Colors, fonts, heading sizes, dark-mode palette, and per-page
// overrides all live here. js/theme.js reads this object and writes
// everything as CSS custom properties at runtime — no CSS file
// hardcodes a color or font.
//
// HOW PER-PAGE OVERRIDES WORK
// Every page starts from `global`. If you add a key under `pages`,
// only the values you list there change — everything else still comes
// from `global`. So a page can have a totally different accent color
// without you retyping fonts or heading sizes.
//
// Example — give the research page a blue accent only:
//   pages: {
//     research: {
//       colors: { accent: '#2E5FA3', accentSoft: 'rgba(46,95,163,0.12)' }
//     }
//   }

window.themeConfig = {
  global: {
    colors: {
      background: "#FBF3EA", // warm pastel white
      surface: "rgba(255,255,255,0.48)", // glass panel base
      text: "#2B2521", // deep warm brown (not pure black)
      textMuted: "#8A7D74",
      accent: "#E4402A", // warm bright red — used sparingly
      accentSoft: "rgba(228,64,42,0.11)",
    },

    // // Colors that swap in when the visitor's system (or saved choice)
    // // prefers dark mode. Fonts and sizes stay the same.
    // darkMode: {
    //   background: '#1B1712',
    //   surface:    'rgba(28,24,20,0.55)',
    //   text:       '#F1E9E0',
    //   textMuted:  '#AFA298',
    //   accent:     '#FF6B4A',
    //   accentSoft: 'rgba(255,107,74,0.15)',
    // },

    fonts: {
      heading: "'mencken-std-text', serif",
      body: "'neue-haas-grotesk-display', sans-serif",
      mono: "'calling-code', monospace",
    },

    headingStyles: {
      h1: {
        size: "clamp(2.4rem, 6vw, 4rem)",
        weight: 400,
        letterSpacing: "-0.01em",
        lineHeight: 1.05,
      },
      h2: {
        size: "clamp(1.6rem, 3.5vw, 2.4rem)",
        weight: 400,
        letterSpacing: "-0.01em",
        lineHeight: 1.15,
      },
      h3: {
        size: "clamp(1.2rem, 2.5vw, 1.6rem)",
        weight: 400,
        letterSpacing: "0em",
        lineHeight: 1.25,
      },
    },

    bodyStyle: {
      size: "1rem",
      weight: 500,
      lineHeight: 1.7,
    },
  },

  // Per-page overrides. The key must match the data-page attribute on <html>.
  pages: {
    home: {
      // Home uses the global palette as-is.
    },

    hobbies: {
      colors: {
        accent: "#4B7B5E",
        accentSoft: "rgba(75,123,94,0.11)",
      },
      darkMode: {
        accent: "#6EAB87",
        accentSoft: "rgba(110,171,135,0.15)",
      },
    },

    research: {
      colors: {
        accent: "#2E5FA3",
        accentSoft: "rgba(46,95,163,0.11)",
      },
      darkMode: {
        accent: "#5B90D6",
        accentSoft: "rgba(91,144,214,0.15)",
      },
    },

    about: {
      colors: {
        accent: "#7B4EA0",
        accentSoft: "rgba(123,78,160,0.11)",
      },
      darkMode: {
        accent: "#AA7FCC",
        accentSoft: "rgba(170,127,204,0.15)",
      },
    },

    post: {
      // Posts inherit the calling page's accent via URL param (handled in post.html).
      // Default fallback to global accent.
    },
  },
};
