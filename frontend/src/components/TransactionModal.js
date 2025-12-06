import React, { useState, useEffect } from 'react';

const TransactionModal = ({ open, onClose, initial, type, onSave }) => {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (initial) {
      setReason(initial.reason || '');
      setAmount(initial.amount.toString());
      setDate(initial.date?.slice(0, 10));
    } else {
      setReason('');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      type,
      reason,
      amount: Number(amount),
      date,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{initial ? 'Edit' : 'Add'} {type === 'DEPOSIT' ? 'Deposit' : 'Expense'}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {type === 'EXPENSE' && (
            <div className="form-group">
              <label>Reason</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Food, Travel, Petrol"
              />
            </div>
          )}
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline btn-small" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-small">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
