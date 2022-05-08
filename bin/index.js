#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');

(function(){
  prompt.start();
  prompt.get(['artist', 'title', 'key', 'tuning', 'filename'], (err, result) => {
    if(err){
      console.error(err);
      process.exit(-1);
    }
    const { artist, title, key, tuning, filename } = result;
    // @todo: validate input
    const template = `title: ${title}\nartist: ${artist}\nkey: ${key}\ntuning: ${tuning}\nrythym: true\nlead: true\nlead_tab: |\nrythym_tab: |\n`;
    fs.writeFileSync(path.join(__dirname, '../content', filename + '.yml'), template);
  });
}());