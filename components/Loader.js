"use client";
import { motion } from "framer-motion";

export default function Loader({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[100] flex items-center justify-center bg-background"
    : "flex items-center justify-center w-full min-h-[calc(100vh-100px)]";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        {/* Simple single white spinning circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-[3px] border-white/20 border-t-white"
        />
      </div>
    </div>
  );
}
