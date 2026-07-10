"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Shield, Settings2, Megaphone, BellRing, Smartphone, MonitorSmartphone, LogOut, KeyRound } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import PromoPopupsSettings, { PromoPopup } from "./PromoPopupsSettings";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    expertise: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 2FA States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          bio: data.user.bio || "",
          expertise: data.user.expertise || "",
        });
        setTwoFactorEnabled(data.user.isTwoFactorEnabled || false);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const [careerEnabled, setCareerEnabled] = useState(true);
  const [mentorshipEnabled, setMentorshipEnabled] = useState(true);
  
  const [announcementSettings, setAnnouncementSettings] = useState({
    enabled: true,
    text: "Waitlist for January 2026 is full. February batch closing soon!"
  });

  const [promoPopups, setPromoPopups] = useState<PromoPopup[]>([]);
  const [role2FARequirements, setRole2FARequirements] = useState({
    admin: false,
    teacher: false,
    student: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setCareerEnabled(data.careerApplicationsEnabled);
        setMentorshipEnabled(data.mentorshipEnabled);
        if (data.announcementBar) {
            setAnnouncementSettings(data.announcementBar);
        }
        if (data.promoPopups) {
            setPromoPopups(data.promoPopups);
        }
        if (data.role2FARequirements) {
            setRole2FARequirements(data.role2FARequirements);
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const handleCareerToggle = async (checked: boolean) => {
    try {
      setCareerEnabled(checked); // Optimistic update
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "careerApplicationsEnabled",
          value: checked
        }),
      });

      if (res.ok) {
        toast.success(`Career applications ${checked ? "enabled" : "disabled"}`);
      } else {
        setCareerEnabled(!checked); // Revert on failure
        const errorText = await res.text();
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch (e) {
            errorData = { error: `Server Error (${res.status})` };
        }
        toast.error(errorData.error || "Failed to update setting");
        console.error("Setting error:", errorData);
      }
    } catch (error) {
      setCareerEnabled(!checked);
      toast.error("Network error. Please check your connection.");
      console.error("Fetch error:", error);
    }
  };

  const handleMentorshipToggle = async (checked: boolean) => {
    try {
      setMentorshipEnabled(checked); // Optimistic update
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "mentorshipEnabled",
          value: checked
        }),
      });

      if (res.ok) {
        toast.success(`Mentorship ${checked ? "enabled" : "disabled"}`);
      } else {
        setMentorshipEnabled(!checked); // Revert on failure
        const errorText = await res.text();
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch (e) {
            errorData = { error: `Server Error (${res.status})` };
        }
        toast.error(errorData.error || "Failed to update setting");
        console.error("Setting error:", errorData);
      }
    } catch (error) {
      setMentorshipEnabled(!checked);
      toast.error("Network error. Please check your connection.");
      console.error("Fetch error:", error);
    }
  };

  const handleAnnouncementUpdate = async (newSettings: any) => {
    try {
        setAnnouncementSettings(newSettings); // Optimistic
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "announcementBar",
            value: newSettings
          }),
        });
  
        if (res.ok) {
          toast.success("Announcement updated");
        } else {
          toast.error("Failed to update setting");
        }
      } catch (error) {
        toast.error("Failed to update setting");
    }
  };

  const handleRole2FAToggle = async (role: "admin" | "teacher" | "student", checked: boolean) => {
    const newRequirements = { ...role2FARequirements, [role]: checked };
    try {
      setRole2FARequirements(newRequirements); // Optimistic update
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "role2FARequirements",
          value: newRequirements
        }),
      });

      if (res.ok) {
        toast.success(`2FA requirement updated for ${role}s`);
      } else {
        setRole2FARequirements(role2FARequirements); // Revert on failure
        toast.error("Failed to update 2FA requirement");
      }
    } catch (error) {
      setRole2FARequirements(role2FARequirements); // Revert
      toast.error("Network error. Please check your connection.");
    }
  };

  const handleGenerate2FA = async () => {
    try {
      const res = await fetch("/api/auth/2fa/generate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setQrCodeUrl(data.qrCodeUrl);
        setShowTwoFactorModal(true);
      } else {
        toast.error(data.error || "Failed to generate 2FA");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEnable2FA = async () => {
    try {
      const res = await fetch("/api/auth/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: twoFactorCode }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("2FA Enabled Successfully!");
        setTwoFactorEnabled(true);
        setRecoveryCodes(data.recoveryCodes);
        setTwoFactorCode("");
      } else {
        toast.error(data.error || "Invalid code");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt("Please enter a 2FA code to disable Two-Factor Authentication:");
    if (!code) return;

    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("2FA Disabled Successfully!");
        setTwoFactorEnabled(false);
        setShowTwoFactorModal(false);
      } else {
        toast.error(data.error || "Failed to disable 2FA");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading settings...</div>;
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Platform Settings</h1>
        <p className="text-gray-400">Manage your account, security, and global application configuration.</p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col lg:flex-row gap-8">
        <TabsList className="flex flex-col w-full lg:w-64 h-auto bg-transparent border-r border-white/10 rounded-none p-0 items-start justify-start space-y-2">
            <TabsTrigger value="profile" className="w-full justify-start gap-3 px-4 py-3 text-sm data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-400 data-[state=active]:shadow-none rounded-xl transition-all">
                <UserCircle size={18} />
                Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start gap-3 px-4 py-3 text-sm data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-400 data-[state=active]:shadow-none rounded-xl transition-all">
                <Shield size={18} />
                Security
            </TabsTrigger>
            <TabsTrigger value="platform" className="w-full justify-start gap-3 px-4 py-3 text-sm data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-400 data-[state=active]:shadow-none rounded-xl transition-all">
                <Settings2 size={18} />
                Platform Features
            </TabsTrigger>
            <TabsTrigger value="marketing" className="w-full justify-start gap-3 px-4 py-3 text-sm data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-400 data-[state=active]:shadow-none rounded-xl transition-all">
                <Megaphone size={18} />
                Marketing & Offers
            </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="profile" className="mt-0 outline-none">
            <Card className="bg-gray-900/40 border-white/5 text-white shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription className="text-gray-400">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="bg-white/5 border-white/10" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="bg-white/5 border-white/10" 
                  disabled
                />
                <p className="text-[10px] text-gray-500">Contact admin to change email.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="bg-white/5 border-white/10" 
                  placeholder="+91..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Job Title / Expertise</Label>
              <Input 
                id="expertise" 
                value={profileData.expertise}
                onChange={(e) => setProfileData({...profileData, expertise: e.target.value})}
                className="bg-white/5 border-white/10" 
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea 
                id="bio" 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Tell us a little about yourself..."
              />
            </div>
            <div className="pt-4 flex justify-end border-t border-white/5">
              <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">Save Profile</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-0 outline-none space-y-8">
        <Card className="bg-gray-900/40 border-white/5 text-white shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound className="text-blue-400" size={20}/> Change Password</CardTitle>
            <CardDescription className="text-gray-400">Ensure your account is using a long, random password to stay secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                    id="newPassword" 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="bg-white/5 border-white/10" 
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="bg-white/5 border-white/10" 
                />
                </div>
            </div>
            <div className="pt-4 flex justify-end border-t border-white/5">
              <Button onClick={handlePasswordUpdate} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">Update Password</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/40 border-white/5 text-white shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="text-emerald-400" size={20}/> Two-Factor Authentication</CardTitle>
            <CardDescription className="text-gray-400">Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <Smartphone className="text-emerald-400" size={24} />
                    </div>
                    <div>
                        <Label className="text-base font-semibold flex items-center gap-2">
                            Authenticator App
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider font-bold">Recommended</span>
                        </Label>
                        <p className="text-sm text-gray-400 mt-1">Use an app like Google Authenticator or Authy to generate one-time codes.</p>
                    </div>
                </div>
                <Button variant={twoFactorEnabled ? "destructive" : "outline"} className={twoFactorEnabled ? "" : "border-white/10 hover:bg-white/5"} onClick={twoFactorEnabled ? handleDisable2FA : handleGenerate2FA}>
                    {twoFactorEnabled ? "Disable" : "Set Up"}
                </Button>
            </div>
            {twoFactorEnabled && recoveryCodes.length > 0 && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-emerald-400 font-semibold mb-2">Save these Recovery Codes!</p>
                    <p className="text-sm text-emerald-400/80 mb-4">If you lose access to your authenticator app, you can use these codes to log in. Each code can only be used once.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {recoveryCodes.map(c => (
                            <div key={c} className="bg-black/40 text-emerald-300 px-3 py-2 rounded font-mono text-center tracking-widest text-sm">{c}</div>
                        ))}
                    </div>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/40 border-white/5 text-white shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="text-blue-400" size={20}/> 2FA Enforcement Policy</CardTitle>
            <CardDescription className="text-gray-400">Require specific user roles to enable Two-Factor Authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-base">Require 2FA for Admins</Label>
                <p className="text-sm text-gray-400">Admins must set up 2FA to access the platform.</p>
              </div>
              <Switch checked={role2FARequirements.admin} onCheckedChange={(checked) => handleRole2FAToggle("admin", checked)} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-base">Require 2FA for Teachers</Label>
                <p className="text-sm text-gray-400">Teachers must set up 2FA to access the platform.</p>
              </div>
              <Switch checked={role2FARequirements.teacher} onCheckedChange={(checked) => handleRole2FAToggle("teacher", checked)} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-base">Require 2FA for Students</Label>
                <p className="text-sm text-gray-400">Students must set up 2FA to access the platform.</p>
              </div>
              <Switch checked={role2FARequirements.student} onCheckedChange={(checked) => handleRole2FAToggle("student", checked)} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/40 border-white/5 text-white shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MonitorSmartphone className="text-purple-400" size={20}/> Active Sessions</CardTitle>
            <CardDescription className="text-gray-400">Manage devices currently logged into your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <MonitorSmartphone className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Windows PC - Chrome</p>
                        <p className="text-xs text-gray-400 mt-0.5">Mumbai, India • 192.168.1.1</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-400">Active Now</span>
                </div>
            </div>

            <div className="pt-4 border-t border-white/5">
                <Button variant="destructive" className="w-full sm:w-auto bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all flex items-center gap-2">
                    <LogOut size={16} />
                    Log out of all other devices
                </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="platform" className="mt-0 outline-none">
        <Card className="bg-gray-900/40 border-white/5 text-white shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
            <CardDescription className="text-gray-400">Manage global application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">


            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Career Applications</Label>
                <p className="text-sm text-gray-400">
                  When disabled, the "Apply Now" button on the careers page will show "Coming Soon".
                </p>
              </div>
              <Switch
                checked={careerEnabled}
                onCheckedChange={handleCareerToggle}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Mentorship</Label>
                <p className="text-sm text-gray-400">
                  When disabled, all mentorship buttons will show "Coming Soon".
                </p>
              </div>
              <Switch
                checked={mentorshipEnabled}
                onCheckedChange={handleMentorshipToggle}
              />
            </div>

          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="marketing" className="mt-0 outline-none space-y-8">
        <Card className="bg-gray-900/40 border-white/5 text-white shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <BellRing className="text-yellow-400" size={24} />
                Global Banner
            </CardTitle>
            <CardDescription className="text-gray-400">Manage the persistent top notification banner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 p-5 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-base font-semibold">Enable Top Banner</Label>
                        <p className="text-sm text-gray-400">
                        Shows a premium gradient banner at the very top of all pages.
                        </p>
                    </div>
                    <Switch
                        checked={announcementSettings.enabled}
                        onCheckedChange={(checked) => handleAnnouncementUpdate({...announcementSettings, enabled: checked})}
                        className="data-[state=checked]:bg-emerald-500"
                    />
                </div>
                {announcementSettings.enabled && (
                    <div className="pt-4 border-t border-white/10">
                        <Label htmlFor="announcementText" className="mb-2 block text-gray-300">Banner Offer Text</Label>
                        <div className="flex gap-3">
                            <Input 
                                id="announcementText"
                                value={announcementSettings.text}
                                onChange={(e) => setAnnouncementSettings({...announcementSettings, text: e.target.value})}
                                className="bg-black/40 border-white/10"
                                placeholder="e.g. FLASH SALE: 50% OFF ALL COURSES!"
                            />
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAnnouncementUpdate(announcementSettings)}>Apply</Button>
                        </div>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
        <PromoPopupsSettings 
          initialPopups={promoPopups} 
          onUpdate={fetchSettings} 
        />
          </TabsContent>
        </div>
      </Tabs>

      {showTwoFactorModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 text-white relative">
                <button onClick={() => setShowTwoFactorModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                <h3 className="text-xl font-bold mb-2">Set Up Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400 mb-6">Scan this QR code with your Authenticator App (Google Authenticator, Authy, etc).</p>
                
                <div className="flex justify-center mb-6 bg-white p-4 rounded-xl max-w-fit mx-auto">
                    {qrCodeUrl ? <Image src={qrCodeUrl} alt="2FA QR Code" width={200} height={200} /> : <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded" />}
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter 6-Digit Code</Label>
                        <Input 
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                            placeholder="000000"
                            className="bg-white/5 border-white/10 text-center tracking-widest font-mono text-lg"
                            maxLength={6}
                        />
                    </div>
                    <Button onClick={handleEnable2FA} className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={twoFactorCode.length !== 6}>
                        Verify & Enable
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
