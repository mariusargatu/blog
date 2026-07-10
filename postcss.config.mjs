// Tailwind v4 via PostCSS. Using the PostCSS plugin (not @tailwindcss/vite)
// because Astro 6 runs Vite 7 (rolldown) while the Vite plugin targets Vite 8,
// and the mismatch breaks the resolver binding.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
