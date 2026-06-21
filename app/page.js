"use client";

import Navbar from "../components/Navbar";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  FaYoutube,
  FaDiscord,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-darker to-background text-white font-outfit">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animate-pulse"></div>

        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 animate-pulse"></div>

        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 animate-pulse"></div>

        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-64px)] px-8 py-16 z-10 gap-16"
        >
          {/* Left Content */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
          >
            <p className="text-primary text-sm uppercase tracking-widest">
              PC CHEATS
            </p>

            <h1 className="text-5xl md:text-6xl font-bold">
              FINEX{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                CORP!
              </span>
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-gray-300">
              Professional PC panel for Free Fire with anti-ban protection.
              Trusted by 100,000+ players. Advance Protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open("https://discord.gg/AHwg2YA6sE", "_blank")}
                className="cursor-pointer bg-primary hover:bg-accent transition text-white font-bold py-3 px-6 rounded-full"
              >
                Join Discord
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open("https://t.me/+ajYN21pDeQFhNjk1", "_blank")}
                className="cursor-pointer border border-primary text-primary hover:bg-primary hover:text-white transition font-bold py-3 px-6 rounded-full"
              >
                Join Telegram
              </motion.button>
            </div>
          </motion.div>

          {/* Hero Video */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-primary/10 p-3"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-[320px] md:w-[400px] lg:w-[500px] rounded-3xl border border-white/10"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className="relative py-24 px-8 z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col items-center text-center space-y-6 mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Powerful{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Features
                </span>
              </h2>

              <p className="max-w-2xl text-lg leading-relaxed text-gray-300">
                We offer advanced tools and secure technology to give you the
                best gaming experience possible.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  title: "Secure Cheats",
                  description:
                    "Robust protection against cheat engines and debuggers.",
                },
                {
                  title: "Fast & Stable",
                  description: "Lightning-fast scanning with minimal overhead.",
                },
                {
                  title: "Easy to Use",
                  description: "Designed for fast setup and immediate access.",
                },
                {
                  title: "Customizable",
                  description:
                    "Flexible settings for advanced memory scanning.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={fadeUp}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition duration-300 hover:border-primary/40 hover:bg-white/10"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="relative w-14 h-14 flex items-center justify-center mb-6">
                      <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>

                      <div className="relative w-14 h-14 rounded-2xl bg-accent/10 border border-white/10 flex items-center justify-center">
                        <ShieldCheck className="text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Latest Releases */}
        <section className="relative py-24 px-8 z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col items-center text-center space-y-6 mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Latest{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Releases
                </span>
              </h2>

              <p className="max-w-2xl text-lg text-gray-300 leading-relaxed">
                Discover our new aimbot Ai , Fast injection systems, and
                advanced aftermatch auto reset system in C# - C++.
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              {/* Left */}
              <motion.div variants={fadeUp} className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-xl">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>

                  <p className="text-sm tracking-widest uppercase text-primary">
                    Premium C++ OR C# Cheats
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                    AimBot AI <br />
                    <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                      Ultra Fast Aim Assistance
                    </span>
                  </h2>

                  <p className="max-w-xl text-lg leading-relaxed text-gray-300">
                    Discover our new AimBot AI with ultra-fast{" "}
                    <span className="text-primary font-semibold">
                      With Our MemHub 
                    </span>{" "}
                    Any Function Apply In 0.2ms And Highly Secure.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = "/memhub"}
                    className="cursor-pointer bg-primary hover:bg-accent transition-all duration-300 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-primary/20"
                  >
                    Explore Our Products
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open("https://discord.gg/AHwg2YA6sE")}
                    className="cursor-pointer border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 text-white font-semibold py-4 px-8 rounded-2xl"
                  >
                    Get Updates
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div>
                    <h3 className="text-3xl font-bold text-primary">0.2ms</h3>
                    <p className="text-gray-400 text-sm mt-1">Scan Speed</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-primary">100% Safe</h3>
                    <p className="text-gray-400 text-sm mt-1">All Functions</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-primary">24/7</h3>
                    <p className="text-gray-400 text-sm mt-1">Updates</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Video */}
              <div className="relative flex justify-center">
                <div className="absolute w-72 h-72 bg-primary/20 blur-3xl rounded-full"></div>

                <motion.div
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-primary/10 p-3"
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full max-w-[600px] rounded-2xl"
                  >
                    <source src="/aimbot.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative py-24 px-8 z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col items-center text-center space-y-6 mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Connect With{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  FINEX CORP!
                </span>
              </h2>

              <p className="max-w-2xl text-lg text-gray-300">
                Join our community platforms for updates, support and releases.
              </p>
            </motion.div>

            {/* Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  name: "YouTube",
                  icon: FaYoutube,
                  link: "https://www.youtube.com/@finexexe",
                  glow: "from-red-500/20 to-red-600/10",
                  hover: "hover:border-red-500/40",
                },
                {
                  name: "Discord",
                  icon: FaDiscord,
                  link: "https://discord.gg/AHwg2YA6sE",
                  glow: "from-indigo-500/20 to-indigo-600/10",
                  hover: "hover:border-indigo-500/40",
                },
                {
                  name: "WhatsApp",
                  icon: FaWhatsapp,
                  link: "https://wa.link/ywptia",
                  glow: "from-green-500/20 to-green-600/10",
                  hover: "hover:border-green-500/40",
                },
                {
                  name: "Telegram",
                  icon: FaTelegramPlane,
                  link: "https://t.me/+ajYN21pDeQFhNjk1",
                  glow: "from-cyan-500/20 to-cyan-600/10",
                  hover: "hover:border-cyan-500/40",
                },
              ].map((social, index) => {
                const Icon = social.icon;

                return (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeUp}
                    custom={index}
                    whileHover={{ y: -10, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition ${social.hover}`}
                  >
                    {/* Glow */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br ${social.glow}`}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      {/* Icon */}
                      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />

                        <div className="relative w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-semibold mb-2">
                        {social.name}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        Join our {social.name} community
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
