/**
 * @file Build settings of images.
 *
 * @author Koichi Nagaoka
 */

const glob      = require('glob');
const path      = require('path');
const fs        = require('fs-extra');
const imagemin  = require('imagemin');

const funcs     = require('../utils/functions');
const settings  = require('../../config/settings');


// ビルド監視処理を開始する
funcs.watchBuilding(
  `${settings.clientRoot}/${settings.imagesDir}`,
  () => {

    // 対象画像ファイルパス一覧を取得する
    const imagePaths = glob.sync(
      `${settings.clientRoot}/${settings.imagesDir}/**/*.{${settings.imagesExts.join(',')}}`,
      {
        ignore: `${settings.clientRoot}/${settings.imagesDir}/${settings.spritesDir}/**/*`
      }
    );

    // 画像圧縮処理を行う
    // imageminの output 指定だとソースのディレクトリ構造を維持しないため、出力先を空指定にしてラッピング処理を記述する
    // 但し、imageminのバグで出力先に null を指定するとオプションが全て無効になってしまうため、undefined を指定している
    return imagemin(
      imagePaths,
      undefined,    // eslint-disable-line no-undefined
      {
        plugins: settings.imageminPlugins
      }
    ).then((files) => {

      // 対象画像ファイル分繰り返し
      files.forEach((file, index) => {

        // 出力先ファイルパスを作成する
        const destImageFilePath = path.resolve(
          settings.documentRoot,
          path.relative(settings.clientRoot, imagePaths[index])
        );

        // ファイルを書き込む
        fs.outputFile(destImageFilePath, file.data);

      });

    });

  }
);
