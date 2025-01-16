"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="flex">
        {showSidebar && !isQuizActive && <Sidebar />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default RootLayout;
