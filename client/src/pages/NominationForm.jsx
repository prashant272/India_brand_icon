import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiX, FiRefreshCcw } from "react-icons/fi";
import { Crown } from "lucide-react";
import { createNomination, fetchNominationById, updateUserNomination } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHero } from "../components/Motion.jsx";

const categoryMap = {
  "Business & Entrepreneurship": {
    "Overall Excellence": [
      "Entrepreneur of the Year",
      "Business Excellence Award",
      "Outstanding Enterprise of the Year",
      "Most Trusted Business Brand",
      "Best Emerging Business of the Year",
    ],
    "Entrepreneur Type": [
      "Young Entrepreneur of the Year (Under 35)",
      "Women Entrepreneur of the Year",
      "Social Entrepreneur of the Year",
      "First-Generation Entrepreneur of the Year",
      "Serial Entrepreneur of the Year",
      "Rural & Grassroots Entrepreneur of the Year",
    ],
    "Business Growth & Scale": [
      "Excellence in Business Growth & Expansion",
      "Best Family Business of the Year",
      "Best Export-Driven Enterprise",
      "Best Franchise Business of the Year",
      "Best MSME / SME of the Year",
    ],
    "Startup Excellence": [
      "Best Startup of the Year",
      "Most Innovative Startup",
      "Best D2C Brand of the Year",
      "Best Social Impact Startup",
      "Rising Startup to Watch",
    ],
  },

  "Leadership & Management": {
    "C-Suite & Executive Leadership": [
      "CEO of the Year",
      "MD / Chairman of the Year",
      "COO of the Year",
      "CFO of the Year",
      "CTO / CIO of the Year",
    ],
    "Leadership Excellence": [
      "Visionary Business Leader of the Year",
      "Transformational Leader of the Year",
      "Emerging Business Leader of the Year",
      "Outstanding Women Leader of the Year",
      "Young Leader of the Year (Under 35)",
    ],
    "Functional Leadership": [
      "Outstanding HR & People Leader of the Year",
      "Excellence in Corporate Governance & Ethics",
      "Best Sales & Business Development Leader",
      "Best Marketing Leader of the Year",
      "Excellence in Operations Leadership",
    ],
    "Lifetime & Legacy": [
      "Lifetime Achievement Award",
      "Legend of Industry Award",
      "Outstanding Contribution to Indian Business",
      "Icon of the Year",
    ],
  },

  "Brand & Marketing Excellence": {
    "Brand Awards": [
      "Brand of the Year",
      "Most Trusted Brand of the Year",
      "Rising Brand of the Year",
      "Best Regional Brand of the Year",
      "Best Heritage Brand of the Year",
      "Best Homegrown Indian Brand",
    ],
    "Marketing & Campaign Awards": [
      "Excellence in Digital Marketing",
      "Best Social Media Brand of the Year",
      "Outstanding Advertising Campaign of the Year",
      "Best Content Marketing Initiative",
      "Best Influencer Marketing Campaign",
      "Excellence in Performance Marketing",
    ],
    "Customer Experience": [
      "Excellence in Customer Experience",
      "Best Customer Loyalty Programme",
      "Most Customer-Centric Brand",
      "Best After-Sales Service Brand",
      "Excellence in Brand Communication",
    ],
  },

  "Innovation & Technology": {
    "Innovation Excellence": [
      "Business Innovation Award",
      "Most Innovative Product of the Year",
      "Best Disruptive Business Model",
      "Excellence in Research & Development",
      "Best Made-in-India Innovation",
    ],
    "Technology-Driven Business": [
      "Best Tech-Driven Enterprise",
      "Excellence in AI & Automation Adoption",
      "Best Digital Transformation Initiative",
      "Best E-Commerce Business of the Year",
      "Best Fintech Innovation of the Year",
    ],
    "Emerging Tech Sectors": [
      "Best SaaS / Software Company",
      "Best AgriTech Company",
      "Best EdTech Company",
      "Best CleanTech / GreenTech Company",
      "Best HealthTech Company",
      "Best Logistics & Supply Chain Tech Company",
    ],
  },

  "Social Impact & CSR": {
    "CSR Excellence": [
      "Excellence in Corporate Social Responsibility",
      "Best CSR Initiative of the Year",
      "Outstanding Community Development Programme",
      "Best Workplace Inclusivity Initiative",
      "Environmental Sustainability Excellence Award",
    ],
    "Social Impact": [
      "Outstanding Contribution to Education",
      "Excellence in Skill Development & Livelihood",
      "Rural Development & Empowerment Award",
      "Women Empowerment Initiative of the Year",
      "Best NGO / Non-Profit Partner Brand",
      "Best Green Business of the Year",
    ],
  },

  "Sector-Specific Excellence": {
    "Manufacturing & Industry": [
      "Best Manufacturing Company of the Year",
      "Excellence in Industrial Innovation",
      "Best Export-Oriented Manufacturer",
      "Best MSME Manufacturer of the Year",
      "Make in India Excellence Award",
      "Best Industrial Brand of the Year",
    ],
    "Real Estate & Infrastructure": [
      "Best Real Estate Developer of the Year",
      "Excellence in Affordable Housing",
      "Best Commercial Real Estate Project",
      "Best Sustainable Construction Brand",
      "Outstanding Infrastructure Company of the Year",
    ],
    "Education & Skill Development": [
      "Best Educational Institution of the Year",
      "Best Skill Development Organisation",
      "Outstanding School of the Year",
      "Best Higher Education Institute",
      "Best Vocational Training Brand",
      "Best EdTech Platform of the Year",
    ],
    "Healthcare Business & Management": [
      "Best Healthcare Business Leader",
      "Outstanding Hospital Brand of the Year",
      "Best Wellness Brand of the Year",
      "Best Pharma Brand of the Year",
      "Best Healthcare Startup of the Year",
    ],
    "Retail, FMCG & Consumer Goods": [
      "Best Retail Brand of the Year",
      "Best FMCG Brand of the Year",
      "Best Homegrown Consumer Brand",
      "Best Luxury Brand of the Year",
      "Best Food & Beverage Brand of the Year",
      "Best Fashion & Lifestyle Brand",
    ],
    "Financial Services": [
      "Best NBFC / Microfinance Brand",
      "Best Insurance Brand of the Year",
      "Best Wealth Management Firm",
      "Excellence in Financial Inclusion",
      "Best Fintech Brand of the Year",
      "Best Banking Service Excellence Award",
    ],
    "Media, Entertainment & PR": [
      "Best Media Brand of the Year",
      "Best PR & Communications Agency",
      "Outstanding Content Creator / Digital Influencer",
      "Best OTT / Streaming Platform",
      "Excellence in Journalism & Media Leadership",
    ],
  },
};

