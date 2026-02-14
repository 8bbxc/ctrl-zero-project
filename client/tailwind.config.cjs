module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        accent: '#3b82f6',
        surface: '#0b1220',
        text: '#f8fafc'
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto']
      }
    },
  },
  safelist: [
    'bg-gradient-to-br', 'bg-gradient-to-r',
    'from-blue-500','to-cyan-400','from-purple-500','to-pink-500','from-orange-500','to-red-500','from-yellow-400','to-orange-500','from-emerald-500','to-teal-400','from-indigo-500','to-violet-600','from-sky-500','to-blue-600',
    'shadow-blue-500/20','shadow-purple-500/20','shadow-orange-500/20','shadow-yellow-400/20','shadow-emerald-500/20','shadow-indigo-500/20','shadow-sky-500/20',
    'min-h-[600px]', 'sm:min-h-[700px]', 'md:min-h-[750px]',
    'h-72', 'sm:h-80', 'md:h-96'
  ],
  plugins: [
    require('tailwindcss-rtl')
  ],
} 
