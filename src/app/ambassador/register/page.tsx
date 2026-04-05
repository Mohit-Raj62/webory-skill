"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  Linkedin, 
  MessageSquare,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  School,
  Building,
  Stethoscope,
  HardHat,
  LayoutGrid,
  MapPin,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  Upload,
  User,
  Sparkles,
  Search,
  Check,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { INDIAN_STATES, INDIAN_STATES_CITIES } from "@/lib/data/india";

// --- Constants ---
const STEPS = [
  "Category Selection",
  "Education Level",
  "Field Type",
  "Academic/Professional Details",
  "Identity Hub"
];

// --- Types ---
type FormData = {
  category: string;
  studyLevel: string;
  courseType: string;
  college: string;
  collegeState: string;
  collegeCity: string;
  courseName: string;
  graduationYear: string;
  collegeIdCardUrl: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  panCardNumber: string;
  appliedReferralCode: string;
  linkedin: string;
  reason: string;
};

// --- Reusable Components (Dark Mode) ---

const PremiumInput = memo(({ 
  label, icon: Icon, placeholder, value, onChange, type = "text", required = false, name 
}: { 
  label: string; icon?: any; placeholder: string; value: string; onChange: (val: string) => void; type?: string; required?: boolean; name?: string;
}) => (
  <div className="space-y-2 w-full group">
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{label} {required && "*"}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors w-4 h-4" />}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-11' : 'px-5'} pr-5 py-4 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm hover:border-white/10 font-medium text-white placeholder:text-gray-700`}
        required={required}
      />
    </div>
  </div>
));
PremiumInput.displayName = "PremiumInput";

const PremiumSelect = memo(({ 
  label, icon: Icon, value, options, onChange, placeholder, required = false 
}: { 
  label: string; icon?: any; value: string; options: string[]; onChange: (val: string) => void; placeholder: string; required?: boolean;
}) => (
  <div className="space-y-2 w-full group overflow-hidden">
    {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{label} {required && "*"}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors w-4 h-4 z-10" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-11' : 'px-5'} pr-10 py-4 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm hover:border-white/10 font-medium text-white appearance-none cursor-pointer relative z-0`}
        required={required}
      >
        <option value="" disabled className="bg-zinc-950">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-zinc-950 font-sans">{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
));
PremiumSelect.displayName = "PremiumSelect";

// --- Step Components (Dark Theme) ---

const CategoryStep = memo(({ formData, updateField, nextStep }: { formData: FormData, updateField: any, nextStep: (cat?: string) => void }) => (
  <div className="space-y-10">
    <div className="text-center space-y-2 lg:space-y-3 px-2">
      <div className="flex items-center justify-center gap-2 mb-2">
         <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500 animate-pulse" />
         <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/50">Stage One</span>
      </div>
      <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight uppercase leading-none">Design your future</h2>
      <p className="text-[11px] lg:text-base text-gray-500 font-medium leading-relaxed">Select your status to personalize your journey</p>
    </div>
    <div className="grid grid-cols-1 gap-5 max-w-xl mx-auto">
      {[
        { id: "student", label: "University Student", icon: GraduationCap, color: "orange", desc: "Currently enrolled in college/university" },
        { id: "business-owner", label: "Business Owner", icon: Zap, color: "blue", desc: "Running your own business or agency" },
        { id: "working-professional", label: "Working Pro", icon: Briefcase, color: "indigo", desc: "Corporate employee or industry expert" },
      ].map((item) => {
        const Icon = item.icon;
        const isActive = formData.category === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => { updateField("category", item.id); nextStep(item.id); }}
            className={`flex items-center gap-4 lg:gap-6 p-5 lg:p-7 rounded-[2rem] lg:rounded-[2.5rem] border transition-all text-left relative overflow-hidden group ${
              isActive ? "border-orange-500/50 bg-orange-500/5 shadow-2xl shadow-orange-500/10" : "border-white/5 hover:border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 transition-all duration-500 relative z-10 ${
              isActive ? "bg-orange-600 text-white shadow-xl shadow-orange-500/20" : "bg-white/5 text-gray-600 group-hover:bg-white/10"
            }`}>
              <Icon className="w-6 h-6 lg:w-10 lg:h-10" />
            </div>
            <div className="relative z-10">
              <div className="font-black text-white text-lg lg:text-xl">{item.label}</div>
              <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{item.desc}</div>
            </div>
            {isActive && (
              <motion.div layoutId="check-cat" className="absolute right-8">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <Check className="w-5 h-5" />
                </div>
              </motion.div>
            )}
          </button>
        );
      })}
    </div>
  </div>
));
CategoryStep.displayName = "CategoryStep";

