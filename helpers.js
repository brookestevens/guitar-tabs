const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

exports.getTeaser = () => {
  return new Promise((resolve, reject) => {
      fs.readdir(path.join(__dirname, 'content'), (err, files) => {
          if(err) reject(err);
          let teaser = [];
          files.forEach(i => {
              let r = fs.readFileSync(path.join(__dirname, `content/${i}`), 'utf8');
              let fm = yaml.load(r);
              teaser.push({
                  file_name: i,
                  ...fm
              })
          });
          resolve(teaser);
      });
  });
}

exports.parseYAML = (fileName) => {
  return new Promise( (resolve, reject) => {
    try{
      let file = fs.readFileSync(path.join(__dirname, `content/${fileName}.yml`), 'utf8');
      let c = yaml.load(file);
      resolve(c);
    }
    catch(e){
      reject(e);
    }
  });
}