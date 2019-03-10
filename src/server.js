const cors         = require('cors');
const express      = require('express');
const morgan       = require('morgan');
const config       = require('./config');
const routes       = require('./routes');
const pkg          = require('../package.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/', routes);

app.listen(config.port, config.host, () => {
  console.log(`${pkg.name}@${pkg.version} running at http://${config.host}:${config.port}`);
});
