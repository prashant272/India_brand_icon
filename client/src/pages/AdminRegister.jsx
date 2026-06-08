import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiShield, FiUser, FiMail, FiLock, FiKey, FiArrowRight, FiHome } from "react-icons/fi";
import { PageHero } from "../components/Motion.jsx";

export default function AdminRegister() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secretCode, setSecretCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setSubmitting(true);
            await register(name, email, password, secretCode);
            navigate("/admin", { replace: true });
        } catch (err) {
            setError(err.message || "Unable to create admin account");
        } finally {
            setSubmitting(false);
        }
    };

    const adminGrad = "linear-gradient(135deg, #d97706, #3b82f6, #d4af37)";

    return (
        <>
            <PageHero
                badge="Admin Setup"
                icon="🛡️"
                title={<span>System <span className="text-gradient-amber">Register</span></span>}
                subtitle="Initialize a new administrative node for the India Brand Icon Excellence platform."
            >
                <div className="  relative w-full max-w-[440px] flex flex-col items-center pt-2 sm:pt-3md:pt-10  pb-10 justify-center  align-center justify-self-center">
                    {/* Admin Shield Icon */}
                    <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-tr from-amber-600 via-amber-400 to-[#d4af37] rounded-[1.8rem]  flex items-center justify-center shadow-2xl shadow-amber-600/20 group">
                        <FiShield className="h-10 w-10 text-white  group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="w-full glass-card border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-b from-white via-white to-amber-400 bg-clip-text text-transparent tracking-tight mb-2 uppercase">
                                Admin Setup
                            </h2>
                            <p className="text-amber-400/40 text-[8px] font-black uppercase tracking-[0.5em] ml-1">
                                New Administrative Node
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5 group">
                                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-400/60 group-focus-within:text-amber-400 transition-colors ml-1">
                                    <FiUser /> Admin Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Admin Name"
                                />
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-400/60 group-focus-within:text-amber-400 transition-colors ml-1">
                                    <FiMail /> Internal Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@internal.com"
                                />
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                                    <FiKey /> System Access Token
                                </label>
                                <input
                                    type="password"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#d4af37]/40 focus:bg-white/[0.06] transition-all"
                                    value={secretCode}
                                    onChange={(e) => setSecretCode(e.target.value)}
                                    required
                                    placeholder="Secret Key"
                                />
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-400/60 group-focus-within:text-amber-400 transition-colors ml-1">
                                    <FiLock /> Set Security Key
                                </label>
                                <input
                                    type="password"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Min 6 chars"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full group relative flex items-center justify-center h-14 rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-50 mt-8 mb-6"
                            >
                                <div
                                    className="absolute inset-0 transition-transform group-hover:scale-110"
                                    style={{ background: adminGrad }}
                                />
                                <span className="relative flex items-center gap-3  text-white font-black uppercase tracking-widest text-[11px]">
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Checking clearance...
                                        </>
                                    ) : (
                                        <>
                                            Initialise Account <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 pt-6 pb-4 border-t border-white/5 text-center">
                            <p className="text-amber-200/20 text-[9px] font-black uppercase tracking-widest">
                                Existing node?{" "}
                                <Link
                                    to="/admin/login"
                                    className="text-amber-400 hover:text-white transition-colors ml-2 underline decoration-amber-400/20"
                                >
                                    System Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </PageHero>
        </>
    );
}
