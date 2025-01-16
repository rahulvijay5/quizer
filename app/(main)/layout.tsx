"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Add keyboard shortcut for toggling sidebar
  useHotkeys('mod+\\', () => {
    if (!isQuizActive && !isLandingPage) {
      setShowSidebar(prev => !prev);
    }
  });

  useEffect(() => {
    const handleQuizStateChange = ((event: CustomEvent) => {
      setIsQuizActive(event.detail.isActive);
      setShowSidebar(!event.detail.isActive);
    }) as EventListener;

    window.addEventListener('quizStateChange', handleQuizStateChange);
    return () => window.removeEventListener('quizStateChange', handleQuizStateChange);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {!isLandingPage && (
        <>
          <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
          <div className="flex">
            {showSidebar && !isQuizActive && <Sidebar />}
            <main className="flex-1">{children}</main>
          </div>
        </>
      )}
      {isLandingPage && (
        <main className="flex-1">
          <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
            <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
                <svg
                  aria-hidden="true"
                  className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
                >
                  <defs>
                    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                      <circle cx="4" cy="4" r="2" className="fill-current" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" strokeWidth="0" fill="url(#dots)" />
                </svg>
              </div>
            </div>
          </div>
          {children}
        </main>
      )}
    </div>
  );
};

export default RootLayout;
