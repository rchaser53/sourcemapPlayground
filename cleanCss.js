const fs = require('fs');
const path = require('path');

const CleanCSS = require('clean-css');
const jetpack = require('fs-jetpack');

const getCleanCssInput = (paths) => {
  return paths.map((targetPath) => {
    return {
      [targetPath]: {
        styles: fs.readFileSync(targetPath).toString()
      }
    }
  })
}

// const contentInput = getCleanCssInput(['hoge.css', 'hoge2.css']);

const contentInput = getCleanCssInput([
  'node_modules/pnotify/src/pnotify.css',
  'node_modules/pnotify/src/pnotify.buttons.css',
  'node_modules/pnotify/src/pnotify.history.css',
  'node_modules/pnotify/src/pnotify.mobile.css'
]);

const dest = path.join(__dirname, 'out.css');

new CleanCSS({
  sourceMapInlineSources: true,
  sourceMap: true
}).minify(contentInput, (error, output) => {
  if (error) throw new Error(error);

  jetpack.write(dest, `${output.styles}
/*# sourceMappingURL=out.css.map */`);
  jetpack.write(`${dest}.map`, output.sourceMap.toString());
});


