#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');

(function(){
  prompt.start();
  prompt.get(['artist', 'title', 'bpm', 'tuning'], (err, result) => {
    if(err){
      console.error(err);
      process.exit(-1);
    }
    const { artist, title, bpm, tuning } = result;
    // @todo: validate input
    // Create the file name from the song title.
    // @todo: prevent duplicate filenames.
    const filename = title.toLowerCase().replaceAll(' ', '-');
    const template = `title: ${title}\nartist: ${artist}\nBPM: ${bpm}\ntuning: ${tuning}\nrythym: true\nlead: true\nlead_tab: |\nrythym_tab: |\n`;
    fs.writeFileSync(path.join(__dirname, '../content', filename + '.yml'), template);
  });
}());