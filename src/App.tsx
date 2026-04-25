import { useState } from 'react';
import './App.css';
import { requestOtp, verifyOtp } from './api';

function App() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'SUCCESS'>('PHONE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await requestOtp(phone);
      if (res.success) {
        setStep('OTP');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await verifyOtp(phone, otp);
      if (res.success) {
        setStep('SUCCESS');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h1 className="title">GateSMS</h1>
        <p className="subtitle">Secure Authentication</p>

        {error && <div className="error-message">{error}</div>}

        {step === 'PHONE' && (
          <form onSubmit={handleRequestOtp} className="fade-in">
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="012 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Sending...' : 'Get OTP Code'}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="fade-in">
            <div className="input-group">
              <label>Enter OTP Code</label>
              <input
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="otp-input"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Verifying...' : 'Verify Securely'}
            </button>
            <button 
              type="button" 
              className="btn-text"
              onClick={() => setStep('PHONE')}
              disabled={loading}
            >
              Change Phone Number
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="success-state fade-in">
            <div className="checkmark">✓</div>
            <h2>Verified Successfully</h2>
            <p>Your phone number has been securely verified.</p>
            <button 
              className="btn-outline" 
              onClick={() => {
                setStep('PHONE');
                setPhone('');
                setOtp('');
              }}
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
