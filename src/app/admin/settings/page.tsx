"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          firstName: data.user.name?.split(" ")[0] || "",
          lastName: data.user.name?.split(" ")[1] || "",
          email: data.user.email || "",
        });
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
        toast.error("Failed to update setting");
      }
    } catch (error) {
      setCareerEnabled(!checked);
      toast.error("Failed to update setting");
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
        toast.error("Failed to update setting");
      }
    } catch (error) {
      setMentorshipEnabled(!checked);
      toast.error("Failed to update setting");
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading settings...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and application settings</p>
      </div>

      <div className="grid gap-8 max-w-4xl">
        {/* Profile Settings */}
        <Card className="bg-gray-900/50 border-white/10 text-white">
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-900/50 border-white/10 text-white">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription className="text-gray-400">Manage your password and security preferences</CardDescription>
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
            <Button onClick={handlePasswordUpdate} className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
          </CardContent>
        </Card>

        {/* Global Settings */}
        <Card className="bg-gray-900/50 border-white/10 text-white">
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
      </div>
    </div>
  );
}
