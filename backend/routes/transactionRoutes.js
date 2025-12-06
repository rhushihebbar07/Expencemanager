const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// all routes here are protected
router.use(auth);

// GET /api/transactions?startDate=..&endDate=..
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    const totals = transactions.reduce(
      (acc, t) => {
        if (t.type === 'DEPOSIT') acc.deposit += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { deposit: 0, expense: 0 }
    );

    res.json({
      transactions,
      totals: {
        totalDeposit: totals.deposit,
        totalExpense: totals.expense,
        balance: totals.deposit - totals.expense,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { type, reason, amount, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      reason,
      amount,
      date,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { type, reason, amount, date } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { type, reason, amount, date },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: 'Not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
