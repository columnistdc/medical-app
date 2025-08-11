module.exports = {
  // For client files
  'client/**/*.{js,jsx,ts,tsx}': [
    'cd client && npm run lint:fix',
    'cd client && npm run format'
  ],
  // For server files
  'server/**/*.{js,ts}': [
    'cd server && npm run lint:fix',
    'cd server && npm run format'
  ]
};
