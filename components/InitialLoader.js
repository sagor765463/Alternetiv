"use client";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Show loader for a short duration only on first hard load / refresh
    const timer = setTimeout(() => {
      setShow(false);
    }, 800); // 0.8 second loader
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999]"
        >
          <Loader fullScreen={true} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
