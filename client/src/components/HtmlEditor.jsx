import React from 'react';

/**
 * HtmlEditor Component
 * Currently a simple wrapper around a textarea for HTML input.
 * Designed to be easily swappable with a Rich Text Editor (like ReactQuill or TinyMCE) in the future.
 */
export default function HtmlEditor({ value, onChange, placeholder, rows = 10, className = "" }) {
    return (
        <div className={`html-editor-container ${className}`}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Write your HTML content here..."}
                rows={rows}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-mono"
            />
        </div>
    );
}