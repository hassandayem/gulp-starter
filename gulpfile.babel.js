// For Main Gulp Configuration
const { src, dest, watch, series } = require("gulp");
// For Transcompilng
const gulpUglify = require("gulp-uglify");
const gulpBabel = require("gulp-babel");
// CSS
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const rtlcss = require("gulp-rtlcss");
// Optimize Images
const imagemin = require("gulp-imagemin");
// Make it PWA
const workboxBuild = require("workbox-build");
// Tools
const rename = require("gulp-rename");
const concat = require("gulp-concat");

// Start Configuration
sass.compiler = require("node-sass");

function javascript() {
  return src(["./src/js/*.js"])
    .pipe(
      gulpBabel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulpUglify())
    .pipe(rename("app.bundle.js"))
    .pipe(dest("./build/dist/js"));
}

function css() {
  return src("./src/style/main.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(rename("style.css"))
    .pipe(dest("./build/dist/css"));
}

function rtlCss() {
  return src(["./build/dist/css/style.css"])
    .pipe(rtlcss()) // Convert to RTL.
    .pipe(rename("style.rtl.css")) // Append "-rtl" to the filename.
    .pipe(dest("./build/dist/css/")); // Output RTL stylesheets.
}

function optimizeImages() {
  return src("./src/images/*")
    .pipe(imagemin())
    .pipe(dest("./build/dist/images"));
}

exports.default = series(css, rtlCss, javascript, optimizeImages);

exports.watch = function () {
  watch(
    ["./src/style/main.scss", "./src/style/**/*.scss"],
    series(css, rtlCss)
  );
  watch(["./src/js/*.js"], javascript);
  watch(["./src/images/*"], optimizeImages);
};
