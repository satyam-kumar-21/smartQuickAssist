'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, sendRegistrationOTP, verifyRegistrationOTP, forgotPassword, resetPassword } from '../store/actions/userActions';
import { USER_AUTH_CLEAR_MESSAGES } from '../store/constants/userConstants';

interface AuthDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'signup' | 'verify-otp' | 'forgot-password' | 'reset-password'>('login');
    const [showPassword, setShowPassword] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const dispatch = useDispatch();

    const { loading, error, userInfo } = useSelector((state: any) => state.userLogin || {});
    const { loading: loadingSendOTP, error: errorSendOTP, success: successSendOTP } =
        useSelector((state: any) => state.userSendOTP || {});
    const { loading: loadingVerifyOTP, error: errorVerifyOTP, success: successVerifyOTP } =
        useSelector((state: any) => state.userVerifyOTP || {});
    const { loading: loadingForgot, error: errorForgot, success: successForgot } =
        useSelector((state: any) => state.userForgotPassword || {});
    const { loading: loadingReset, error: errorReset, success: successReset } =
        useSelector((state: any) => state.userResetPassword || {});

    const resetTransientState = (nextMode: typeof mode = 'login') => {
        dispatch({ type: USER_AUTH_CLEAR_MESSAGES });
        setMode(nextMode);
        setShowPassword(false);
        setSuccessMessage(null);
        setErrorMessage(null);
        setOtp('');
    };

    const handleClose = () => {
        resetTransientState('login');
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            dispatch({ type: USER_AUTH_CLEAR_MESSAGES });
            setSuccessMessage(null);
            setErrorMessage(null);
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (userInfo) {
            setSuccessMessage('Login Successful! Redirecting...');
            const timer = setTimeout(() => {
                dispatch({ type: USER_AUTH_CLEAR_MESSAGES });
                setMode('login');
                setShowPassword(false);
                setSuccessMessage(null);
                setErrorMessage(null);
                setOtp('');
                onClose();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [dispatch, onClose, userInfo]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: USER_AUTH_CLEAR_MESSAGES });
        setErrorMessage(null);
        setSuccessMessage(null);

        if (mode === 'signup') {
            if (password.length < 6) {
                setErrorMessage('Password must be at least 6 characters');
            } else if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match');
            } else {
                dispatch(sendRegistrationOTP(firstName, lastName, email.trim(), password) as any);
            }
        } else if (mode === 'verify-otp') {
            dispatch(verifyRegistrationOTP(email.trim(), otp) as any);
        } else if (mode === 'forgot-password') {
            dispatch(forgotPassword(email.trim()) as any);
        } else if (mode === 'reset-password') {
            if (newPassword.length < 6) {
                setErrorMessage('Password must be at least 6 characters');
            } else if (newPassword !== confirmPassword) {
                setErrorMessage('Passwords do not match');
            } else {
                dispatch(resetPassword(email.trim(), otp, newPassword) as any);
            }
        } else {
            dispatch(login(email.trim(), password) as any);
        }
    };

    useEffect(() => {
        if (successSendOTP) {
            setMode('verify-otp');
            setSuccessMessage('OTP sent to your email.');
        }
    }, [successSendOTP]);

    useEffect(() => {
        if (successVerifyOTP) {
            setMode('login');
            setSuccessMessage('OTP verified successfully! Please login.');
            setOtp('');
        }
    }, [successVerifyOTP]);

    useEffect(() => {
        if (successForgot) {
            setMode('reset-password');
            setSuccessMessage('OTP sent to your email for password reset.');
        }
    }, [successForgot]);

    useEffect(() => {
        if (successReset) {
            setMode('login');
            setSuccessMessage('Password reset successfully! Please login.');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [successReset]);

    useEffect(() => {
        if (error || errorSendOTP || errorVerifyOTP || errorForgot || errorReset) {
            setErrorMessage(
                error || errorSendOTP || errorVerifyOTP || errorForgot || errorReset
            );
        }
    }, [error, errorSendOTP, errorVerifyOTP, errorForgot, errorReset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-300">
                <X
                    className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800 z-10 transition-colors"
                    onClick={handleClose}
                    size={24}
                />

                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => resetTransientState('login')}
                        className={`flex-1 py-4 text-sm font-semibold transition-all ${
                            mode === 'login' || mode === 'forgot-password'
                                ? 'border-b-2 border-[#2364EB] text-[#2364EB]'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => resetTransientState('signup')}
                        className={`flex-1 py-4 text-sm font-semibold transition-all ${
                            mode === 'signup' || mode === 'verify-otp'
                                ? 'border-b-2 border-[#2364EB] text-[#2364EB]'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Register
                    </button>
                </div>

                {errorMessage && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-medium">
                        {successMessage}
                    </div>
                )}

                <div className="p-8 space-y-5">
                    {mode === 'login' && (
                        <form className="space-y-5" onSubmit={submitHandler}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2364EB] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end text-sm">
                                <button
                                    type="button"
                                    onClick={() => resetTransientState('forgot-password')}
                                    className="text-[#2364EB] hover:text-[#1a4fb8] font-semibold transition-colors bg-transparent border-none p-0"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2364EB] hover:bg-[#1a4fb8] text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}

                    {mode === 'signup' && (
                        <form className="space-y-5" onSubmit={submitHandler}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password (min 6 characters)</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingSendOTP}
                                className="w-full bg-[#2364EB] hover:bg-[#1a4fb8] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loadingSendOTP ? 'Sending OTP...' : 'Register'}
                            </button>
                        </form>
                    )}

                    {mode === 'verify-otp' && (
                        <form className="space-y-5" onSubmit={submitHandler}>
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-[#2364EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-[#2364EB]" size={28} />
                                </div>
                                <p className="text-gray-600 text-sm">
                                    We've sent a 6-digit OTP to <strong className="text-gray-800">{email}</strong>
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-center text-xl font-mono text-slate-800 tracking-widest"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingVerifyOTP || otp.length !== 6}
                                className="w-full bg-[#2364EB] hover:bg-[#1a4fb8] text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loadingVerifyOTP ? 'Verifying...' : 'Verify & Create Account'}
                            </button>
                            <div className="text-center text-sm text-gray-500">
                                Didn't receive OTP?{' '}
                                <button
                                    type="button"
                                    onClick={() => resetTransientState('signup')}
                                    className="text-[#2364EB] font-semibold hover:text-[#1a4fb8] hover:underline bg-transparent border-none p-0 transition-colors"
                                >
                                    Try again
                                </button>
                            </div>
                        </form>
                    )}

                    {mode === 'forgot-password' && (
                        <form className="space-y-5" onSubmit={submitHandler}>
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-[#2364EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-[#2364EB]" size={28} />
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Enter your email address and we'll send you a reset code
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingForgot}
                                className="w-full bg-[#2364EB] hover:bg-[#1a4fb8] text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loadingForgot ? 'Sending...' : 'Send Reset Code'}
                            </button>
                            <div className="text-center text-sm text-gray-500">
                                Remember your password?{' '}
                                <button
                                    type="button"
                                    onClick={() => resetTransientState('login')}
                                    className="text-[#2364EB] font-semibold hover:text-[#1a4fb8] hover:underline bg-transparent border-none p-0 transition-colors"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    )}

                    {mode === 'reset-password' && (
                        <form className="space-y-5" onSubmit={submitHandler}>
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-[#2364EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Key className="text-[#2364EB]" size={28} />
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Enter the OTP sent to <strong className="text-gray-800">{email}</strong> and your new password
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-center text-xl font-mono text-slate-800 tracking-widest"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-[#2364EB] focus:ring-1 focus:ring-[#2364EB] transition-all text-slate-800"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingReset || otp.length !== 6}
                                className="w-full bg-[#2364EB] hover:bg-[#1a4fb8] text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loadingReset ? 'Resetting...' : 'Reset Password'}
                            </button>
                            <div className="text-center text-sm text-gray-500">
                                <button
                                    type="button"
                                    onClick={() => resetTransientState('forgot-password')}
                                    className="text-[#2364EB] font-semibold hover:text-[#1a4fb8] hover:underline bg-transparent border-none p-0 transition-colors"
                                >
                                    Try different email
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={handleClose}></div>
        </div>
    );
};

export default AuthDrawer;