const StudyStep = memo(({ formData, updateField, nextStep }: { formData: FormData, updateField: any, nextStep: any }) => (
  <div className="space-y-10">
    <div className="text-center space-y-3">
      <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight uppercase">Current Education</h2>
      <p className="text-gray-500 font-medium tracking-tight">Tell us about your campus environment</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {[
        { id: "university", label: "University", icon: Building2 },
        { id: "college", label: "College", icon: School },
      ].map((item) => {
        const Icon = item.icon;
        const isActive = formData.studyLevel === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => { updateField("studyLevel", item.id); nextStep(); }}
            className={`flex flex-col items-center gap-4 lg:gap-6 p-8 lg:p-14 rounded-[2rem] lg:rounded-[3rem] border transition-all relative overflow-hidden group ${
              isActive ? "border-orange-500/50 bg-orange-500/5 shadow-2xl" : "border-white/5 hover:border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className={`w-20 h-20 lg:w-32 lg:h-32 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${
              isActive ? "bg-orange-500 text-white rotate-[360deg] shadow-2xl shadow-orange-500/30" : "bg-white/5 text-gray-600 group-hover:bg-white/10"
            }`}>
              <Icon className="w-8 h-8 lg:w-14 lg:h-14" />
            </div>
            <div className="font-black text-lg lg:text-2xl text-white relative z-10">{item.label}</div>
            {isActive && <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white"><Check className="w-4 h-4" /></div>}
          </button>
        );
      })}
    </div>
  </div>
));
StudyStep.displayName = "StudyStep";

const FieldStep = memo(({ formData, updateField, nextStep }: { formData: FormData, updateField: any, nextStep: any }) => (
  <div className="space-y-10">
    <div className="text-center space-y-2 lg:space-y-3 px-2">
      <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight uppercase leading-tight">Field of interest</h2>
      <p className="text-[11px] lg:text-base text-gray-500 font-medium">Select the domain that aligns with your passions</p>
    </div>
    <div className="grid grid-cols-1 gap-5 max-w-xl mx-auto">
      {[
        { id: "medical", label: "Medical Sciences", sub: "MBBS, MD, MS, BDS", icon: Stethoscope },
        { id: "engineering", label: "Engineering & Tech", sub: "B.Tech, M.Tech, BCA, IT", icon: HardHat },
        { id: "other", label: "Other Fields", sub: "Arts, Commerce, Law, etc.", icon: LayoutGrid },
      ].map((item) => {
        const Icon = item.icon;
        const isActive = formData.courseType === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => { updateField("courseType", item.id); nextStep(); }}
            className={`flex items-center gap-4 lg:gap-6 p-5 lg:p-7 rounded-[2rem] lg:rounded-[2.5rem] border transition-all text-left relative group ${
              isActive ? "border-orange-500/50 bg-orange-500/5 shadow-2xl" : "border-white/5 hover:border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 transition-all duration-500 ${
              isActive ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20" : "bg-white/5 text-gray-600 group-hover:bg-white/10"
            }`}>
              <Icon className="w-6 h-6 lg:w-10 lg:h-10" />
            </div>
            <div className="flex-1">
              <div className="font-black text-white text-base lg:text-xl">{item.label}</div>
              <div className="text-[10px] font-black text-gray-500 mt-1 uppercase tracking-widest leading-none">{item.sub}</div>
            </div>
            {isActive && <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0"><Check className="w-5 h-5" /></div>}
          </button>
        );
      })}
    </div>
  </div>
));
FieldStep.displayName = "FieldStep";

const AcademicStep = memo(({ formData, updateField, nextStep, uploading, handleFileUpload }: { formData: FormData, updateField: any, nextStep: any, uploading: boolean, handleFileUpload: any }) => {
  const isStudent = formData.category === "student";
  const citiesList = useMemo(() => {
    return formData.collegeState ? INDIAN_STATES_CITIES[formData.collegeState as keyof typeof INDIAN_STATES_CITIES] || [] : [];
  }, [formData.collegeState]);

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="text-center space-y-2 lg:space-y-3 px-2">
        <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight uppercase leading-none">{isStudent ? "Academic Profile" : "Professional Identity"}</h2>
        <p className="text-[11px] lg:text-base text-gray-500 font-medium leading-relaxed">{isStudent ? "Your institution information" : "Your corporate details"}</p>
      </div>
      
      <div className="grid gap-6">
        <PremiumInput 
          label={isStudent ? "Institution Name" : "Company / Organization Name"} 
          icon={Building2} placeholder={isStudent ? "Enter your college or university" : "Enter your company name"} 
          value={formData.college} onChange={(val) => updateField("college", val)} required 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumSelect 
            label={isStudent ? "Institution State" : "Work / Office State"} icon={MapPin} value={formData.collegeState} 
            options={INDIAN_STATES} onChange={(val) => updateField("collegeState", val)} 
            placeholder="Select State" required 
          />
          <PremiumSelect 
            label={isStudent ? "Institution City" : "Work / Office City"} icon={Search} value={formData.collegeCity} 
            options={citiesList} onChange={(val) => updateField("collegeCity", val)} 
            placeholder="Select City" required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumInput 
            label={isStudent ? "Course Name" : "Job Role / Designation"} 
            icon={isStudent ? GraduationCap : MessageSquare} 
            placeholder={isStudent ? "e.g. B.Tech CS" : "e.g. Marketing Manager"} 
            value={formData.courseName} onChange={(val) => updateField("courseName", val)} required 
          />
          <PremiumSelect 
            label={isStudent ? "Graduation Year" : "Years of Experience"} 
            icon={Calendar} value={formData.graduationYear} 
            options={isStudent ? ["2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035"] : ["Fresher", "1-2 Years", "2-5 Years", "5+ Years"]} 
            onChange={(val) => updateField("graduationYear", val)} 
            placeholder="Select Option" required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {isStudent ? (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">College ID Card</label>
              <label className={`flex flex-col items-center justify-center py-4 border border-dashed rounded-2xl cursor-pointer transition-all ${
                formData.collegeIdCardUrl ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-orange-500/50 hover:bg-white/5'
              }`}>
                {uploading ? <Loader2 className="w-5 h-5 text-orange-500 animate-spin" /> : (
                  formData.collegeIdCardUrl ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Upload className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">{uploading ? "Uploading..." : (formData.collegeIdCardUrl ? "Photo Added" : "Upload ID Image")}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            </div>
          ) : (
             <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-bold text-gray-500 italic leading-snug">
                * Professionals and Business Owners are verified via their LinkedIn profile and experience.
             </div>
          )}
          <PremiumInput 
            label="Referral Code (Optional)" icon={Sparkles} placeholder="Enter code if any" 
            value={formData.appliedReferralCode} onChange={(val) => updateField("appliedReferralCode", val)} 
          />
        </div>
      </div>

      <Button 
        onClick={nextStep}
        disabled={!formData.college || !formData.collegeState || !formData.courseName}
        className="w-full py-6 lg:py-9 rounded-[1.5rem] lg:rounded-[2.5rem] bg-white text-gray-950 text-base lg:text-lg font-black transition-all shadow-2xl hover:bg-gray-200 active:scale-95"
      >
        Proceed to Contact Details
      </Button>
    </div>
  );
});
AcademicStep.displayName = "AcademicStep";

const FinalStep = memo(({ formData, updateField, loading, handleSubmit }: { formData: FormData, updateField: any, loading: boolean, handleSubmit: any }) => {
  const personalCities = useMemo(() => {
    return formData.state ? INDIAN_STATES_CITIES[formData.state as keyof typeof INDIAN_STATES_CITIES] || [] : [];
  }, [formData.state]);

  return (
    <div className="space-y-12 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight uppercase">Identity Hub</h2>
        <p className="text-gray-500 font-medium tracking-tight uppercase tracking-widest text-[10px]">Verify your profile details</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white/[0.02] p-8 lg:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-6">
          <PremiumInput 
            label="Communication Address" icon={MapPin} placeholder="Flat, Street, Area" 
            value={formData.address} onChange={(val) => updateField("address", val)} required 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumSelect 
              label="Your State" icon={MapPin} value={formData.state} 
              options={INDIAN_STATES} onChange={(val) => updateField("state", val)} 
              placeholder="Select State" required 
            />
            <PremiumSelect 
              label="Your City" icon={Search} value={formData.city} 
              options={personalCities} onChange={(val) => updateField("city", val)} 
              placeholder="Select City" required 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInput 
              label="Pincode" icon={MapPin} placeholder="6 Digit Code" 
              value={formData.pincode} onChange={(val) => updateField("pincode", val)} required 
            />
             <PremiumInput 
              label="PAN Card Number" icon={CreditCard} placeholder="10 Digit PAN" 
              value={formData.panCardNumber} onChange={(val) => updateField("panCardNumber", val)} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <PremiumInput 
            label="LinkedIn Profile" icon={Linkedin} placeholder="https://linkedin.com/in/..." 
            value={formData.linkedin} onChange={(val) => updateField("linkedin", val)} 
          />
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Your Vision for Webory *</label>
            <div className="relative">
              <MessageSquare className="absolute left-5 top-5 text-gray-700 group-focus-within:text-orange-500 transition-colors w-4 h-4" />
              <textarea
                placeholder="Share your goals as an Ambassador..."
                value={formData.reason}
                onChange={(e) => updateField("reason", e.target.value)}
                className="w-full pl-12 pr-6 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none h-40 resize-none shadow-sm transition-all hover:border-white/10 font-medium text-white placeholder:text-gray-700"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-6 lg:py-9 rounded-[1.5rem] lg:rounded-[2.5rem] bg-orange-600 hover:bg-orange-700 text-white text-base lg:text-xl font-black transition-all shadow-2xl shadow-orange-500/20 active:scale-95"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Complete My Application"}
      </Button>
    </div>
  );
});
FinalStep.displayName = "FinalStep";

// --- Main Page ---

export default function AmbassadorRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    category: "", studyLevel: "", courseType: "", college: "", collegeState: "", collegeCity: "", 
    courseName: "", graduationYear: "", collegeIdCardUrl: "", address: "", city: "", state: "", 
    pincode: "", panCardNumber: "", appliedReferralCode: "", linkedin: "", reason: "",
  });

  const updateField = useCallback((name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    fetch("/api/ambassador/stats")
      .then((res) => {
        if (res.status === 401) {
          toast.error("Please login to apply");
          router.push("/login?redirect=/ambassador/register");
        } else if (res.ok) {
          toast.info("Already an ambassador!");
          router.push("/ambassador/dashboard");
        } else {
          setIsPageLoading(false);
        }
      })
      .catch(() => setIsPageLoading(false));
  }, [router]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("File size must be less than 2MB");

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload/image", { method: "POST", body: uploadData });
      const data = await res.json();
      if (data.url) {
        updateField("collegeIdCardUrl", data.url);
        toast.success("Image uploaded successfully!");
      } else throw new Error(data.error);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [updateField]);

  const handleSubmit = useCallback(async () => {
    // 1. Core Validation
    if (!formData.category) return toast.error("Please select a category first");
    if (!formData.college) return toast.error("Please enter your " + (formData.category === "student" ? "college name" : "organization name"));
    if (!formData.courseName) return toast.error("Please enter your " + (formData.category === "student" ? "course name" : "job role"));
    if (!formData.graduationYear) return toast.error("Please select " + (formData.category === "student" ? "graduation year" : "experience level"));
    
    // 2. Student Specific Validation
    if (formData.category === "student" && !formData.collegeIdCardUrl) {
      return toast.error("Please upload your College ID Card for verification");
    }

    // 3. Contact Validation
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      return toast.error("Please fill in your complete address");
    }
    if (!formData.linkedin) return toast.error("Please provide your LinkedIn profile URL");
    if (!formData.reason) return toast.error("Please share why you want to join Webory");

    setLoading(true);
    try {
      const res = await fetch("/api/ambassador/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Application submitted successfully! 🚀");
        router.push("/ambassador/dashboard");
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (error) {
       console.error("FRONTEND_SUBMIT_ERROR:", error);
       toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  const nextStep = useCallback((categoryOverride?: string) => {
    const category = categoryOverride || formData.category;
    if (currentStep === 1 && category !== "student") {
      setCurrentStep(4);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  }, [currentStep, formData.category]);

  const prevStep = useCallback(() => {
    if (currentStep === 4 && formData.category !== "student") {
      setCurrentStep(1);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  }, [currentStep, formData.category]);

  if (isPageLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 mt-6 tracking-[0.5em]">Authenticating...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-orange-500/30 selection:text-white">
      <Navbar />

      <div className="pt-24 lg:pt-40 container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Progress Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 gap-6">
           <div className="flex items-center gap-4 lg:gap-6">
              <button 
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all ${currentStep === 1 ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-white/[0.05] text-white shadow-xl hover:bg-white/10 active:scale-90 border border-white/5'}`}
              >
                <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <div className="flex flex-col">
                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1">Elite Ambassador 2026</span>
                <h1 className="text-lg lg:text-2xl font-black text-white tracking-tight leading-none uppercase">{STEPS[currentStep - 1]}</h1>
              </div>
           </div>
           
           <div className="flex items-center justify-between lg:justify-start gap-4 bg-white/[0.03] backdrop-blur-md p-1.5 rounded-2xl lg:rounded-3xl border border-white/5 shadow-sm overflow-hidden">
             <div className="flex -space-x-1 pr-4 border-r border-white/5 pl-2">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full transition-all duration-500 ${s <= currentStep ? 'bg-orange-500 w-3 lg:w-4' : 'bg-white/10'}`} />
                ))}
             </div>
             <span className="text-[8px] lg:text-[10px] font-bold text-gray-500 px-2 lg:px-3 uppercase tracking-widest leading-none">
                {formData.category === "student" || !formData.category 
                  ? `${Math.round((currentStep / 5) * 100)}% Complete`
                  : `${currentStep === 1 ? '33%' : currentStep === 4 ? '66%' : '100%'} Complete`
                }
             </span>
           </div>
        </div>

        {/* Dynamic Step View */}
        <div className="relative py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentStep === 1 && <CategoryStep formData={formData} updateField={updateField} nextStep={nextStep} />}
              {currentStep === 2 && <StudyStep formData={formData} updateField={updateField} nextStep={nextStep} />}
              {currentStep === 3 && <FieldStep formData={formData} updateField={updateField} nextStep={nextStep} />}
              {currentStep === 4 && <AcademicStep formData={formData} updateField={updateField} nextStep={nextStep} uploading={uploading} handleFileUpload={handleFileUpload} />}
              {currentStep === 5 && <FinalStep formData={formData} updateField={updateField} loading={loading} handleSubmit={handleSubmit} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Footer */}
        <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Your data is secured through AES-256 encryption</span>
            </div>
        </div>
      </div>

      <Footer />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          background-color: #050505;
          overflow-x: hidden;
          color: white;
        }
        select {
          cursor: pointer !important;
        }
        select option {
            background-color: #050505 !important;
            color: white !important;
            padding: 10px !important;
        }
      `}</style>
    </main>
  );
}
