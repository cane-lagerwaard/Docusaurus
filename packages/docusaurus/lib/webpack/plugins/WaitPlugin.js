/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const chokidar = require('chokidar');

class WaitPlugin {
  constructor(options) {
    this.filepath = options.filepath;
    this.watcher = chokidar.watch(this.filepath, {
        awaitWriteFinish: true,
        disableGlobbing: true,
      });
  }

  closeWatcher() {
     this.watcher.close();
   }

  apply(compiler) {
    // Before finishing the compilation step
    compiler.hooks.make.tapAsync('WaitPlugin', (compilation, callback) => {
      const {filepath, watcher} = this;
      

      ['add'].forEach(event => {
        watcher.on(event, () => {
          if (fs.existsSync(filepath)) {
            this.closeWatcher();
            callback();
          }
        });
      });
    });
  }
}

module.exports = WaitPlugin;
