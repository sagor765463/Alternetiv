"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Trash2, LogOut, Edit, X, Download } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

import { useAuth } from "../../context/use-auth";

export default function AdminPanel() {
  const { isAuth, isLoading: authLoading, isAdmin, user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("panels");
  const [panels, setPanels] = useState([]);
  const [bypasses, setBypasses] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [downloadState, setDownloadState] = useState({ step: 0, url: null });
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    panel_name: "",
    username: "",
    password: "",
    message: "",
    video_url: "",
    file: null,
    req_name: "",
    react_enabled: true,
  });

  const apiUrl = (path) => `/api/v1/${path}`;

  useEffect(() => {
    if (!authLoading) {
      if (!isAuth || !isAdmin) {
        window.location.href = "/";
      } else {
        loadData();
      }
    }
  }, [authLoading, isAuth, isAdmin]);

  const loadData = async () => {
    try {
      const [panelRes, bypassRes, reqRes] = await Promise.all([
        fetch(apiUrl("free-panel-list"), { credentials: "include" }).catch(() => ({ ok: false })),
        fetch(apiUrl("free-bypass-list"), { credentials: "include" }).catch(() => ({ ok: false })),
        fetch(apiUrl("panel-requirements-list"), { credentials: "include" }).catch(() => ({ ok: false })),
      ]);

      if (panelRes.ok) {
        const data = await panelRes.json();
        setPanels(Array.isArray(data.data) ? data.data : []);
      }

      if (bypassRes.ok) {
        const data = await bypassRes.json();
        setBypasses(Array.isArray(data.data) ? data.data : []);
      }

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequirements(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();

    if (tab === "panels" || tab === "bypasses") {
      formData.append("panel_name", uploadForm.panel_name);
      formData.append("username", uploadForm.username);
      formData.append("password", uploadForm.password);
      formData.append("message", uploadForm.message);
      formData.append("video_url", uploadForm.video_url);
      formData.append("react_enabled", uploadForm.react_enabled ? "true" : "false");
      if (uploadForm.file) {
        formData.append("file", uploadForm.file);
      } else {
        const dummyFile = new File(["no-file"], "nofile.txt", { type: "text/plain" });
        formData.append("file", dummyFile);
      }
    } else {
      formData.append("req_name", uploadForm.req_name);
      formData.append("message", uploadForm.message);
      formData.append("video_url", uploadForm.video_url);
      formData.append("react_enabled", uploadForm.react_enabled ? "true" : "false");
      if (uploadForm.file) {
        formData.append("file", uploadForm.file);
      } else {
        const dummyFile = new File(["no-file"], "nofile.txt", { type: "text/plain" });
        formData.append("file", dummyFile);
      }
    }

    try {
      let endpoint = "";
      if (tab === "panels") endpoint = "upload-free-panel";
      else if (tab === "bypasses") endpoint = "upload-free-bypass";
      else endpoint = "upload-requirements";

      const res = await fetch(apiUrl(endpoint), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        setShowUploadModal(false);
        setUploadForm({ panel_name: "", username: "", password: "", message: "", video_url: "", file: null, req_name: "", react_enabled: true });
        // Refetch only the affected list (faster than full reload)
        if (tab === "panels") {
          fetch(apiUrl("free-panel-list"), { credentials: "include" })
            .then(r => r.json()).then(d => setPanels(Array.isArray(d.data) ? d.data : []));
        } else if (tab === "bypasses") {
          fetch(apiUrl("free-bypass-list"), { credentials: "include" })
            .then(r => r.json()).then(d => setBypasses(Array.isArray(d.data) ? d.data : []));
        } else {
          fetch(apiUrl("panel-requirements-list"), { credentials: "include" })
            .then(r => r.json()).then(d => setRequirements(Array.isArray(d.data) ? d.data : []));
        }
      } else {
        const data = await res.json();
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id, type) => {
    setItemToDelete({ id, type });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    
    setDeletingId(id);
    setItemToDelete(null);

    // Optimistic update - remove immediately from UI
    if (type === "panel") setPanels(prev => prev.filter(p => p.id !== id));
    else if (type === "bypass") setBypasses(prev => prev.filter(b => b.id !== id));
    else setRequirements(prev => prev.filter(r => r.id !== id));

    try {
      let endpoint = "";
      if (type === "panel") endpoint = `delete-free-panel/${id}`;
      else if (type === "bypass") endpoint = `delete-free-bypass/${id}`;
      else endpoint = `delete-requirement/${id}`;

      const res = await fetch(apiUrl(endpoint), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        // Rollback - refetch if server failed
        alert("Delete failed. Reloading...");
        loadData();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Reloading...");
      loadData();
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (tab === "panels" || tab === "bypasses") {
      setUploadForm({
        panel_name: item.panel_name || item.bypass_name || "",
        username: item.username || "",
        password: item.password || "",
        message: item.message || "",
        video_url: item.video_url || "",
        file: null,
        req_name: "",
        react_enabled: item.react_enabled !== false,
      });
    } else {
      setUploadForm({
        panel_name: "",
        username: "",
        password: "",
        message: item.message || "",
        video_url: item.video_url || "",
        file: null,
        req_name: item.req_name,
        react_enabled: item.react_enabled !== false,
      });
    }
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      if (tab === "panels" || tab === "bypasses") {
        formData.append("panel_name", uploadForm.panel_name);
        formData.append("username", uploadForm.username);
        formData.append("password", uploadForm.password);
        formData.append("message", uploadForm.message);
        formData.append("video_url", uploadForm.video_url);
        formData.append("react_enabled", uploadForm.react_enabled ? "true" : "false");
        if (uploadForm.file) {
          formData.append("file", uploadForm.file);
        } else {
          const dummyFile = new File(["no-file"], "nofile.txt", { type: "text/plain" });
          formData.append("file", dummyFile);
        }
      } else {
        formData.append("req_name", uploadForm.req_name);
        formData.append("message", uploadForm.message);
        formData.append("video_url", uploadForm.video_url);
        formData.append("react_enabled", uploadForm.react_enabled ? "true" : "false");
        if (uploadForm.file) formData.append("file", uploadForm.file);
      }

      let updateEndpoint = "";
      if (tab === "panels") updateEndpoint = `update-free-panel/${editingItem.id}`;
      else if (tab === "bypasses") updateEndpoint = `update-free-bypass/${editingItem.id}`;
      else updateEndpoint = `update-requirement/${editingItem.id}`;
      
      const res = await fetch(apiUrl(updateEndpoint), {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingItem(null);
        setUploadForm({ panel_name: "", username: "", password: "", message: "", video_url: "", file: null, req_name: "", react_enabled: true });
        loadData();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (url) => {
    const adLink1 = "https://www.effectivecpmnetwork.com/yx8s1m3tur?key=54142b0f55a9012c2fcf908349db286e";
    const adLink2 = "https://www.effectivecpmnetwork.com/dg8dvuv3cn?key=12c48d6e4381ceb492f7c8204a474f11";

    if (downloadState.step === 0) {
      // First click - open first ad link
      window.open(adLink1, "_blank");
      setDownloadState({ step: 1, url });
    } else if (downloadState.step === 1) {
      // Second click - open second ad link
      window.open(adLink2, "_blank");
      setDownloadState({ step: 2, url });
    } else if (downloadState.step === 2) {
      // Third click - download file
      window.location.href = url;
      setDownloadState({ step: 0, url: null });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <p className="text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <p className="text-rose-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-outfit">
      <Navbar />

      <main className="relative overflow-hidden pt-24 px-6 pb-12">
        <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-between rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div>
              <h1 className="text-4xl font-black text-white">Admin Panel</h1>
              <p className="mt-2 text-gray-300">Welcome, {user?.user_name || "Admin"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-6 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              <LogOut size={18} /> Logout
            </button>
          </motion.div>

          {/* Tabs */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex gap-4 border-b border-white/10">
            {[
              { id: "panels", label: "Free Panels" },
              { id: "bypasses", label: "Free Bypasses" },
              { id: "requirements", label: "Requirements" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 py-3 text-sm font-semibold transition ${
                  tab === t.id
                    ? "border-b-2 border-primary text-primary"
                    : "border-b-2 border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            {tab === "panels" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Free Panels ({panels.length})</h2>
                    <p className="mt-1 text-sm text-gray-400">Manage free panel entries</p>
                  </div>
                  <button
                    onClick={() => { setUploadForm({ panel_name: "", username: "", password: "", message: "", file: null, req_name: "", react_enabled: true }); setShowUploadModal(true); }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                  >
                    <Upload size={18} /> Upload Panel
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {panels.length > 0 ? (
                    panels.map((panel) => (
                      <div key={panel.id} className="rounded-3xl border border-white/10 bg-background/60 p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{panel.panel_name}</h3>
                            {panel.username && panel.password && (
                              <p className="mt-2 text-sm text-gray-400">
                                {panel.username} / {panel.password}
                              </p>
                            )}
                            {panel.message && <p className="mt-2 text-xs text-gray-300 line-clamp-2">{panel.message}</p>}
                            <p className="mt-2 text-xs text-gray-500">Added {new Date(panel.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownload(panel.panel_url)}
                              className={`rounded-full p-2 transition ${
                                downloadState.url === panel.panel_url && downloadState.step > 0
                                  ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                  : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                              }`}
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(panel)}
                              className="rounded-full bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500/20"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(panel.id, "panel")}
                              disabled={deletingId === panel.id}
                              className="rounded-full bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                            >
                              {deletingId === panel.id ? (
                                <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-3xl border border-white/10 bg-background/60 p-12 text-center text-gray-400">
                      No free panels yet. Start by uploading one.
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "bypasses" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Free Bypasses ({bypasses.length})</h2>
                    <p className="mt-1 text-sm text-gray-400">Manage free bypass entries</p>
                  </div>
                  <button
                    onClick={() => { setUploadForm({ panel_name: "", username: "", password: "", message: "", file: null, req_name: "", react_enabled: true }); setShowUploadModal(true); }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                  >
                    <Upload size={18} /> Upload Bypass
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {bypasses.length > 0 ? (
                    bypasses.map((bypass) => (
                      <div key={bypass.id} className="rounded-3xl border border-white/10 bg-background/60 p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{bypass.bypass_name || bypass.panel_name}</h3>
                            {bypass.username && bypass.password && (
                              <p className="mt-2 text-sm text-gray-400">
                                {bypass.username} / {bypass.password}
                              </p>
                            )}
                            {bypass.message && <p className="mt-2 text-xs text-gray-300 line-clamp-2">{bypass.message}</p>}
                            <p className="mt-2 text-xs text-gray-500">Added {new Date(bypass.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownload(bypass.bypass_url || bypass.panel_url)}
                              className={`rounded-full p-2 transition ${
                                downloadState.url === (bypass.bypass_url || bypass.panel_url) && downloadState.step > 0
                                  ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                  : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                              }`}
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(bypass)}
                              className="rounded-full bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500/20"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(bypass.id, "bypass")}
                              disabled={deletingId === bypass.id}
                              className="rounded-full bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                            >
                              {deletingId === bypass.id ? (
                                <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-3xl border border-white/10 bg-background/60 p-12 text-center text-gray-400">
                      No free bypasses yet. Start by uploading one.
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "requirements" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Panel Requirements ({requirements.length})</h2>
                    <p className="mt-1 text-sm text-gray-400">Manage requirement files and resources</p>
                  </div>
                  <button
                    onClick={() => { setUploadForm({ panel_name: "", username: "", password: "", message: "", file: null, req_name: "", react_enabled: true }); setShowUploadModal(true); }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
                  >
                    <Upload size={18} /> Upload Requirement
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {requirements.length > 0 ? (
                    requirements.map((req, idx) => (
                      <div key={`${req.id}-${idx}`} className="rounded-3xl border border-white/10 bg-background/60 p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{req.req_name}</h3>
                            <p className="mt-2 text-xs text-gray-500">Resource file</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownload(req.req_url)}
                              className={`rounded-full p-2 transition ${
                                downloadState.url === req.req_url && downloadState.step > 0
                                  ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                  : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                              }`}
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(req)}
                              className="rounded-full bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500/20"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(req.id, "requirement")}
                              disabled={deletingId === req.id}
                              className="rounded-full bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                            >
                              {deletingId === req.id ? (
                                <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-3xl border border-white/10 bg-background/60 p-12 text-center text-gray-400">
                      No requirements yet. Start by uploading one.
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-3xl border border-white/10 bg-background/90 p-8 backdrop-blur-xl"
          >
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-gray-400 transition hover:bg-white/20"
            >
              <X size={20} />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-white">
              {tab === "panels" ? "Upload Free Panel" : tab === "bypasses" ? "Upload Free Bypass" : "Upload Requirement"}
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              {(tab === "panels" || tab === "bypasses") && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      value={uploadForm.panel_name}
                      onChange={(e) => setUploadForm({ ...uploadForm, panel_name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Username</label>
                      <input
                        type="text"
                        value={uploadForm.username}
                        onChange={(e) => setUploadForm({ ...uploadForm, username: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
                      <input
                        type="text"
                        value={uploadForm.password}
                        onChange={(e) => setUploadForm({ ...uploadForm, password: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Announcement Message (Optional)</label>
                    <textarea
                      value={uploadForm.message}
                      onChange={(e) => setUploadForm({ ...uploadForm, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none min-h-[120px]"
                      placeholder="Enter a rich message like Discord announcement here. Use **bold** and [link text](url) to style."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Apply Process Video URL (Optional)</label>
                    <input
                      type="text"
                      value={uploadForm.video_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, video_url: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="e.g. https://youtube.com/watch?v=..."
                    />
                  </div>
                </>
              )}

              {tab === "requirements" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Requirement Name</label>
                    <input
                      type="text"
                      value={uploadForm.req_name}
                      onChange={(e) => setUploadForm({ ...uploadForm, req_name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="Enter requirement name"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Announcement Message (Optional)</label>
                    <textarea
                      value={uploadForm.message}
                      onChange={(e) => setUploadForm({ ...uploadForm, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none min-h-[120px]"
                      placeholder="Enter a rich message like Discord announcement here. Use **bold** and [link text](url) to style."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Apply Process Video URL (Optional)</label>
                    <input
                      type="text"
                      value={uploadForm.video_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, video_url: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="e.g. https://youtube.com/watch?v=..."
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">File <span className="text-gray-500 font-normal">(Optional)</span></label>
                <input
                  type="file"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-white focus:border-primary focus:outline-none"
                />
              </div>

              {/* React Enable/Disable Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">❤️ React Button</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {uploadForm.react_enabled ? "Users can like this item" : "Like button is hidden"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadForm({ ...uploadForm, react_enabled: !uploadForm.react_enabled })}
                  className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    uploadForm.react_enabled ? "bg-primary" : "bg-white/20"
                  }`}
                  style={{ width: 52 }}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      uploadForm.react_enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    Uploading to cloud...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm rounded-3xl border border-rose-500/20 bg-[#120a0a] p-8 text-center shadow-2xl shadow-rose-500/10"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 ring-4 ring-rose-500/5">
              <Trash2 size={28} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">Delete Item?</h2>
            <p className="mb-8 text-gray-400">
              Are you sure you want to delete this {itemToDelete.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 shadow-lg shadow-rose-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-3xl border border-white/10 bg-background/90 p-8 backdrop-blur-xl"
          >
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingItem(null);
                setUploadForm({ panel_name: "", username: "", password: "", file: null, req_name: "" });
              }}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-gray-400 transition hover:bg-white/20"
            >
              <X size={20} />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-white">
              {tab === "panels" ? "Edit Free Panel" : tab === "bypasses" ? "Edit Free Bypass" : "Edit Requirement"}
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              {(tab === "panels" || tab === "bypasses") && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      value={uploadForm.panel_name}
                      onChange={(e) => setUploadForm({ ...uploadForm, panel_name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Username</label>
                      <input
                        type="text"
                        value={uploadForm.username}
                        onChange={(e) => setUploadForm({ ...uploadForm, username: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
                      <input
                        type="text"
                        value={uploadForm.password}
                        onChange={(e) => setUploadForm({ ...uploadForm, password: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Announcement Message (Optional)</label>
                    <textarea
                      value={uploadForm.message}
                      onChange={(e) => setUploadForm({ ...uploadForm, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none min-h-[120px]"
                      placeholder="Enter a rich message like Discord announcement here. Use **bold** and [link text](url) to style."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Apply Process Video URL (Optional)</label>
                    <input
                      type="text"
                      value={uploadForm.video_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, video_url: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="e.g. https://youtube.com/watch?v=..."
                    />
                  </div>
                </>
              )}

              {tab === "requirements" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Requirement Name</label>
                    <input
                      type="text"
                      value={uploadForm.req_name}
                      onChange={(e) => setUploadForm({ ...uploadForm, req_name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="Enter requirement name"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Announcement Message (Optional)</label>
                    <textarea
                      value={uploadForm.message}
                      onChange={(e) => setUploadForm({ ...uploadForm, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none min-h-[120px]"
                      placeholder="Enter a rich message like Discord announcement here. Use **bold** and [link text](url) to style."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Apply Process Video URL (Optional)</label>
                    <input
                      type="text"
                      value={uploadForm.video_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, video_url: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      placeholder="e.g. https://youtube.com/watch?v=..."
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">File (optional)</label>
                <input
                  type="file"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-white focus:border-primary focus:outline-none"
                />
              </div>

              {/* React Enable/Disable Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">❤️ React Button</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {uploadForm.react_enabled ? "Users can like this item" : "Like button is hidden"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadForm({ ...uploadForm, react_enabled: !uploadForm.react_enabled })}
                  className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    uploadForm.react_enabled ? "bg-primary" : "bg-white/20"
                  }`}
                  style={{ width: 52 }}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      uploadForm.react_enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    Saving changes...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Full-screen uploading overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl">
            <svg className="animate-spin text-primary" width={56} height={56} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <div className="text-center">
              <p className="text-xl font-bold text-white">Uploading to Cloud...</p>
              <p className="mt-2 text-sm text-gray-400">Please wait, your file is being uploaded to Uploadthing.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
