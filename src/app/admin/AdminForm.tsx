"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Plus, Trash2, User, Briefcase, FolderKanban, LogOut, Pen, Image as ImageIcon, GripVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import ConfirmModal from "@/components/ConfirmModal";
import ImageCropperModal from "@/components/ImageCropperModal";
import ErrorModal from "@/components/ErrorModal";
import { 
  updateProfile, 
  addProject, 
  updateProject, 
  deleteProject, 
  addExperience, 
  updateExperience, 
  deleteExperience,
  reorderProjects,
  reorderExperiences
} from "./actions";

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
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});

  // Error modal state
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");

  // Profile update confirm state
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const profileFormRef = useRef<HTMLFormElement>(null);

  // Reorder state
  const [localProjects, setLocalProjects] = useState(projects);
  const [localExperiences, setLocalExperiences] = useState(experiences);

  // Sync local state when props change (from server)
  useEffect(() => { setLocalProjects(projects); }, [projects]);
  useEffect(() => { setLocalExperiences(experiences); }, [experiences]);

  const triggerCropper = (aspectRatio: number, callback: (file: File) => void) => {
    setCropAspectRatio(aspectRatio);
    setOnCropComplete(() => callback);
    setCropperOpen(true);
  };

  const handleAction = async (action: Function, formData?: FormData | string, formElement?: HTMLFormElement) => {
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
        const result = await action(formData);
        if (result?.error) {
          setErrorModalMsg(result.error);
          setErrorModalShow(true);
          return;
        }
        // Reset states on success
        if (action === addProject || action === updateProject) {
          setEditingProject(null);
          setCroppedImages((prev) => {
            const next = { ...prev };
            delete next.project;
            return next;
          });
          setCharCounts((prev) => {
            const next = { ...prev };
            delete next.p_title;
            delete next.p_desc;
            return next;
          });
        }
        if (action === addExperience || action === updateExperience) {
          setEditingExperience(null);
          setCharCounts((prev) => {
            const next = { ...prev };
            delete next.e_role;
            delete next.e_company;
            delete next.e_desc;
            return next;
          });
        }
        if (action === updateProfile) {
           setCroppedImages((prev) => {
             const next = { ...prev };
             delete next.avatar;
             return next;
           });
        }
        
        if (formElement) formElement.reset();
      } catch (err) {
        setErrorModalMsg("An unexpected system error occurred. Please try again.");
        setErrorModalShow(true);
      }
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id, type } = pendingDelete;
    const deleteFn = type === "project" ? deleteProject : deleteExperience;
    startTransition(async () => {
      try {
        const result = await deleteFn(id);
        if (result?.error) {
          setErrorModalMsg(result.error);
          setErrorModalShow(true);
          return;
        }
      } catch (err) {
        setErrorModalMsg("Failed to delete the item. Please try again.");
        setErrorModalShow(true);
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
              ref={profileFormRef}
              onSubmit={(e) => {
                e.preventDefault();
                setShowProfileConfirm(true);
              }}
              encType="multipart/form-data"
              className="bg-card p-8 rounded-3xl border border-border shadow-2xl space-y-8"
            >
              {/* Hero Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <User size={20} className="stroke-[3]" />
                  <h3 className="text-lg font-bold tracking-tight uppercase">Hero Section</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary border border-border flex items-center justify-center relative group">
                    {profile?.avatarUrl || croppedImages.avatar ? (
                      <img 
                        src={croppedImages.avatar ? URL.createObjectURL(croppedImages.avatar) : profile.avatarUrl} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User size={40} className="text-muted-foreground" />
                    )}
                    <button
                      type="button"
                      onClick={() => triggerCropper(1, (file) => setCroppedImages({ ...croppedImages, avatar: file }))}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                    >
                      Change
                    </button>
                    <input type="file" name="avatar" className="hidden" ref={(el) => {
                      if (el && croppedImages["avatar"]) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(croppedImages["avatar"]);
                        el.files = dataTransfer.files;
                      }
                    }} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <input name="name" defaultValue={profile?.name} placeholder="Full Name" required maxLength={30} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                    <input name="role" defaultValue={profile?.role} placeholder="Professional Role" required maxLength={50} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Typing Texts (separate with semicolon ;)</label>
                  <input name="typingTexts" defaultValue={profile?.typingTexts} placeholder="Building the future;Designing experiences..." required maxLength={255} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                </div>
              </div>

              <div className="h-px bg-border my-8" />

              {/* About Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <Pen size={20} className="stroke-[3]" />
                  <h3 className="text-lg font-bold tracking-tight uppercase">About Section</h3>
                </div>
                <div className="space-y-1">
                  <textarea name="bio" defaultValue={profile?.bio} placeholder="Professional Biography" required maxLength={255} className="w-full bg-background border border-border rounded-xl p-4 min-h-[120px]" onChange={(e) => setCharCounts({...charCounts, bio: e.target.value.length})} />
                  <p className="text-[10px] text-right text-muted-foreground">{charCounts.bio || profile?.bio?.length || 0}/255</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground mb-2 block uppercase">Years Exp</label>
                    <input name="yearsExp" defaultValue={profile?.yearsExp?.replace(/\D/g, '') || "5"} placeholder="e.g. 5" maxLength={5} className="w-full bg-background border border-border rounded-xl p-3 h-12 text-center" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground mb-2 block uppercase">Projects</label>
                    <input name="projectsDone" defaultValue={profile?.projectsDone?.replace(/\D/g, '') || "40"} placeholder="e.g. 40" maxLength={5} className="w-full bg-background border border-border rounded-xl p-3 h-12 text-center" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground mb-2 block uppercase">Clients</label>
                    <input name="clientsHappy" defaultValue={profile?.clientsHappy?.replace(/\D/g, '') || "25"} placeholder="e.g. 25" maxLength={5} className="w-full bg-background border border-border rounded-xl p-3 h-12 text-center" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground mb-2 block uppercase">Awards</label>
                    <input name="awardsWon" defaultValue={profile?.awardsWon?.replace(/\D/g, '') || "12"} placeholder="e.g. 12" maxLength={5} className="w-full bg-background border border-border rounded-xl p-3 h-12 text-center" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border my-8" />

              {/* Social & Contact Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <LogOut size={20} className="rotate-90 stroke-[3]" />
                  <h3 className="text-lg font-bold tracking-tight uppercase">Social & Contact</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">Email Address</label>
                    <input name="email" defaultValue={profile?.email} placeholder="Email" required maxLength={30} className="w-full bg-background border border-border rounded-xl p-3 h-12" onChange={(e) => setCharCounts({...charCounts, email: e.target.value.length})} />
                    <p className="text-[10px] text-right text-muted-foreground">{charCounts.email || profile?.email?.length || 0}/30</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">GitHub Profile URL</label>
                    <input name="githubUrl" defaultValue={profile?.githubUrl} placeholder="https://github.com/..." maxLength={255} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">LinkedIn Profile URL</label>
                    <input name="linkedinUrl" defaultValue={profile?.linkedinUrl} placeholder="https://linkedin.com/in/..." maxLength={255} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">Twitter/X Profile URL</label>
                    <input name="twitterUrl" defaultValue={profile?.twitterUrl} placeholder="https://twitter.com/..." maxLength={255} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                  </div>
                </div>
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
                handleAction(editingProject ? updateProject : addProject, fd, e.currentTarget);
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
              
              <div className="space-y-1">
                <input name="title" defaultValue={editingProject?.title || ""} placeholder="Project Title" required maxLength={50} className="w-full bg-background border border-border rounded-xl p-3 h-12" onChange={(e) => setCharCounts({...charCounts, p_title: e.target.value.length})} />
                <p className="text-[10px] text-right text-muted-foreground">{charCounts.p_title || editingProject?.title?.length || 0}/50</p>
              </div>
              <div className="space-y-1">
                <textarea name="description" defaultValue={editingProject?.description || ""} placeholder="Description" rows={3} required maxLength={255} className="w-full bg-background border border-border rounded-xl p-4" onChange={(e) => setCharCounts({...charCounts, p_desc: e.target.value.length})} />
                <p className="text-[10px] text-right text-muted-foreground">{charCounts.p_desc || editingProject?.description?.length || 0}/255</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="link" defaultValue={editingProject?.link || ""} placeholder="Live URL (optional)" maxLength={255} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
                <input name="tags" defaultValue={editingProject?.tags || ""} placeholder="Tags (semicolon separated)" maxLength={100} className="w-full bg-background border border-border rounded-xl p-3 h-12" />
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

            <Reorder.Group
              axis="y"
              values={localProjects}
              onReorder={(newOrder) => {
                setLocalProjects(newOrder);
                reorderProjects(newOrder.map(p => p.id));
              }}
              className="space-y-4"
            >
              {localProjects.map((p) => (
                <Reorder.Item
                  key={p.id}
                  value={p}
                  className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border group cursor-default"
                >
                  <div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/50 hover:text-primary transition-colors">
                    <GripVertical size={20} />
                  </div>
                  <img src={p.image} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold break-words">{p.title}</p>
                    <p className="text-xs text-muted-foreground break-words">{p.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingProject(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Pen size={18} />
                    </button>
                    <button onClick={() => handleAction(deleteProject, `project:${p.id}`)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
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
                handleAction(editingExperience ? updateExperience : addExperience, fd, e.currentTarget);
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
                <div className="space-y-1">
                  <input name="role" defaultValue={editingExperience?.role || ""} placeholder="Role (e.g., Senior Developer)" required maxLength={50} className="w-full bg-background border border-border rounded-xl p-3 h-12" onChange={(e) => setCharCounts({...charCounts, e_role: e.target.value.length})} />
                  <p className="text-[10px] text-right text-muted-foreground">{charCounts.e_role || editingExperience?.role?.length || 0}/50</p>
                </div>
                <div className="space-y-1">
                  <input name="company" defaultValue={editingExperience?.company || ""} placeholder="Company Name" required maxLength={50} className="w-full bg-background border border-border rounded-xl p-3 h-12" onChange={(e) => setCharCounts({...charCounts, e_company: e.target.value.length})} />
                  <p className="text-[10px] text-right text-muted-foreground">{charCounts.e_company || editingExperience?.company?.length || 0}/50</p>
                </div>
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
              <div className="space-y-1">
                <textarea name="description" defaultValue={editingExperience?.description || ""} placeholder="Description/Achievements" rows={3} required maxLength={255} className="w-full bg-background border border-border rounded-xl p-4" onChange={(e) => setCharCounts({...charCounts, e_desc: e.target.value.length})} />
                <p className="text-[10px] text-right text-muted-foreground">{charCounts.e_desc || editingExperience?.description?.length || 0}/255</p>
              </div>
              <button disabled={isPending} className="px-8 py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50 transition-all active:scale-95">
                {isPending ? "Processing..." : editingExperience ? "Save Changes" : "Add Entry"}
              </button>
            </form>

            <Reorder.Group
              axis="y"
              values={localExperiences}
              onReorder={(newOrder) => {
                setLocalExperiences(newOrder);
                reorderExperiences(newOrder.map(e => e.id));
              }}
              className="space-y-4"
            >
              {localExperiences.map((exp) => (
                <Reorder.Item
                  key={exp.id}
                  value={exp}
                  className="flex items-center justify-between bg-card p-6 rounded-2xl border border-border group cursor-default"
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/50 hover:text-primary transition-colors">
                      <GripVertical size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-lg break-words">{exp.role}</p>
                      <p className="text-sm text-primary font-medium break-words">{exp.company} • {exp.period}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingExperience(exp)} className="p-3 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                      <Pen size={20} />
                    </button>
                    <button onClick={() => handleAction(deleteExperience, `experience:${exp.id}`)} className="p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
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
        title="Confirm Deletion"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete Item"
        variant="destructive"
      />

      {/* Identity Profile Update Confirm Modal */}
      <ConfirmModal
        isOpen={showProfileConfirm}
        onConfirm={() => {
          setShowProfileConfirm(false);
          if (profileFormRef.current) {
            const fd = new FormData(profileFormRef.current);
            handleAction(updateProfile, fd, profileFormRef.current);
          }
        }}
        onCancel={() => setShowProfileConfirm(false)}
        title="Confirm Identity Sync"
        message="Are you sure you want to update your professional identity? This will sync all changes across your public portfolio."
        confirmLabel="Sync Now"
        variant="primary"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModalShow}
        onClose={() => setErrorModalShow(false)}
        message={errorModalMsg}
      />
    </div>
  );
}
