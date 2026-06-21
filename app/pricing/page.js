"use client";

import Navbar from "../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkDone } from "react-icons/io5";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const BILLING = ["Monthly", "Yearly", "Permanent"];

const plans = [
  {
    name: "Premium",
    tag: "Starter",
    popular: false,
    features: ["Aimbot", "Chams Functionality", "Camera & Fast Landing", "Glitch Fire", "Community Support", "More Functions"],
    prices: { Monthly: "200৳", Yearly: "1500৳", Permanent: "3000৳" },
  },
  {
    name: "UID Bypass",
    tag: " Popular",
    popular: true,
    features: ["Uid Control System", "Smooth Bypass", "One Time Setup Only", "No Lag / Network Issue", "Community Support", "More Functions"],
    prices: { Monthly: "350৳", Yearly: "2500৳", Permanent: "5000৳" },
  },
  {
    name: "Internal",
    tag: "Pro",
    popular: false,
    features: ["Aimbot Visible", "Force Aim", "Aimbot Female Fix", "Chams Functionality", "Camera & Fast Landing", "More Functions"],
    prices: { Monthly: "450৳", Yearly: "3000৳", Permanent: "6500৳" },
  },
  {
    name: "ESP Overlay",
    tag: "Visual",
    popular: false,
    features: ["External Overlay", "Zero FPS Drop", "Custom Colors & Fonts", "Stream-proof Rendering", "Player Distance Info", "More Functions"],
    prices: { Monthly: "300৳", Yearly: "2000৳", Permanent: "4000৳" },
  },
  {
    name: "HWID Spoofer",
    tag: "Security",
    popular: false,
    features: ["Bypass Hardware Bans", "Spoof Disk & MAC", "Motherboard Serial Spoof", "One-click Spoofing", "Clean Anti-cheat Traces", "More Functions"],
    prices: { Monthly: "500৳", Yearly: "3500৳", Permanent: "7000৳" },
  },
  {
    name: "Kernel Driver",
    tag: "Elite",
    popular: false,
    features: ["Ring 0 Memory Access", "Bypass EAC / BattlEye", "Shared Memory Comms", "Undetected DLL Mapping", "Priority Support", "More Functions"],
    prices: { Monthly: "700৳", Yearly: "5000৳", Permanent: "10000৳" },
  },
];

const durationLabel = {
  Monthly: "/month",
  Yearly: "/year",
  Permanent: "one-time",
};

export default function PricingPage() {
  const [billing, setBilling] = useState("Yearly");

  const handleWhatsApp = (plan) => {
    const phoneNumber = "8801410374716";
    const message = `Hello FINEX CORP!\n\nI want to purchase the following plan:\n🔹 *Plan:* ${plan.name}\n🔹 *Duration:* ${billing}\n🔹 *Price:* ${plan.prices[billing]}\n\nPlease let me know how to pay.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-darker to-background text-white font-outfit">
      <Navbar />

      <main className="relative overflow-hidden pt-24">
        {/* Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-15 pointer-events-none"></div>

        {/* Header */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 pt-12 pb-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gray-400"
          >
            Pricing Plans
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 text-5xl font-black tracking-tight text-white sm:text-6xl"
          >
            Unlock Premium Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-4 max-w-xl text-base text-gray-400"
          >
            Choose the plan that fits your needs.
          </motion.p>
          {/* Billing Toggle — sits in header, above the divider line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
            className="mt-10 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] p-1.5 backdrop-blur-xl"
          >
            {BILLING.map((option) => (
              <button
                key={option}
                onClick={() => setBilling(option)}
                className={`rounded-full px-7 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  billing === option
                    ? "bg-primary text-white shadow-lg shadow-primary/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Cards Section */}
        <section className="relative z-10 border-t border-white/10 bg-white/[0.02] pt-32 pb-20">

          {/* Grid */}
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index + 1}
                  variants={fadeUp}
                  className={`relative flex flex-col rounded-[28px] border p-7 transition duration-300 ${
                    plan.popular
                      ? "border-primary/40 bg-white/[0.07] shadow-2xl shadow-primary/20"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-6 left-1/2 z-10 -translate-x-1/2">
                      <span className="inline-flex rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/30 whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`flex flex-col gap-4 ${plan.popular ? "mt-4" : ""}`}>
                    {/* Tag + Name */}
                    <div>
                      <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        {plan.tag}
                      </span>
                      <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-2">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.name}-${billing}`}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="text-4xl font-black text-primary leading-none"
                        >
                          {plan.prices[billing]}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs text-gray-500 mb-1">{durationLabel[billing]}</span>
                    </div>

                    {billing === "Permanent" && (
                      <p className="text-xs text-green-400 font-semibold -mt-1">✓ Lifetime — pay once, use forever</p>
                    )}
                    {billing === "Yearly" && (
                      <p className="text-xs text-green-400 font-semibold -mt-1">✓ Save ~30% vs monthly</p>
                    )}

                    <div className="border-t border-white/10" />

                    <ul className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                          <IoCheckmarkDone className="h-4 w-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => handleWhatsApp(plan)}
                      className={`w-full rounded-full py-3 text-sm font-bold tracking-wide transition-all duration-300 ${
                        plan.popular
                          ? "bg-primary text-white hover:bg-accent hover:scale-[1.02] shadow-lg shadow-primary/30"
                          : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10 shadow-2xl shadow-primary/10"
          >
            <h2 className="text-3xl font-bold text-white">Why Choose FINEX CORP!</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { title: "Instant Access", description: "Get immediate access to all features right after purchase." },
                { title: "24/7 Support", description: "Dedicated support team available round the clock." },
                { title: "Free Updates", description: "All future updates and new features included free." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
