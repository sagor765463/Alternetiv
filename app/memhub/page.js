"use client";

import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const ProductSection = ({ title, tag, imageSrc, videoSrc, features }) => {
  return (
    <div className="w-full bg-gradient-to-br from-white/[0.01] to-transparent">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-12 lg:grid-cols-2 items-center"
        >
          {/* Left Side: Product Image UI */}
          <motion.div variants={fadeUp} className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm min-h-[300px] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl shadow-primary/10 flex flex-col items-center justify-center bg-black/40">
              {imageSrc ? (
                <img src={imageSrc} alt={title} className="w-full h-auto object-contain" />
              ) : (
                <div className="w-full aspect-[4/5] bg-black/40 flex flex-col items-center justify-center text-white/20 p-6">
                  <span className="text-4xl mb-2">📱</span>
                  <span className="text-sm font-bold">Panel UI Image</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side: Video + Short Details */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6 lg:max-w-lg">
            
            <div>
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                {tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                {title}
              </h2>
            </div>

            {/* Video Block */}
            <div className="rounded-[20px] border border-white/10 overflow-hidden shadow-2xl bg-black/40">
              {videoSrc ? (
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video flex flex-col items-center justify-center text-white/20 p-6">
                  <span className="text-4xl mb-2">🎬</span>
                  <span className="text-sm font-bold">Gameplay Video</span>
                </div>
              )}
            </div>

            {/* Features and Price Link */}
            <div className="text-gray-400 text-sm leading-relaxed">
              <p className="mb-3">
                {features.join(" ")}
              </p>
              <Link href="/pricing" className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors font-semibold text-sm underline underline-offset-4 decoration-primary/30 hover:decoration-white">
                View Pricing & Purchase <ChevronRight size={14} />
              </Link>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-darker to-background text-white font-outfit">
      <Navbar />

      <main className="relative overflow-hidden pt-32 pb-20">
        {/* Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animate-pulse pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 animate-pulse pointer-events-none"></div>

        {/* Page Header */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Products</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our premium range of highly secure panels, undetectable bypasses, and top-tier scanning engines.
          </p>
        </div>

        {/* Products List (Full Width Containers for the lines) */}
        <div className="relative z-10 flex flex-col w-full">
          
          {/* Product 1 */}
          <ProductSection 
            title="Finex Corp! Premium Panel" 
            tag="Premium Cheat"
            imageSrc="/cpp_pnl.png"
            videoSrc="/hero-video.mp4"
            features={[
              "Undetected Aimbot with custom FOV.",
              "Advanced ESP (Players, health, distance).",
              "100% Stream-proof.",
              "Easy one-click injection."
            ]}
          />

          <hr className="w-full border-t border-white/10" />

          {/* Product 2 */}
          <ProductSection 
            title="Finex UID Emulator Bypass" 
            tag="Anti-Cheat Bypass"
            imageSrc="/csharp_pnl.png"
            videoSrc="/aimbot.mp4" 
            features={[
              "100% Emulator Protection.",
              "Memory Concealment to hide cheat threads.",
              "Auto-Updates for latest game patches.",
              "Lightweight with zero CPU footprint."
            ]}
          />

          <hr className="w-full border-t border-white/10" />

          {/* Product 3 */}
          <ProductSection 
            title="MemHub DLL Scanner" 
            tag="Memory Engine"
            imageSrc="/cpp_pnl.png"
            videoSrc="/hero-video.mp4"
            features={[
              "Get process handle by pid or name.",
              "Inject DLL to protected processes.",
              "Hide DLL from process.",
              "Ultra-fast scanning methods."
            ]}
          />

          <hr className="w-full border-t border-white/10" />

          {/* Product 4 */}
          <ProductSection 
            title="FINEX ESP Overlay" 
            tag="Visual Engine"
            imageSrc="/csharp_pnl.png"
            videoSrc="/aimbot.mp4"
            features={[
              "External overlay drawn over the game window.",
              "Highly optimized rendering to prevent FPS drops.",
              "Fully customizable colors, fonts, and sizes.",
              "Hidden from all screen capture and streaming software."
            ]}
          />

          <hr className="w-full border-t border-white/10" />

          {/* Product 5 */}
          <ProductSection 
            title="FINEX HWID Spoofer" 
            tag="System Security"
            imageSrc="/cpp_pnl.png"
            videoSrc="/hero-video.mp4"
            features={[
              "Bypass hardware bans effortlessly.",
              "Spoofs Disk, MAC address, Motherboard, and Monitor serials.",
              "One-click spoofing without requiring a system restart.",
              "Cleans tracing files left by anti-cheat systems."
            ]}
          />

          <hr className="w-full border-t border-white/10" />

          {/* Product 6 */}
          <ProductSection 
            title="FINEX Mobile Injector" 
            tag="Android Tool"
            imageSrc="/csharp_pnl.png"
            videoSrc="/aimbot.mp4"
            features={[
              "Inject custom libraries (.so) into Android games.",
              "Works on both Rooted and Non-Rooted devices (Virtual Space).",
              "Bypass memory checks and detection signatures.",
              "Clean, easy-to-use mobile interface."
            ]}
          />

          <hr className="w-full border-t border-white/10" />

          {/* Product 7 */}
          <ProductSection 
            title="FINEX Kernel Driver" 
            tag="Core Access"
            imageSrc="/cpp_pnl.png"
            videoSrc="/hero-video.mp4"
            features={[
              "Read/Write memory from Ring 0.",
              "Bypass top-tier anti-cheats (EAC, BattlEye, Vanguard).",
              "Undetected communication via shared memory.",
              "Comes with a mapped driver and easy integration API."
            ]}
          />

        </div>
      </main>
    </div>
  );
}
