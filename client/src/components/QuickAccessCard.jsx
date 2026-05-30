/**
 * QUICK ACCESS CARD COMPONENT
 * 
 * This component displays the form fields (Name, Phone/WhatsApp, Inquiry Type, Purpose)
 * and controls the OTP sending and verification interface.
 * 
 * Key UX / Technical Decisions:
 * 1. Auto-Trigger OTP: Once the phone number reaches exactly 10 digits and the name is filled,
 *    it calls `sendInquiryOTP` in the background automatically. No "Send OTP" button needed.
 * 2. Helper Hints: Displays a reminder `⚠️ Enter name to trigger OTP` if the user enters
 *    a phone number without entering their name first.
 * 3. Resetting state: If the phone number is edited after an OTP is sent, it clears the OTP state
 *    to prevent invalid submissions and prepares for a new OTP trigger.

 */

import { useState, useEffect } from "react";
import { User, Phone, Sparkles, ChevronDown, ArrowRight, Info, X, Check, Loader2 } from "lucide-react";
import { sendInquiryOTP, verifyInquiryOTP } from "../services/api";

export default function QuickAccessCard({ onSuccess, onClose, isModal }) {
    // Form Inputs State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [inquiryType, setInquiryType] = useState("nomination");
    const [purpose, setPurpose] = useState("");
    const [otp, setOtp] = useState("");

    // API Handling State
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpSentTo, setOtpSentTo] = useState(""); // Holds the number we successfully sent OTP to

    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Watch phone number and name. When clean digits reach exactly 10 and name is filled, auto-trigger OTP.
    useEffect(() => {
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length === 10 && name.trim().length > 0 && otpSentTo !== cleanPhone) {
            handleSendOTP(cleanPhone);
        }
    }, [phone, name, otpSentTo]);

    // Triggers the backend call to generate and send OTP via WhatsApp Cloud API
    const handleSendOTP = async (cleanPhone) => {
        setSendingOtp(true);
        setError("");
        try {
            await sendInquiryOTP({ phone: cleanPhone, name: name.trim() });
            setOtpSent(true);
            setOtpSentTo(cleanPhone);
        } catch (err) {
            setError(err.message || "Failed to send OTP. Please check the number and try again.");
            setOtpSent(false);
            setOtpSentTo("");
        } finally {
            setSendingOtp(false);
        }
    };

    // Resets the OTP state if the user changes the phone number after it was already sent
    const handlePhoneChange = (e) => {
        const val = e.target.value;
        setPhone(val);
        const clean = val.replace(/\D/g, "");

        // If number is changed away from what the OTP was sent to, clear the OTP status
        if (clean !== otpSentTo) {
            setOtpSent(false);
            setOtpSentTo("");
            setOtp("");
            setError("");
        }
    };

    // Submits the OTP code alongside the form data to the backend for verification
    const handleVerifyAndSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }
        if (phone.replace(/\D/g, "").length !== 10) {
            setError("Please enter a valid 10-digit WhatsApp number.");
            return;
        }
        if (!otp.trim()) {
            setError("Please enter the verification code.");
            return;
        }

        setVerifying(true);
        setError("");
        try {
            await verifyInquiryOTP({
                name,
                phone: phone.replace(/\D/g, ""),
                inquiryType,
                purpose: inquiryType === "other" ? purpose : "",
                otp
            });
            setSuccess(true);
            setError("");

            // Wait for 1.8 seconds to display the checkmark bounce animation before closing
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1800);
        } catch (err) {
            setError(err.message || "Verification code is invalid or expired.");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className={`w-full ${isModal ? "glass-card border border-white/10" : "bg-[#030712]"} p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group flex flex-col items-center hover:border-indigo-500/20 transition-all duration-500`}>
            {/* Ambient background glows */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Close Modal Button (Top-Right) */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all duration-300"
                    aria-label="Close"
                >
                    <X size={14} />
                </button>
            )}

            {success ? (
                /* 1. SUCCESS STATE VIEW */
                <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-4 relative z-10 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
                        <Check size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wider">
                        Verified Successfully
                    </h3>
                    <p className="text-sm text-indigo-200/60 max-w-xs">
                        Thank you! Your details have been secured. You can now proceed.
                    </p>
                </div>
            ) : (
                /* 2. REGULAR FORM STATE VIEW */
                <form onSubmit={handleVerifyAndSubmit} className="w-full space-y-4 relative z-10">
                    <div className="mb-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-1 bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                            Quick Access
                        </h2>
                        <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest">
                            Verify details to continue
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl font-bold">
                            {error}
                        </div>
                    )}

                    {/* Full Name Input */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-300/70 ml-1">
                            <User size={12} className="text-indigo-400" /> Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={verifying}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                        />
                    </div>

                    {/* WhatsApp Phone Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center mr-1">
                            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-300/70 ml-1">
                                <Phone size={12} className="text-indigo-400" /> WhatsApp Number
                            </label>

                            {/* Dynamically display OTP state badges */}
                            {sendingOtp && (
                                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-indigo-400 animate-pulse">
                                    <Loader2 size={10} className="animate-spin" /> Sending OTP...
                                </span>
                            )}
                            {otpSent && (
                                <span className="text-[9px] font-black uppercase text-emerald-400 flex items-center gap-1">
                                    <Check size={10} /> Sent OTP to WhatsApp
                                </span>
                            )}
                            {phone.replace(/\D/g, "").length === 10 && !name.trim() && !sendingOtp && !otpSent && (
                                <span className="text-[9px] font-black uppercase text-amber-400 animate-pulse">
                                    ⚠️ Enter name to trigger OTP
                                </span>
                            )}
                        </div>
                        <input
                            type="tel"
                            placeholder="10-digit number (e.g. 9876543210)"
                            value={phone}
                            onChange={handlePhoneChange}
                            required
                            disabled={verifying}
                            className={`w-full bg-white/5 border ${otpSent ? "border-emerald-500/30" : "border-white/10"} rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all disabled:opacity-50`}
                        />
                    </div>

                    {/* Inquiry Type Select Dropdown */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-300/70 ml-1">
                            <Sparkles size={12} className="text-indigo-400" /> Inquiry Type
                        </label>
                        <div className="relative w-full">
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                value={inquiryType}
                                onChange={(e) => setInquiryType(e.target.value)}
                                disabled={verifying}
                            >
                                <option value="nomination" className="bg-[#030712] text-slate-400">Nomination Enquiry</option>
                                <option value="general" className="bg-[#030712] text-white">General Inquiry</option>
                                <option value="attending" className="bg-[#030712] text-white">Attending Event</option>
                                <option value="sponsorship" className="bg-[#030712] text-white">Sponsorship</option>
                                <option value="other" className="bg-[#030712] text-white">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-indigo-400/70">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Description Text Area (Shows up only when "Other" is selected) */}
                    {inquiryType === "other" && (
                        <div className="space-y-1.5 animate-fade-in">
                            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-300/70 ml-1">
                                <Info size={12} className="text-indigo-400" /> Please specify your purpose
                            </label>
                            <input
                                type="text"
                                placeholder="State your reason for inquiry"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                required
                                disabled={verifying}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                            />
                        </div>
                    )}

                    {/* Verification Code Input (Transitions in once OTP is sent) */}
                    {otpSent && (
                        <div className="space-y-1.5 animate-slide-down">
                            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 ml-1">
                                <Check size={12} /> Verification Code (OTP)
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                required
                                disabled={verifying}
                                className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-center text-white text-lg tracking-[0.5em] font-mono placeholder:text-white/20 placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                            />
                        </div>
                    )}

                    {/* Form submit button (Disabled until verification code is sent/filled) */}
                    <button
                        type="submit"
                        disabled={!otpSent || verifying}
                        className="btn-primary w-full h-12 text-xs uppercase tracking-widest font-black mt-6 flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {verifying ? (
                            <>
                                <Loader2 size={14} className="animate-spin" /> Verifying Code...
                            </>
                        ) : (
                            <>
                                Verify & Continue <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Security Badge */}
                    <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 relative z-10 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-indigo-300/80">
                            Official Education Awards Access
                        </span>
                    </div>
                </form>
            )}
        </div>
    );
}
