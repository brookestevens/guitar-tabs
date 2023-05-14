const { getTeaser , parseYAML } = require('./helpers');
const express = require('express');
const path = require('path');
const app = express();

app.set("view engine", "ejs");

// static assets
app.use('/js', express.static(__dirname + '/js'));
app.use('/styles', express.static(__dirname + '/styles'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', async (req, res) => {
  try{
    // fetch list of tabs and render page
    const fm = await getTeaser();
    res.render(path.join(__dirname, 'views/pages/index'), { fm });
  }
  catch(e){
    console.error(e);
    return res.status(500).send("<p> Something went wrong. Go back <a href='/'> home </a> </p>");
  }
});

app.get(/\/(content|views|node_modules)\/?(.*)/, (req, res) => {
  res.status(403).send("Unauthorized to view this resource");
});

app.get('/:fileName', async (req, res) => {
  // static pages
  res.render(path.join(__dirname, `views/pages/`, req.params.fileName ));
});

app.get('/tabs/:fileName', async (req, res) => {
  try{
    const content = await parseYAML(req.params.fileName);
    res.render( path.join(__dirname, `views/pages/tab`), { content });
  }
  catch(e){
    console.error(e);
    return res.status(500).send("<p> Something went wrong. Go back <a href='/'> home </a> </p>");
  }
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(404).send("<p>Resource not found. Go back <a href='/'> home </a> </p>");
})

app.listen(process.env.PORT || 3000);
