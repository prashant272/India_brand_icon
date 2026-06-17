/**
 * QUICK ACCESS WIDGET CONTROLLER
 * 
 * This component acts as the orchestrator/wrapper for the QuickAccessCard widget.
 * It is rendered globally in App.jsx on all non-admin pages.
 * 
 * Flow & Behavior:
 * 1. Persistent Verification: Checks localStorage to see if the user is already verified.
 *    If verified (`quickAccessVerified === "true"`), the widget returns `null` immediately.
 * 2. Delay Trigger: When visiting the site, it waits for exactly 2 seconds before showing up.
 * 3. Close & Nudge Recycle: If a user closes the modal (by clicking "X"), it is hidden
 *    temporarily, but automatically pops up again after a 2-second delay until they successfully verify.
 */


import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuickAccessCard from "../components/QuickAccessCard";

export default function QuickAccess() {
    // Controls if the popup is visible in the viewport
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    // Check if the client phone number is already verified
    const isVerified = localStorage.getItem("quickAccessVerified") === "true";

    // Track how many times the user has closed the modal
    const closeCount = parseInt(localStorage.getItem("quickAccessCloseCount") || "0", 10);

    useEffect(() => {
        // Stop if the user is already verified
        if (isVerified) {
            setIsVisible(false);
            return;
        }

        // If they have exhausted their close attempts, show it immediately and permanently
        if (closeCount >= 2) {
            setIsVisible(true);
            return;
        }

        // Hide initially on route changes
        setIsVisible(false);

        // Nudge trigger: display the popup after a 15-second delay
        const timer = setTimeout(() => {
            if (localStorage.getItem("quickAccessVerified") !== "true") {
                setIsVisible(true);
            }
        }, 15000);

        // Clean up the timeout timer when component unmounts or route changes
        return () => clearTimeout(timer);
    }, [location.pathname, isVerified, closeCount]);

    // Do not render anything if verified or still waiting for timer
    if (isVerified || !isVisible) return null;

    // Triggered when OTP is verified successfully
    const handleSuccess = () => {
        // Persistently save verification state so they are never prompted again
        localStorage.setItem("quickAccessVerified", "true");
        setIsVisible(false);
    };

    // Triggered when the user clicks the "X" close button
    const handleClose = () => {
        setIsVisible(false);

        // Increment the close count
        const newCount = closeCount + 1;
        localStorage.setItem("quickAccessCloseCount", newCount.toString());

        // Nudge recycle: automatically pop up again after 15 seconds
        setTimeout(() => {
            if (localStorage.getItem("quickAccessVerified") !== "true") {
                setIsVisible(true);
            }
        }, 15000);
    };

    // Show the close button if they have closed it less than 2 times
    const showCloseButton = closeCount < 2;

    return (
        /* Full Screen Backdrop with Backdrop Blur styling */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="w-full max-w-md my-auto relative">
                {/* Renders the stateful registration card inside the modal wrapper */}
                <QuickAccessCard onSuccess={handleSuccess} onClose={showCloseButton ? handleClose : null} isModal={true} />
            </div>
        </div>
    );
}