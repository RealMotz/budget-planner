const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const port = 3080;
const app = express();
const router = express.Router();
const controller = require('./controller/budgetController');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

router.get('/api/allMonthlyBudget', controller.getAllMonthlyBudget);
router.get('/api/monthlyBudget', controller.getMonthlyBudget);
router.post('/api/addWeeklyBudget', controller.createWeeklyBudget);

app.use(router);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});