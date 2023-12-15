const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const controller = require('./controller/budgetController');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

router.get('/api/monthlyBudget', controller.fetchMonthlyBudget);
router.post('/api/createWeeklyBudget', controller.createWeeklyBudget);
router.post('/api/createDailyExpense', controller.createDailyExpense);

app.use(router);

module.exports = { app };