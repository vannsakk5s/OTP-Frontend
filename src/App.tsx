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
    <div className="w-full max-w-[400px] p-5 mx-auto">
      <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-3xl p-10 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GateSMS</h1>
        <p className="text-[0.95rem] text-slate-400 mb-[30px]">Secure Authentication</p>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm mb-5 border border-red-500/20">{error}</div>}

        {step === 'PHONE' && (
          <form onSubmit={handleRequestOtp} className="animate-fade-in">
            <div className="text-left mb-6">
              <label className="block text-[0.85rem] font-medium text-slate-300 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="012 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-[14px] px-4 bg-slate-900/60 border border-white/10 rounded-xl text-white text-base font-inherit transition-all focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.2)]"
              />
            </div>
            <button type="submit" disabled={loading} className="font-inherit cursor-pointer w-full p-[14px] bg-indigo-600 text-white rounded-xl text-base font-semibold shadow-[0_4px_6px_-1px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(79,70,229,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Sending...' : 'Get OTP Code'}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="animate-fade-in">
            <div className="text-left mb-6">
              <label className="block text-[0.85rem] font-medium text-slate-300 mb-2">Enter OTP Code</label>
              <input
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-[14px] px-4 bg-slate-900/60 border border-white/10 rounded-xl text-white text-base font-inherit transition-all focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.2)] text-center tracking-[8px] !text-xl font-semibold"
              />
            </div>
            <button type="submit" disabled={loading} className="font-inherit cursor-pointer w-full p-[14px] bg-indigo-600 text-white rounded-xl text-base font-semibold shadow-[0_4px_6px_-1px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(79,70,229,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Verifying...' : 'Verify Securely'}
            </button>
            <button 
              type="button" 
              className="font-inherit cursor-pointer bg-transparent border-none text-slate-400 text-sm mt-4 hover:text-white transition-colors"
              onClick={() => setStep('PHONE')}
              disabled={loading}
            >
              Change Phone Number
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-3xl mb-5 border-2 border-emerald-500">✓</div>
            <h2 className="text-2xl mb-2">Verified Successfully</h2>
            <p className="text-slate-400 text-[0.95rem]">Your phone number has been securely verified.</p>
            <button 
              className="font-inherit cursor-pointer w-full p-[14px] bg-transparent text-white border border-white/10 rounded-xl text-base font-semibold mt-5 hover:bg-white/5 transition-all" 
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
