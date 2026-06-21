"use client";

import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { Download, Play, ExternalLink, Layers, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function ResourcesPage() {
  const [freePanels, setFreePanels] = useState([]);
  const [freeBypasses, setFreeBypasses] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadState, setDownloadState] = useState({ step: 0, url: null });

  const apiUrl = (path) => `/api/v1/${path}`;

  const renderMarkdown = (text) => {
    if (!text) return { __html: "" };
    let html = text
      .replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold">$1</a>')
      .replace(/`(.*?)`/g, '<code class="bg-primary/20 px-1.5 py-0.5 rounded text-sm text-primary border border-primary/30">$1</code>')
      .replace(/\|\|(.*?)\|\|/g, '<span class="bg-white/10 text-transparent hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded" title="Spoiler">$1</span>')
      .replace(/^&gt;\s(.*)/gm, '<blockquote class="border-l-2 border-primary/50 pl-3 my-1 opacity-90 italic">$1</blockquote>')
      .replace(/&lt;:([a-zA-Z0-9_]+):[0-9]+&gt;/g, '')
      .replace(/\n\s*\n/g, '<div class="h-2"></div>') // Handle double newlines as smaller gaps
      .replace(/\n/g, '<br />'); // Regular newlines
    return { __html: html };
  };

  const getVideoUrl = (url) => {
    if (!url || !url.trim() || url.trim() === "null") return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match && match[1]) return `https://www.youtube.com/watch?v=${match[1]}`;
    return url.trim(); // return as-is for non-youtube links
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [panelRes, bypassRes, reqRes] = await Promise.all([
          fetch(apiUrl("free-panel-list"), { credentials: "include" }),
          fetch(apiUrl("free-bypass-list"), { credentials: "include" }),
          fetch(apiUrl("panel-requirements-list"), { credentials: "include" }),
        ]);

        if (!panelRes.ok || !reqRes.ok) {
          if (panelRes?.status === 401 || reqRes?.status === 401) {
            setError("Please login first to view free panels and requirements.");
          } else {
            setError("Failed to load free panel data. Try again later.");
          }
          return;
        }

        const panelData = await panelRes.json();
        const bypassData = bypassRes.ok ? await bypassRes.json() : { data: [] };
        const reqData = await reqRes.json();

        setFreePanels(Array.isArray(panelData.data) ? panelData.data : []);
        setFreeBypasses(Array.isArray(bypassData.data) ? bypassData.data : []);
        setRequirements(Array.isArray(reqData.data) ? reqData.data : []);
      } catch (err) {
        setError("Unable to fetch data from the backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleOpen = (url) => {
    window.location.href = url;
    setDownloadState({ step: 0, url: null });
  };

  // Reusable card component logic
  const ResourceCard = ({ id, type, name, message, username, password, fileUrl, downloadLink, fileLabel, videoUrl, reacts = 0, reactEnabled = true, onReact }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [hasReacted, setHasReacted] = useState(false);

    // Use external download link if provided, otherwise use uploaded file URL
    const effectiveUrl = (downloadLink && downloadLink.trim()) ? downloadLink.trim() : fileUrl;
    const hasDownload = effectiveUrl && !effectiveUrl.includes("nofile.txt");
    const isExternalLink = !!(downloadLink && downloadLink.trim());

    useEffect(() => {
      if (typeof window !== "undefined") {
        setHasReacted(localStorage.getItem(`reacted_${type}_${id}`) === "true");
      }
    }, [id, type]);

    const handleReactClick = () => {
      const nextReacted = !hasReacted;
      setHasReacted(nextReacted);
      onReact(id, type);
    };

    const handleDownloadClick = () => {
      if (isExternalLink) {
        window.open(effectiveUrl, "_blank");
        return;
      }
      setIsDownloading(true);
      setTimeout(() => {
        window.location.href = effectiveUrl;
        setTimeout(() => setIsDownloading(false), 2000);
      }, 800);
    };

    return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-2xl shadow-black/30 backdrop-blur-sm flex flex-col gap-5 transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 h-full"
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-white leading-tight truncate">{name}</h3>

          {message ? (
            <div
              className="mt-4 text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-2xl border border-white/5 break-words overflow-hidden"
              dangerouslySetInnerHTML={renderMarkdown(message)}
            />
          ) : (
            <>
              {username && password ? (
                <div className="mt-4 flex gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-200">
                    <span className="text-gray-400">User:</span> {username}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-200">
                    <span className="text-gray-400">Pass:</span> {password}
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-400">No login data available.</p>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {/* Heart React Button */}
          {reactEnabled && (
            <button
              onClick={handleReactClick}
              className={`inline-flex h-12 gap-1.5 px-3.5 items-center justify-center rounded-2xl border transition-all duration-300 cursor-pointer active:scale-90 ${
                hasReacted
                  ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/10"
              }`}
            >
              <Heart size={18} className={hasReacted ? "fill-red-500" : ""} />
              <span className="text-sm font-bold">{130 + Number(reacts || 0)}</span>
            </button>
          )}

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Download size={20} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-auto">
        {hasDownload && (
          <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className="w-full cursor-pointer rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-80 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Processing...
              </>
            ) : (
              fileLabel
            )}
          </button>
        )}

        {videoUrl && videoUrl.trim() && videoUrl.trim() !== "null" && getVideoUrl(videoUrl) && (
          <a
            href={getVideoUrl(videoUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 cursor-pointer rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-3.5 text-sm font-bold text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:border-red-400/60 hover:scale-[1.02] active:scale-95"
          >
            <Play size={16} className="fill-red-400" />
            Apply Process
            <ExternalLink size={14} className="opacity-60" />
          </a>
        )}
      </div>
    </motion.div>
    );
  };

  const RequirementCard = ({ id, name, url, downloadLink, message, videoUrl, index, reacts = 0, reactEnabled = true, onReact }) => {
    const [hasReacted, setHasReacted] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setHasReacted(localStorage.getItem(`reacted_requirements_${id}`) === "true");
      }
    }, [id]);

    const handleReactClick = (e) => {
      e.stopPropagation();
      const nextReacted = !hasReacted;
      setHasReacted(nextReacted);
      onReact(id, "requirements");
    };

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-7 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 flex flex-col gap-4"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 shrink-0">
              <Layers size={18} />
            </div>
            <h3 className="text-xl font-bold text-white">{name}</h3>
          </div>

          {reactEnabled && (
            <button
              onClick={handleReactClick}
              className={`inline-flex h-10 gap-1.5 px-3 items-center justify-center rounded-2xl border transition-all duration-300 cursor-pointer active:scale-90 shrink-0 ${
                hasReacted
                  ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/10"
              }`}
            >
              <Heart size={16} className={hasReacted ? "fill-red-500" : ""} />
              <span className="text-xs font-bold">{130 + Number(reacts || 0)}</span>
            </button>
          )}
        </div>

        {message && message.trim() ? (
          <div
            className="text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-2xl border border-white/5 break-words overflow-hidden"
            dangerouslySetInnerHTML={renderMarkdown(message)}
          />
        ) : (
          <p className="text-sm text-gray-400 font-medium">Required file for setup.</p>
        )}

        <div className="flex flex-col gap-3 mt-auto">
          {(() => {
            const effectiveUrl = (downloadLink && downloadLink.trim()) ? downloadLink.trim() : url;
            const hasDownload = effectiveUrl && !effectiveUrl.includes("nofile.txt");
            const isExternal = !!(downloadLink && downloadLink.trim());
            if (!hasDownload) return null;
            return (
              <button
                onClick={() => isExternal ? window.open(effectiveUrl, "_blank") : handleOpen(effectiveUrl)}
                className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
              >
                <Download size={15} />
                Download
              </button>
            );
          })()}

          {videoUrl && videoUrl.trim() && videoUrl.trim() !== "null" && getVideoUrl(videoUrl) && (
            <a
              href={getVideoUrl(videoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 cursor-pointer rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-3.5 text-sm font-bold text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:border-red-400/60 hover:scale-[1.02] active:scale-95"
            >
              <Play size={16} className="fill-red-400" />
              Watch Tutorial
              <ExternalLink size={14} className="opacity-60" />
            </a>
          )}
        </div>
      </motion.div>
    );

  };

  const handleReact = async (id, type) => {
    const storageKey = `reacted_${type}_${id}`;
    const hasReacted = localStorage.getItem(storageKey) === "true";
    const amount = hasReacted ? -1 : 1;

    const updateStateList = (list, itemId, reactAmount) => {
      return list.map((item) => {
        if (item.id === itemId) {
          const currentReacts = Number(item.reacts || 0);
          return { ...item, reacts: Math.max(0, currentReacts + reactAmount) };
        }
        return item;
      });
    };

    if (type === "free_panels") {
      setFreePanels(prev => updateStateList(prev, id, amount));
    } else if (type === "free_bypasses") {
      setFreeBypasses(prev => updateStateList(prev, id, amount));
    } else if (type === "requirements") {
      setRequirements(prev => updateStateList(prev, id, amount));
    }

    if (hasReacted) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, "true");
    }

    try {
      const res = await fetch("/api/v1/react-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, amount }),
      });
      const data = await res.json();
      if (!data.success) {
        if (hasReacted) {
          localStorage.setItem(storageKey, "true");
        } else {
          localStorage.removeItem(storageKey);
        }
        const rollbackAmount = -amount;
        if (type === "free_panels") {
          setFreePanels(prev => updateStateList(prev, id, rollbackAmount));
        } else if (type === "free_bypasses") {
          setFreeBypasses(prev => updateStateList(prev, id, rollbackAmount));
        } else if (type === "requirements") {
          setRequirements(prev => updateStateList(prev, id, rollbackAmount));
        }
      }
    } catch (err) {
      console.error("Error reacting:", err);
      if (hasReacted) {
        localStorage.setItem(storageKey, "true");
      } else {
        localStorage.removeItem(storageKey);
      }
      const rollbackAmount = -amount;
      if (type === "free_panels") {
        setFreePanels(prev => updateStateList(prev, id, rollbackAmount));
      } else if (type === "free_bypasses") {
        setFreeBypasses(prev => updateStateList(prev, id, rollbackAmount));
      } else if (type === "requirements") {
        setRequirements(prev => updateStateList(prev, id, rollbackAmount));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-darker to-background text-white font-outfit">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animate-pulse pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 animate-pulse pointer-events-none"></div>

        <section className="relative z-10 py-20 px-6 pt-32">
          <div className="mx-auto max-w-6xl space-y-20">

            {/* Free Panels + Bypass side by side */}
            <div className="grid gap-10 lg:grid-cols-2">


              {/* Free Panels Section */}
              <div>
                <div className="mb-8">
                  <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-primary">Free Panels</span>
                  <h2 className="mt-4 text-3xl font-black text-white">Available Panels</h2>
                  <p className="mt-2 text-gray-400">Download the panel files and use them for free.</p>
                </div>

                <div className="grid gap-5">
                  {freePanels.length > 0 ? (
                    freePanels.map((panel) => (
                      <ResourceCard
                        key={panel.id || panel.panel_name}
                        id={panel.id}
                        type="free_panels"
                        name={panel.panel_name}
                        message={panel.message}
                        username={panel.username}
                        password={panel.password}
                        fileUrl={panel.panel_url}
                        downloadLink={panel.download_link}
                        fileLabel="Open Panel"
                        videoUrl={panel.video_url}
                        reacts={panel.reacts}
                        reactEnabled={panel.react_enabled !== false}
                        onReact={handleReact}
                      />
                    ))
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
                      {loading ? "Loading free panels..." : "No free panels available."}
                    </div>
                  )}
                </div>
              </div>

              {/* Free Bypass Section */}
              <div>
                <div className="mb-8">
                  <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-primary">Free Bypass</span>
                  <h2 className="mt-4 text-3xl font-black text-white">Available Bypass</h2>
                  <p className="mt-2 text-gray-400">Download the bypass files and use them for free.</p>
                </div>

                <div className="grid gap-5">
                  {freeBypasses.length > 0 ? (
                    freeBypasses.map((bypass) => (
                      <ResourceCard
                        key={bypass.id || bypass.bypass_name || bypass.panel_name}
                        id={bypass.id}
                        type="free_bypasses"
                        name={bypass.bypass_name || bypass.panel_name}
                        message={bypass.message}
                        username={bypass.username}
                        password={bypass.password}
                        fileUrl={bypass.bypass_url || bypass.panel_url}
                        downloadLink={bypass.download_link}
                        fileLabel="Open Bypass"
                        videoUrl={bypass.video_url}
                        reacts={bypass.reacts}
                        reactEnabled={bypass.react_enabled !== false}
                        onReact={handleReact}
                      />
                    ))
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
                      {loading ? "Loading free bypass..." : "No free bypass available."}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Requirements Section */}
            <div>
              <div className="mb-10">
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-primary">Requirements</span>
                <h2 className="mt-5 text-4xl font-black text-white">Panel Requirements</h2>
                <p className="mt-3 text-gray-400 text-lg">Download the requirement files and use them for free.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requirements.length > 0 ? (
                  requirements.map((req, index) => (
                    <RequirementCard
                      key={req.id || `${req.req_name}-${index}`}
                      id={req.id}
                      name={req.req_name}
                      url={req.req_url}
                      downloadLink={req.download_link}
                      message={req.message}
                      videoUrl={req.video_url}
                      index={index}
                      reacts={req.reacts}
                      reactEnabled={req.react_enabled !== false}
                      onReact={handleReact}
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-gray-400">
                    {loading ? "Loading requirements..." : "No requirements available."}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
