module.exports = {
  plugins: [
    require('precss'),
    require('autoprefixer')({
      browsers: ['last 2 versions'],
    }),
  ],
};
