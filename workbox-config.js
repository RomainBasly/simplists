module.exports = {
  swSrc: "public/swInit.js", // This is your source service worker file
  swDest: "public/sw.js",
  globDirectory: "public/",
  globPatterns: ["**/*.{html,json,js,css}"],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Increase limit if needed
};
