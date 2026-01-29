"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PhoneCollectionModalProps {
    isOpen: boolean;
    onPhoneUpdated: (phone: string) => void;
}

export function PhoneCollectionModal({ isOpen, onPhoneUpdated }: PhoneCollectionModalProps) {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!phone.trim()) {
            setError("Please enter a valid phone number");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/profile/update-phone", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update phone number");
            }

            onPhoneUpdated(phone);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Phone className="text-blue-500" size={24} />
                        Add Phone Number
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        To continue using your account securely, please provide your phone number. This helps us verify your identity.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Phone Number</label>
                        <div className="relative">
                            <Input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={(e: any) => setPhone(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white pl-10 focus:ring-blue-500"
                            />
                            <Phone className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save & Continue"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
