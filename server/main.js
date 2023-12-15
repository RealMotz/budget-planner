const { app } = require('./server');
const port = 3080;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});