import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import TransactionModal from '../components/TransactionModal';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({
    totalDeposit: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [modal, setModal] = useState({ open: false, type: 'DEPOSIT', edit: null });

  const fetchData = async () => {
    const params = {};
    if (dates.startDate) params.startDate = dates.startDate;
    if (dates.endDate) params.endDate = dates.endDate;

    const { data } = await API.get('/transactions', { params });
    setTransactions(data.transactions);
    setTotals(data.totals);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const openAdd = (type) => setModal({ open: true, type, edit: null });

  const openEdit = (tx) =>
    setModal({ open: true, type: tx.type, edit: tx });

  const handleSaveModal = async (payload) => {
    if (modal.edit) {
      await API.put(`/transactions/${modal.edit._id}`, payload);
    } else {
      await API.post('/transactions', payload);
    }
    setModal({ ...modal, open: false, edit: null });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await API.delete(`/transactions/${id}`);
    fetchData();
  };

  const exportPDF = () => {
    window.print();
  };

  const applyFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Deposit</div>
            <div className="stat-value green">₹ {totals.totalDeposit.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Expense</div>
            <div className="stat-value red">₹ {totals.totalExpense.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Balance (Deposit - Expense)</div>
            <div className="stat-value blue">₹ {totals.balance.toFixed(2)}</div>
          </div>
        </div>

        <div className="filters-row">
          <form className="date-inputs" onSubmit={applyFilter}>
            <input
              type="date"
              value={dates.startDate}
              onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
            />
            <input
              type="date"
              value={dates.endDate}
              onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
            />
            <button className="btn btn-primary btn-small" type="submit">
              Apply
            </button>
          </form>
          <div className="actions-row">
            <button
              className="btn btn-outline btn-small"
              type="button"
              onClick={() => openAdd('DEPOSIT')}
            >
              Add Deposit
            </button>
            <button
              className="btn btn-primary btn-small"
              type="button"
              onClick={() => openAdd('EXPENSE')}
            >
              Add Expense
            </button>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h4>Transactions</h4>
            <button className="btn btn-outline btn-small" onClick={exportPDF}>
              Export PDF
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={
                        t.type === 'DEPOSIT' ? 'badge-deposit' : 'badge-expense'
                      }
                    >
                      {t.type}
                    </span>
                  </td>
                  <td>{t.reason || '-'}</td>
                  <td>{t.type === 'DEPOSIT' ? '+' : '-'}{t.amount.toFixed(2)}</td>
                  <td className="action-icons">
                    <button onClick={() => openEdit(t)}>✏️</button>
                    <button onClick={() => handleDelete(t._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 16 }}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        open={modal.open}
        type={modal.type}
        initial={modal.edit}
        onClose={() => setModal({ ...modal, open: false, edit: null })}
        onSave={handleSaveModal}
      />
    </>
  );
};

export default DashboardPage;
