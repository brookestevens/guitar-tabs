const fs = require('fs-extra');
const fse = require('fs-extra');
const ejs = require("ejs");
const path = require("path");

// Helpers
const { getTeaser , parseYAML } = require('../helpers');

// GH pages uses the docs directory.
const buildPath = path.join(__dirname, '../docs');

// Set up the build directories
if (fs.existsSync(buildPath)) {
  console.log('Remove previous build \n');
  fs.rmdirSync(buildPath, { recursive: true, force: true });
}
// Create the build dist
fs.mkdirSync(buildPath + '/tabs', {
  recursive: true
});

// Copy the styles directory.
fse.copySync(path.join(__dirname, '../styles'), buildPath + '/styles');

/**
 * Returns the template as an HTML string.
 *
 * @param {string} data
 * @param {object} params
 */
async function compile(data, params){
  let ejsString = data;
  // Get all includes.
  const regex = /include\('(.*?)'\);/;
  const includes = ejsString.matchAll(new RegExp(regex, 'ig'));
  for (const include of includes) {
    const group = include[1] + '.ejs';
    // Replace relative links with absolute links.
    const absPath = path.resolve(path.join(__dirname, '../views/templates/', group));
    ejsString = ejsString.replace(new RegExp(regex, 'i'), `include('${absPath}')`);
  }
  const template = ejs.compile(ejsString, { client: false });
  return template(params);
}

/**
 * @param {string} _path 
 */
async function writeFile(_path, html) {
  fs.writeFile( path.join(buildPath, _path + '.html'), html, function(err) {
    if(err) { 
      console.log(err);
      return false;
    }
    return true;
  });
}

// Build all EJS templates into static pages.
fs.readFile(path.join(__dirname, '../views/pages/index.ejs') , 'utf8', async function (err, data) {
  if (err){
    console.log(err);
    return false;
  }
  const subPath = 'guitar-tabs';
  const fm = await getTeaser();
  let template = await compile(data, {fm});
  // Add .html to each link in document.
  // @todo Make this replace more controlled. It will replace all links.
  template = template.replace(/<a href="(.*)?"/ig, `<a href="$1.html"`);
  // Replace all relative paths with the subdir path.
  template = template.replace(/href="([^https].*)?"/ig, `href="/${subPath}$1"`);
  writeFile('index', template);
   // Build the Tabs.
  fs.readFile(path.join(__dirname, '../views/templates/tab.ejs'), 'utf-8', async function(err, data) {
    if(err){
      console.error(err);
    }
    fm.forEach( async tab => {
      const name = tab.file_name.substring(0, tab.file_name.length - 4);
      const content = await parseYAML(name);
      let tabMarkup = await compile(data, {content});
      // Replace all relative paths with the subdir path.
      tabMarkup = tabMarkup.replace(/href="([^https].*)?"/ig, `href="/${subPath}$1"`);
      writeFile(`tabs/${name}`, tabMarkup);
      console.log("Built new Page: ", name);
    });
  });
});