const initialForm = {
  nominationType: "indiaBrandIcon",
  participationType: "nominated as award", // default
  category: "",
  subCategory: "",
  awardTitle: "",
  otherAwardTitle: "",

  nomineeName: "",
  organization: "",
  turnover: "",
  designation: "",
  mobile: "",
  email: "",

  orgHeadName: "",
  orgHeadDesignation: "",
  orgHeadMobile: "",
  orgHeadEmail: "",

  contactName: "",
  contactDesignation: "",
  contactMobile: "",
  contactEmail: "",

  website: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",

  street: "",
  city: "",
  state: "",
  zip: "",

  preferredLocation: [],
  pdf: null,
  remarks: "",
  acceptTerms: false,
};

export default function NominationForm() {
  const { id } = useParams();
  const { token, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const inputRef = useRef({});

  const isEditMode = !!id;

  // Load existing nomination if editing
  useEffect(() => {
    if (isEditMode && token) {
      const load = async () => {
        try {
          setLoading(true);
          const data = await fetchNominationById(id, token);

          if (data.status !== "nominated") {
            setError("This nomination can no longer be edited.");
            return;
          }

          setForm(prev => ({
            ...prev,
            ...data,
            subCategory: data.subCategory || "",
            otherSubCategory: data.otherSubCategory || "",
            acceptTerms: false,
          }));
        } catch (err) {
          setError(err.message || "Failed to load nomination data");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [id, token, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (name === "participationType") {
      setForm(() => ({
        ...initialForm,
        participationType: value,
      }));
      setFieldErrors({});
      return;
    }

    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
        otherSubCategory: "",
      }));
      return;
    }

    if (name === "subCategory") {
      setForm((prev) => ({
        ...prev,
        subCategory: value,
        otherSubCategory: value === "Other" ? prev.otherSubCategory : "",
      }));
      return;
    }

    // Phone Input Restriction
    const phoneFields = ["mobile", "contactMobile", "orgHeadMobile"];
    if (phoneFields.includes(name)) {
      const allowedRegex = /^[\d\s\+\-\(\)]*$/;
      if (!allowedRegex.test(value)) {
        alert("Text are not allowed! Please enter only phone number.");
        return;
      }
    }

    // Handle multi-select fields (e.g., preferredLocation)
    if (name === "preferredLocation") {
      setForm((prev) => {
        const currentLocations = Array.isArray(prev.preferredLocation) ? prev.preferredLocation : [];
        const newLocations = currentLocations.includes(value)
          ? currentLocations.filter((loc) => loc !== value)
          : [...currentLocations, value];
        return { ...prev, preferredLocation: newLocations };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredAward = [
      "category", "subCategory", "nomineeName", "organization",
      "orgHeadName", "orgHeadDesignation", "orgHeadMobile", "orgHeadEmail",
      "contactName", "contactDesignation", "contactMobile", "contactEmail",
      "street", "city", "state", "zip"
    ];
    const requiredOther = ["nomineeName", "organization", "designation", "mobile", "email"];

    const list = form.participationType === "nominated as award" ? requiredAward : requiredOther;

    list.forEach(field => {
      if (!form[field] || (typeof form[field] === "string" && form[field].trim() === "")) {
        errors[field] = "Required";
      }
    });

    const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
    const phoneFields = ["mobile", "contactMobile", "orgHeadMobile"];

    phoneFields.forEach(field => {
      if (form[field] && form[field].trim() !== "" && !phoneRegex.test(form[field])) {
        errors[field] = "Invalid format";
      }
    });

    if (form.participationType === "nominated as award" && form.subCategory === "Other" && !form.otherSubCategory) {
      errors.otherSubCategory = "Specify category";
    }

    if (!form.acceptTerms) {
      errors.acceptTerms = "Required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      alert("Please fill all mandatory fields marked in red.");

      const currentErrors = {};
      const requiredAward = ["category", "subCategory", "nomineeName", "organization", "orgHeadName", "orgHeadDesignation", "orgHeadMobile", "orgHeadEmail", "contactName", "contactDesignation", "contactMobile", "contactEmail", "street", "city", "state", "zip"];
      const requiredOther = ["nomineeName", "organization", "designation", "mobile", "email"];
      const list = form.participationType === "nominated as award" ? requiredAward : requiredOther;

      list.forEach(f => { if (!form[f] || (typeof form[f] === "string" && form[f].trim() === "")) currentErrors[f] = true; });

      const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
      ["mobile", "contactMobile", "orgHeadMobile"].forEach(f => {
        if (form[f] && !phoneRegex.test(form[f])) currentErrors[f] = true;
      });

      if (form.participationType === "nominated as award" && form.subCategory === "Other" && !form.otherSubCategory) currentErrors.otherSubCategory = true;
      if (!form.acceptTerms) currentErrors.acceptTerms = true;

      const keys = Object.keys(currentErrors);
      if (keys.length > 0 && inputRef.current[keys[0]]) {
        inputRef.current[keys[0]].scrollIntoView({ behavior: "smooth", block: "center" });
        inputRef.current[keys[0]].focus();
      }
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === "preferredLocation") {
          form[key].forEach(loc => formData.append("preferredLocation", loc));
        } else if (key === "pdf" && form[key]) {
          formData.append("pdf", form[key]);
        } else if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      if (isEditMode) {
        await updateUserNomination(id, formData, token);
        navigate(`/dashboard`);
      } else {
        const response = await createNomination(formData, token);
        if (response?.autoCreated) {
          navigate("/success", { state: { autoCreated: true, email: form.contactEmail || form.email } });
        } else {
          navigate("/success");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const groupedSubCategories = categoryMap[form.category] || {};

  const getSelectClass = (name) => {
    const base = "w-full bg-black/60 border rounded-lg px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-[#d4af37]/50";
    const errorClass = fieldErrors[name] ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "border-white/20 hover:border-[#d4af37]/40";
    return `${base} ${errorClass}`;
  };

  const getInputClass = (name) => {
    const base = "w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:bg-white/10 focus:ring-2 focus:ring-[#d4af37]/50";
    const errorClass = fieldErrors[name] ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "border-white/20 hover:border-[#d4af37]/40";
    return `${base} ${errorClass}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3a1418] flex items-center justify-center">
        <FiRefreshCcw className="text-[#d4af37] w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <PageHero
      colorScheme="gold"
      className=""
      badge="Official Nomination Registry 2026"
      icon="🏆"
      title="India Brand Icon Award & Conference, 2026"
      subtitle={isEditMode
        ? "Refine your submission to ensure every detail shines for the jury review."
        : "Honor the pioneers, celebrate the innovators. Nominate yourself or your brand for India's most prestigious brand icon award."
      }
    >
      <div className="max-w-5xl mx-auto px-4 pb-32 relative z-10">
        <div className="mt-15 flex justify-between items-center ">
          <button
            onClick={() => isEditMode ? navigate(-1) : navigate("/")}
            className="flex items-center gap-2 text-[#d4af37] hover:text-[#f2d06b] transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <FiArrowLeft className="text-lg" /> {isEditMode ? "Go Back" : "Back to Home"}
          </button>
          {authUser && (
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/10">
              Authenticated: {authUser.email}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-center">
            <p className="font-bold flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </p>
          </div>
        )}

        <div className="glass-card p-4 sm:p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">

            {/* Participation Choice */}
            <div className="md:col-span-2 space-y-6">
              <label className="text-sm font-bold text-[#d4af37] uppercase tracking-widest pl-1">
                APPLY AS
              </label>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pt-4">
                {[
                  { id: "nominated as award", prefix: "Apply for", highlight: "Awarded", primary: true },
                  { id: "attend as speaker", prefix: "Attend as", highlight: "Speaker", primary: false },
                  { id: "attend as exhibitor", prefix: "Attend as", highlight: "Exhibitor", primary: false },
                  { id: "attend as sponsor", prefix: "Attend as", highlight: "Sponsor", primary: false },
                ].map((type) => (
                  <label
                    key={type.id}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-8 rounded-xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-500 overflow-hidden
                      ${form.participationType === type.id
                        ? type.primary
                          ? "bg-gradient-to-br from-[#d4af37] via-[#f2d06b] to-[#b8860b] border-transparent text-black scale-[1.05] shadow-[0_20px_40px_rgba(212,175,55,0.4)] ring-4 ring-[#d4af37]/20"
                          : "bg-gradient-to-br from-[#c62828] via-[#e53935] to-[#b71c1c] border-transparent text-white scale-[1.05] shadow-[0_20px_40px_rgba(198,40,40,0.4)] ring-4 ring-red-500/20"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-[#d4af37]/40 hover:scale-[1.02] shadow-xl"
                      }`}
                  >
                    <input
                      type="radio"
                      name="participationType"
                      value={type.id}
                      checked={form.participationType === type.id}
                      onChange={handleChange}
                      className="hidden"
                    />

                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <span className={`text-[8px] sm:text-xs font-bold uppercase tracking-widest mb-1 transition-colors duration-300 ${form.participationType === type.id ? "opacity-90" : "text-gray-500"}`}>
                        {type.prefix}
                      </span>
                      <span className={`text-sm sm:text-2xl font-black uppercase tracking-tighter leading-none transition-all duration-300 ${form.participationType === type.id ? "scale-110" : "text-[#d4af37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"}`}>
                        {type.highlight}
                      </span>
                    </div>

                    {form.participationType === type.id && (
                      <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-ping ${type.primary ? "bg-black" : "bg-white"}`}></div>
                    )}
                  </label>
                ))}
              </div>
            </div>


            {form.participationType === "nominated as award" ? (
              <>
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="sm:col-span-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Category
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category *</label>
                    <select
                      name="category"
                      ref={el => inputRef.current.category = el}
                      value={form.category}
                      onChange={handleChange}
                      className={getSelectClass("category")}
                    >
                      <option value="" className="bg-[#3a1418]">Select Category</option>
                      {Object.keys(categoryMap).map((t) => (
                        <option key={t} value={t} className="bg-[#3a1418]">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sub Category *</label>
                    <select
                      name="subCategory"
                      ref={el => inputRef.current.subCategory = el}
                      value={form.subCategory}
                      onChange={handleChange}
                      disabled={!form.category}
                      className={getSelectClass("subCategory")}
                    >
                      <option value="" className="bg-[#3a1418]">Select Subcategory</option>
                      {Object.entries(groupedSubCategories).map(([group, list]) => (
                        <optgroup key={group} label={group} className="bg-black text-[#d4af37] font-bold">
                          {list.map((item) => (
                            <option key={item} value={item} className="bg-[#3a1418] text-white font-normal">
                              {item}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      {form.category && (
                        <option value="Other" className="bg-[#3a1418] text-[#d4af37] font-bold italic">Other Category...</option>
                      )}
                    </select>
                  </div>

                  {form.subCategory === "Other" && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">Custom Category Details *</label>
                      <input
                        name="otherSubCategory"
                        ref={el => inputRef.current.otherSubCategory = el}
                        value={form.otherSubCategory}
                        onChange={handleChange}
                        placeholder="Type your suggested category title here"
                        className={`${getInputClass("otherSubCategory")} border-[#d4af37]/30 ring-[#d4af37]/10`}
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Nominee Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name of Nominee / Professional *</label>
                      <input
                        name="nomineeName"
                        ref={el => inputRef.current.nomineeName = el}
                        placeholder="Ex: Dr. Prashant Kumar"
                        value={form.nomineeName}
                        onChange={handleChange}
                        className={getInputClass("nomineeName")}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Organization / Hospital / Institution *</label>
                      <input
                        name="organization"
                        ref={el => inputRef.current.organization = el}
                        placeholder="Organization Name"
                        value={form.organization}
                        onChange={handleChange}
                        className={getInputClass("organization")}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Annual Turnover (Last FY)</label>
                      <input
                        name="turnover"
                        placeholder="Ex: 50 Cr / 10M USD"
                        value={form.turnover}
                        onChange={handleChange}
                        className={getInputClass("turnover")}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Organization Head Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Head Name *</label>
                      <input name="orgHeadName" ref={el => inputRef.current.orgHeadName = el} value={form.orgHeadName} onChange={handleChange} className={getInputClass("orgHeadName")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Designation *</label>
                      <input name="orgHeadDesignation" ref={el => inputRef.current.orgHeadDesignation = el} value={form.orgHeadDesignation} onChange={handleChange} className={getInputClass("orgHeadDesignation")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number *</label>
                      <input name="orgHeadMobile" ref={el => inputRef.current.orgHeadMobile = el} value={form.orgHeadMobile} onChange={handleChange} className={getInputClass("orgHeadMobile")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Official Email *</label>
                      <input name="orgHeadEmail" ref={el => inputRef.current.orgHeadEmail = el} value={form.orgHeadEmail} onChange={handleChange} className={getInputClass("orgHeadEmail")} />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Contact Person Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Name *</label>
                      <input name="contactName" ref={el => inputRef.current.contactName = el} value={form.contactName} onChange={handleChange} className={getInputClass("contactName")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Designation *</label>
                      <input name="contactDesignation" ref={el => inputRef.current.contactDesignation = el} value={form.contactDesignation} onChange={handleChange} className={getInputClass("contactDesignation")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile *</label>
                      <input name="contactMobile" ref={el => inputRef.current.contactMobile = el} value={form.contactMobile} onChange={handleChange} className={getInputClass("contactMobile")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email *</label>
                      <input name="contactEmail" ref={el => inputRef.current.contactEmail = el} value={form.contactEmail} onChange={handleChange} className={getInputClass("contactEmail")} />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Social Media Presence
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Website</label>
                      <input name="website" placeholder="https://yourwebsite.com" value={form.website} onChange={handleChange} className={getInputClass("website")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Facebook</label>
                      <input name="facebook" placeholder="Facebook Profile/Page Link" value={form.facebook} onChange={handleChange} className={getInputClass("facebook")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Instagram</label>
                      <input name="instagram" placeholder="Instagram Profile Link" value={form.instagram} onChange={handleChange} className={getInputClass("instagram")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">YouTube</label>
                      <input name="youtube" placeholder="YouTube Channel Link" value={form.youtube} onChange={handleChange} className={getInputClass("youtube")} />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-white/5 space-y-6">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Location & Logistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Street Address *</label>
                      <input name="street" ref={el => inputRef.current.street = el} value={form.street} onChange={handleChange} className={getInputClass("street")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City *</label>
                      <input name="city" ref={el => inputRef.current.city = el} value={form.city} onChange={handleChange} className={getInputClass("city")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State *</label>
                      <input name="state" ref={el => inputRef.current.state = el} value={form.state} onChange={handleChange} className={getInputClass("state")} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ZIP Code *</label>
                      <input name="zip" ref={el => inputRef.current.zip = el} value={form.zip} onChange={handleChange} className={getInputClass("zip")} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="md:col-span-2 p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#d4af37]/20 flex items-center justify-center mb-6 border border-[#d4af37]/30 shadow-inner text-2xl">
                    📝
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#d4af37] mb-2 uppercase tracking-tighter text-center">Registration Info</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-8 text-center max-w-md italic">
                    You are registering to attend as a {form.participationType.split(' ').pop()}. Our team will review your profile and reach out for coordination.
                  </p>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Full Name *</label>
                      <input name="nomineeName" ref={el => inputRef.current.nomineeName = el} placeholder="Ex: Dr. Prashant Kumar" value={form.nomineeName} onChange={handleChange} className={getInputClass("nomineeName")} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Organization *</label>
                      <input name="organization" ref={el => inputRef.current.organization = el} placeholder="Company / Institution Name" value={form.organization} onChange={handleChange} className={getInputClass("organization")} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Annual Turnover</label>
                      <input name="turnover" placeholder="Ex: 50 Cr / 10M USD" value={form.turnover} onChange={handleChange} className={getInputClass("turnover")} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Designation *</label>
                      <input name="designation" ref={el => inputRef.current.designation = el} placeholder="Current Job Title" value={form.designation} onChange={handleChange} className={getInputClass("designation")} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Mobile Contact *</label>
                      <input name="mobile" ref={el => inputRef.current.mobile = el} placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={handleChange} className={getInputClass("mobile")} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Official Email *</label>
                      <input name="email" ref={el => inputRef.current.email = el} placeholder="work@domain.com" value={form.email} onChange={handleChange} className={getInputClass("email")} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-3 ml-1">Portfolio / Website</label>
                      <input name="website" placeholder="https://example.com" value={form.website} onChange={handleChange} className={getInputClass("website")} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Preferred Event Location */}
            <div className="md:col-span-2 pt-8 border-t border-white/5 space-y-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Preferred Event Location
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1 mt-1">
                  (Optional - Please select your preference)
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {["Mumbi", "Hydrabad", "New Delhi"].map((loc) => (
                  <label
                    key={loc}
                    className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer text-center
                      ${form.preferredLocation?.includes(loc)
                        ? "bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] shadow-[0_5px_15px_rgba(212,175,55,0.2)]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                      }`}
                  >
                    <input
                      type="checkbox"
                      name="preferredLocation"
                      value={loc}
                      checked={form.preferredLocation?.includes(loc)}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PDF Support Document Upload */}
            <div className="md:col-span-2 pt-8 border-t border-white/5 space-y-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Support Document (Optional)
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1 mt-1">
                  Upload any supporting document or profile (PDF only, max 5MB)
                </p>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  name="pdf"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type === "application/pdf") {
                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size exceeds 5MB limit.");
                        e.target.value = "";
                        return;
                      }
                      setForm(prev => ({ ...prev, pdf: file }));
                    } else if (file) {
                      alert("Please upload a valid PDF file.");
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                    ${form.pdf
                      ? "bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-[#d4af37]/40"
                    }`}
                >
                  <div className="text-3xl mb-3">
                    {form.pdf ? "📄" : "📤"}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">
                    {form.pdf ? form.pdf.name : "Click to select PDF"}
                  </span>
                  {form.pdf && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setForm(prev => ({ ...prev, pdf: null }));
                        document.getElementById('pdf-upload').value = "";
                      }}
                      className="mt-4 text-[10px] font-black underline uppercase tracking-tighter hover:text-white"
                    >
                      Remove File
                    </button>
                  )}
                </label>
              </div>
            </div>

            <div className="md:col-span-2 pt-8 border-t border-white/5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Additional Remarks</label>
              <textarea name="remarks" value={form.remarks} onChange={handleChange} rows={4} placeholder="Your message..." className={`${getInputClass("remarks")} resize-none`} />
            </div>

            <div className="md:col-span-2 bg-white/5 border border-white/5 p-6 rounded-2xl group transition-all hover:bg-white/[0.07]">
              <label className="flex gap-4 cursor-pointer select-none">
                <div className="relative flex items-center pt-1">
                  <input type="checkbox" name="acceptTerms" ref={el => inputRef.current.acceptTerms = el} checked={form.acceptTerms} onChange={handleChange} className="w-5 h-5 rounded border-2 border-[#d4af37]/40 bg-transparent checked:bg-[#d4af37] appearance-none transition-all cursor-pointer" />
                  {form.acceptTerms && <span className="absolute left-[3px] top-[4px] text-black text-[10px] font-bold pointer-events-none">✓</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm tracking-tight transition-colors ${fieldErrors.acceptTerms ? "text-red-400" : "text-gray-300"}`}>
                    <span className="font-bold text-[#d4af37]">DECLARATION:</span> I hereby verify that I have reviewed the Terms & Conditions. The data provided is true to the best of my knowledge.
                  </p>
                </div>
              </label>
            </div>

            <div className="md:col-span-2 flex flex-col items-center gap-4 py-8">
              <button
                type="submit"
                disabled={submitting}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-12 py-4 font-black tracking-[0.2em] uppercase transition-all duration-300 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black rounded-full overflow-hidden shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(212,175,55,0.6)] hover:-translate-y-1 active:scale-95 disabled:grayscale disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {submitting ? "Processing..." : isEditMode ? "Update Submission" : "Submit Registration"}
                  {!submitting && <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>}
                </span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
              </button>
            </div>

          </form>
        </div>
      </div>
    </PageHero>
  );
}
