"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus, Image as ImageIcon, Link as LinkIcon, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type PromoPopup = {
  id: string;
  pagePath: string;
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
};

export default function PromoPopupsSettings({
  initialPopups = [],
  onUpdate
}: {
  initialPopups: PromoPopup[];
  onUpdate?: () => void;
}) {
  const [popups, setPopups] = useState<PromoPopup[]>(initialPopups);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const handleSave = async (newPopups: PromoPopup[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "promoPopups",
          value: newPopups
        }),
      });

      if (res.ok) {
        toast.success("Promo popups saved successfully");
        setPopups(newPopups);
        if (onUpdate) onUpdate();
      } else {
        toast.error("Failed to save popups");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const addPopup = () => {
    const newPopup: PromoPopup = {
      id: Math.random().toString(36).substring(2, 9),
      pagePath: "/",
      imageUrl: "",
      linkUrl: "",
      enabled: false,
    };
    const updated = [...popups, newPopup];
    setPopups(updated);
  };

  const removePopup = (id: string) => {
    const updated = popups.filter(p => p.id !== id);
    setPopups(updated);
    handleSave(updated);
  };

  const updatePopup = (id: string, field: keyof PromoPopup, value: any) => {
    const updated = popups.map(p => p.id === id ? { ...p, [field]: value } : p);
    setPopups(updated);
    if (field === "enabled") {
        handleSave(updated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !activeUploadId) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "promo-popups");
    formData.append("noCrop", "true");

    setUploadingId(activeUploadId);

    try {
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updatePopup(activeUploadId, "imageUrl", data.url);
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploadingId(null);
      setActiveUploadId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="bg-gray-900/50 border-white/10 text-white mt-8 overflow-hidden relative">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />

      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-xl flex items-center gap-2">
                <ImageIcon className="text-blue-400" size={24} />
                Promotional Popups
            </CardTitle>
            <CardDescription className="text-gray-400">
                Manage page-specific image popups (offers, announcements).
            </CardDescription>
        </div>
        <Button onClick={addPopup} variant="outline" className="border-blue-500/50 hover:bg-blue-500/20 text-blue-400">
            <Plus size={16} className="mr-2" /> Add Popup
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence>
            {popups.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                    No promotional popups configured yet.
                </motion.div>
            )}

            {popups.map((popup) => (
                <motion.div 
                    key={popup.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="p-5 border border-white/10 rounded-xl bg-black/40 flex flex-col md:flex-row gap-6 relative group"
                >
                    <button 
                        onClick={() => removePopup(popup.id)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors bg-black/50 p-2 rounded-lg opacity-0 group-hover:opacity-100 z-10"
                        title="Delete popup"
                    >
                        <Trash2 size={16} />
                    </button>

                    <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-900 rounded-lg border border-white/10 overflow-hidden relative flex items-center justify-center">
                        {popup.imageUrl ? (
                            <>
                                <img src={popup.imageUrl} alt="Popup Preview" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        onClick={() => { setActiveUploadId(popup.id); fileInputRef.current?.click(); }}
                                        disabled={uploadingId === popup.id}
                                    >
                                        {uploadingId === popup.id ? <Loader2 className="animate-spin" size={16} /> : "Change Image"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <Button 
                                    variant="secondary"
                                    onClick={() => { setActiveUploadId(popup.id); fileInputRef.current?.click(); }}
                                    disabled={uploadingId === popup.id}
                                >
                                    {uploadingId === popup.id ? <Loader2 className="animate-spin mr-2" size={16} /> : <ImageIcon className="mr-2" size={16} />}
                                    Upload Image
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <Switch 
                                    checked={popup.enabled} 
                                    onCheckedChange={(c) => updatePopup(popup.id, "enabled", c)} 
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                                <div>
                                    <Label className="font-semibold">{popup.enabled ? "Active" : "Disabled"}</Label>
                                    <p className="text-[10px] text-gray-400">Toggle to show/hide this popup</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><MapPin size={14} className="text-blue-400"/> Target Page Path</Label>
                            <Input 
                                value={popup.pagePath}
                                onChange={(e) => updatePopup(popup.id, "pagePath", e.target.value)}
                                placeholder="e.g., /, /courses, /internships, or *"
                                className="bg-white/5 border-white/10 font-mono text-sm"
                            />
                            <p className="text-xs text-gray-400">Where should this popup appear? Use <code className="text-blue-400">*</code> for all pages.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><LinkIcon size={14} className="text-purple-400"/> Destination Link (Optional)</Label>
                            <Input 
                                value={popup.linkUrl}
                                onChange={(e) => updatePopup(popup.id, "linkUrl", e.target.value)}
                                placeholder="e.g., /courses/full-stack"
                                className="bg-white/5 border-white/10"
                            />
                            <p className="text-xs text-gray-400">Where should the user go if they click the image?</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>

        {popups.length > 0 && (
            <div className="flex justify-end pt-4 border-t border-white/10">
                <Button 
                    onClick={() => handleSave(popups)} 
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                    Save Popup Settings
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
