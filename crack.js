/*
 * @file: gojs水印破解
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-11-19 09:52:15
 */


const fs = require('fs');
const path = require('path');

class Crack {
  constructor() {
    this.parent = path.resolve(__dirname)
  }

  start() {
    // 如果已经拉取过依赖包
    const gojs = `${this.parent}/node_modules/gojs/release/go.js`;
    // 破解gojs
    if (fs.existsSync(gojs)) {
      const states = fs.statSync(gojs);
      if (states.size === 869655) {
        fs.readFile(gojs, 'utf8', (err1, files) => {
          const result = files.replace(
            'b.V[Za("7eba17a4ca3b1a8346")][Za("78a118b7")](b.V,xk,4,4)',
            '()=>{return true;}',
          );
          // eslint-disable-next-line no-console
          fs.writeFile(gojs, result, 'utf8', err2 => console.log(err2));
        });
      }
    }
  }
}

new Crack().start();