const express = require('express');
const compression = require('compression');
const app = express();
app.use(compression());
app.use(express.static('.'));
app.listen(process.env.PORT || 4000);