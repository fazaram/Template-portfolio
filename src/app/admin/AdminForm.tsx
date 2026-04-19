"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, User, Briefcase, FolderKanban, LogOut, Pen, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "@/components/ConfirmModal";
import ImageCropperModal from "@/components/ImageCropperModal";
import { updateProfile, addProject, updateProject, deleteProject, addExperience, updateExperience, deleteExperience } from "./actions";

export default function AdminForm({ profile, projects, experiences }: { profile: any; projects: any[]; experiences: any[] }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPending, startTransition] = useTransition();

  // Modal state for delete confirmations
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; type: "project" | "experience" } | null>(null);

  // State for editing
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropAspectRatio, setCropAspectRatio] = useState(1);
  const [onCropComplete, setOnCropComplete] = useState<(file: File) => void>(() => () => {});
  const [croppedImages, setCroppedImages] = useState<Record<string, File>>({});

  const triggerCropper = (aspectRatio: number, callback: (file: File) => void) => {
    setCropAspectRatio(aspectRatio);
    setOnCropComplete(() => callback);
    setCropperOpen(true);
  };

  const handleAction = async (action: Function, formData?: FormData | string) => {
    // For delete actions, we handle confirmation via modal
    if (typeof formData === "string") {
      // formData is the id for deletion, store pending delete and open modal
      const [type, id] = formData.split(":"); // e.g., "project:123"
      setPendingDelete({ id, type: type as any });
      setModalOpen(true);
      return;
    }
    startTransition(async () => {
      try {
        await action(formData);
        // Reset states on success
        if (action === addProject || action === updateProject) setEditingProject(null);
        if (action === addExperience || action === updateExperience) setEditingExperience(null);
        setCroppedImages({});
      } catch (err) {
        alert("Operation failed. Please try again.");
      }
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id, type } = pendingDelete;
    const deleteFn = type === "project" ? deleteProject : deleteExperience;
    startTransition(async () => {
      try {
        await deleteFn(id);
      } catch (err) {
        alert("Delete failed. Please try again.");
      } finally {
        setModalOpen(false);
        setPendingDelete(null);
      }
    });
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setPendingDelete(null);
  };

  const TabButton = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
        activeTab === id ? "bg-primary text-white shadow-lg" : "hover:bg-secondary text-muted-foreground"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-card/50 p-2 rounded-2xl border border-border">
        <TabButton id="profile" icon={User} label="Profile" />
        <TabButton id="projects" icon={FolderKanban} label="Projects" />
        <TabButton id="experience" icon={Briefcase} label="Experience" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                handleAction(updateProfile, fd);
              }}
              encType="multipart/form-data"
              className="bg-card p-8 rounded-3xl border border-border shadow-2xl space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary border border-border flex items-center justify-center relative group">
                  {croppedImages["avatar"] ? (
                    <img src={URL.createObjectURL(croppedImages["avatar"])} className="w-full h-full object-cover" />
                  ) : profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-muted-foreground" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => triggerCropper(1, (file) => setCroppedImages({ ...croppedImages, avatar: file }))}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition-all"
                >
                  Change Photo
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <input name="name" defaultValue={profile?.name} placeholder="Name" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="role" defaultValue={profile?.role} placeholder="Role" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
              </div>
              <textarea name="bio" defaultValue={profile?.bio} placeholder="Bio" rows={4} required className="w-full bg-background border border-border rounded-xl p-4" />
              <div className="grid md:grid-cols-2 gap-6">
                <input name="email" defaultValue={profile?.email} placeholder="Email" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="typingTexts" defaultValue={profile?.typingTexts} placeholder="Typing Texts (semicolon separated)" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="githubUrl" defaultValue={profile?.githubUrl} placeholder="GitHub URL" className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="linkedinUrl" defaultValue={profile?.linkedinUrl} placeholder="LinkedIn URL" className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="twitterUrl" defaultValue={profile?.twitterUrl} placeholder="Twitter URL" className="w-full bg-background border border-border rounded-xl p-3 h-12" />
              </div>
            <button disabled={isPending} className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50">
              {isPending ? "Syncing..." : "Update Identity"}
            </button>
            {croppedImages["avatar"] && (
              <input type="file" name="avatar" className="hidden" ref={(el) => {
                if (el && croppedImages["avatar"]) {
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(croppedImages["avatar"]);
                  el.files = dataTransfer.files;
                }
              }} />
            )}
          </form>
        )}

        {activeTab === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Project Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                if (editingProject) fd.append("id", editingProject.id);
                handleAction(editingProject ? updateProject : addProject, fd);
              }}
              className="bg-card p-8 rounded-3xl border border-border shadow-xl space-y-6"
              encType="multipart/form-data"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {editingProject ? <Pen size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h3>
                {editingProject && (
                  <button type="button" onClick={() => setEditingProject(null)} className="text-sm text-muted-foreground hover:text-foreground">
                    Cancel Edit
                  </button>
                )}
              </div>
              
              <input name="title" defaultValue={editingProject?.title || ""} placeholder="Project Title" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
              <textarea name="description" defaultValue={editingProject?.description || ""} placeholder="Description" rows={3} required className="w-full bg-background border border-border rounded-xl p-4" />
              <div className="grid md:grid-cols-2 gap-4">
                <input name="link" defaultValue={editingProject?.link || ""} placeholder="Live URL (optional)" className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="tags" defaultValue={editingProject?.tags || ""} placeholder="Tags (semicolon separated)" className="w-full bg-background border border-border rounded-xl p-3 h-12" />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-border bg-secondary flex items-center justify-center">
                  {croppedImages["project"] ? (
                    <img src={URL.createObjectURL(croppedImages["project"])} className="w-full h-full object-cover" />
                  ) : editingProject?.image ? (
                    <img src={editingProject.image} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-muted-foreground" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => triggerCropper(16/9, (file) => setCroppedImages({ ...croppedImages, project: file }))}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition-all"
                >
                  {editingProject ? "Change Thumbnail" : "Select Thumbnail"}
                </button>
              </div>

              {croppedImages["project"] && (
                <input type="file" name="image" className="hidden" ref={(el) => {
                  if (el && croppedImages["project"]) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(croppedImages["project"]);
                    el.files = dataTransfer.files;
                  }
                }} />
              )}

              <button disabled={isPending} className="px-8 py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-all active:scale-95">
                {isPending ? "Processing..." : editingProject ? "Update Project" : "Launch Project"}
              </button>
            </form>

            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border group">
                  <img src={p.image} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingProject(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Pen size={18} />
                    </button>
                    <button onClick={() => handleAction(deleteProject, `project:${p.id}`)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "experience" && (
          <motion.div
            key="experience"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                if (editingExperience) fd.append("id", editingExperience.id);
                const start = fd.get('startDate') as string;
                const end = fd.get('endDate') as string;
                const formatDate = (dateStr: string) => {
                  if (!dateStr) return "Present";
                  const date = new Date(dateStr);
                  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
                };
                if (start) {
                  fd.set("period", `${formatDate(start)} - ${formatDate(end)}`);
                }
                handleAction(editingExperience ? updateExperience : addExperience, fd);
              }}
              className="bg-card p-8 rounded-3xl border border-border shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {editingExperience ? <Pen size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                  {editingExperience ? "Edit Experience" : "Add New Experience"}
                </h3>
                {editingExperience && (
                  <button type="button" onClick={() => setEditingExperience(null)} className="text-sm text-muted-foreground hover:text-foreground">
                    Cancel Edit
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <input name="role" defaultValue={editingExperience?.role || ""} placeholder="Role (e.g., Senior Developer)" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="company" defaultValue={editingExperience?.company || ""} placeholder="Company Name" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Start Date</label>
                  <input type="month" name="startDate" required className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">End Date (Leave empty for Present)</label>
                  <input type="month" name="endDate" className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                </div>
              </div>
              <textarea name="description" defaultValue={editingExperience?.description || ""} placeholder="Description/Achievements" rows={3} required className="w-full bg-background border border-border rounded-xl p-4" />
              <button disabled={isPending} className="px-8 py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-all active:scale-95">
                {isPending ? "Processing..." : editingExperience ? "Save Changes" : "Add Entry"}
              </button>
            </form>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between bg-card p-6 rounded-2xl border border-border group">
                  <div>
                    <p className="font-bold text-lg">{exp.role}</p>
                    <p className="text-sm text-primary font-medium">{exp.company} • {exp.period}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingExperience(exp)} className="p-3 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                      <Pen size={20} />
                    </button>
                    <button onClick={() => handleAction(deleteExperience, `experience:${exp.id}`)} className="p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        aspectRatio={cropAspectRatio}
        onCrop={onCropComplete}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
}
