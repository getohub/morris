# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



# Lancer le projet
npm create vite@latest
cd my-project
npm install

# Le style
# https://tailwindcss.com/docs/guides/vite


npm i -D daisyui@latest

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

## tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

## convertir un fichier MJML en un fichier HTML
mjml -r ./src/emails/verificationEmail.mjml -o ./src/emails/verificationEmail.html