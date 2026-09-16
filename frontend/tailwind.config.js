/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "pf-purple": "#4B2E83",
        "pf-purple-dark": "#382063",
        "pf-purple-light": "#EFEAFA", // fonds doux (banniere, pastilles d'etapes)
        "pf-blue": "#2F7FB8",
        "pf-gold": "#E0AC1F",
        // Vert fonce : seul vert utilisable sous du texte blanc (contraste 5.1:1).
        "pf-green": "#4A7A1E",
        // Vert clair du logo : decoratif uniquement (jamais sous du texte blanc).
        "pf-lime": "#93BF3C",
      },
      fontFamily: {
        serif: ["Piazzolla", "serif"],
      },
    },
  },
  plugins: [],
};