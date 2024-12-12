module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Transpile code for the current Node.js version
        },
      },
    ],
  ],
};
