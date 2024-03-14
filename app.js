const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    colorGrid: function(size) {
      let table = '<table>';
      for (let i = 0; i < size; i++) {
        table += '<tr>';
        for (let j = 0; j < size; j++) {
          var color = ((1<<24)*Math.random()|0).toString(16);
          var colorString = '#' + ('000000' + color).slice(-6);
          var textColor = (parseInt(color, 16) > 0xffffff / 2) ? '#000000' : '#ffffff';
          table += `<td style="background-color: ${colorString}; color: ${textColor};">${colorString}</td>`;
        }
        table += '</tr>';
      }
      table += '</table>';
      return new hbs.handlebars.SafeString(table);
    }
  }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/grid', (req, res) => {
  const size = parseInt(req.body.gridSize, 10);
  res.render('grid', { size });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
