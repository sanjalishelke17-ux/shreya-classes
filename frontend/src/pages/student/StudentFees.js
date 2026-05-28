import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, Phone } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const months = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];

export default function StudentFees() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);
  const [amount, setAmount]     = useState('');
  const [month, setMonth]       = useState(months[new Date().getMonth()]);
  const [year, setYear]         = useState(String(new Date().getFullYear()));

  useEffect(() => {
    api.get('/payments/my')
      .then(r => setPayments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Enter a valid amount.');
    setPaying(true);
    try {
      const res = await api.post('/payments/create-order', { amount: Number(amount), month, year });

      // If Razorpay keys not configured, show UPI/manual option
      if (res.data.mock) {
        toast('Razorpay not configured yet. Please pay via UPI or cash and contact teacher.', { icon: 'ℹ️' });
        setPaying(false);
        return;
      }

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => {
        const options = {
          key:         res.data.key,
          amount:      res.data.amount,
          currency:    'INR',
          name:        'Shreya Commerce Classes',
          description: `Fee for ${month} ${year}`,
          order_id:    res.data.order_id,
          handler: async (response) => {
            try {
              await api.post('/payments/verify', response);
              toast.success('Payment successful!');
              const updated = await api.get('/payments/my');
              setPayments(updated.data);
            } catch {
              toast.error('Payment verification failed. Contact admin.');
            }
          },
          prefill:  { contact: '' },
          theme:    { color: '#d4960f' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setPaying(false);
      };
    } catch {
      toast.error('Failed to initiate payment.');
      setPaying(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      paid:    'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      failed:  'bg-red-50 text-red-700 border-red-200',
    };
    return map[status] || map.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-navy-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-sm font-medium mb-1">Student Portal</p>
          <h1 className="font-serif text-3xl font-bold text-white">Fee Payment</h1>
          <p className="text-gray-300 mt-2">Pay your tuition fees online securely.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Pay now card */}
        <div className="card p-8">
          <h2 className="font-bold text-navy-900 text-xl mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gold-500" /> Pay Fees
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Month</label>
              <select value={month} onChange={e => setMonth(e.target.value)} className="input-field">
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Year</label>
              <select value={year} onChange={e => setYear(e.target.value)} className="input-field">
                {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Amount (₹) *</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="input-field" placeholder="e.g. 1500" />
            </div>
          </div>

          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6 text-sm text-navy-800">
            <p className="font-semibold mb-1">Fee structure is set by your teacher.</p>
            <p className="text-gray-600">If you're unsure of the amount, call{' '}
              <a href="tel:9130136257" className="text-gold-600 font-bold">9130136257</a> before paying.
            </p>
          </div>

          <button onClick={handlePay} disabled={paying}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4">
            {paying
              ? <><div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> Processing...</>
              : <><CreditCard className="w-4 h-4" /> Pay ₹{amount || '0'} for {month} {year}</>
            }
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Payments secured by Razorpay. UPI, cards & net banking accepted.
          </p>
        </div>

        {/* Payment history */}
        <div>
          <h2 className="font-bold text-navy-900 text-xl mb-4">Payment History</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <div className="card p-8 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No payment records yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map(p => (
                <div key={p.id} className="card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 ${p.status === 'paid' ? 'text-green-500' : 'text-gray-300'}`} />
                    <div>
                      <p className="font-bold text-navy-900">{p.month} {p.year}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy-900">₹{Number(p.amount).toLocaleString('en-IN')}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBadge(p.status)}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact note */}
        <div className="bg-navy-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white">Payment issue?</p>
            <p className="text-gray-300 text-sm">Contact your teacher immediately.</p>
          </div>
          <a href="tel:9130136257" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Phone className="w-4 h-4" /> 9130136257
          </a>
        </div>
      </div>
    </div>
  );
}
