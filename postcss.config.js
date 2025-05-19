export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        'custom-properties': {
          preserve: false,
        },
      },
    },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
};
