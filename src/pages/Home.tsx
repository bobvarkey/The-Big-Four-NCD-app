import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Droplets, Heart, Scale, Syringe, Activity as PulseIcon, Dna, FileText, ChevronRight, Info, ChevronDown, Upload, Sparkles, ArrowRight, Calculator, Stethoscope, FileSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PrescriptionState {
  visible: boolean;
  content: React.ReactNode;
  severity?: string;
}

const categoryColors = {
  diabetes: {
    accent: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.2)",
    gradient: "from-red-500 to-rose-600",
  },
  hypertension: {
    accent: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.2)",
    gradient: "from-orange-500 to-amber-600",
  },
  lipid: {
    accent: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.2)",
    gradient: "from-blue-500 to-cyan-600",
  },
  obesity: {
    accent: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.2)",
    gradient: "from-violet-500 to-purple-600",
  },
};

// Full forms data for abbreviations
const fullForms: Record<string, string> = {
  // Diabetes
  "FG": "Fasting Glucose",
  "HbA1c": "Glycated Hemoglobin",
  "PP": "Post-Prandial (2-hour)",
  "CrCl": "Creatinine Clearance",
  "CVD": "Cardiovascular Disease",
  "HF": "Heart Failure",
  "CKD": "Chronic Kidney Disease",
  // Hypertension
  "SBP": "Systolic Blood Pressure",
  "DBP": "Diastolic Blood Pressure",
  "BP": "Blood Pressure",
  "DM": "Diabetes Mellitus",
  "CAD": "Coronary Artery Disease",
  "ESC": "European Society of Cardiology",
  // Lipids
  "LDL": "Low-Density Lipoprotein",
  "HDL": "High-Density Lipoprotein",
  "TG": "Triglycerides",
  "ASCVD": "Atherosclerotic Cardiovascular Disease",
  "FHx": "Family History",
  "AACE": "American Association of Clinical Endocrinology",
  // Obesity
  "BMI": "Body Mass Index",
  "HTN": "Hypertension",
  "OSA": "Obstructive Sleep Apnea",
  "NAFLD": "Non-Alcoholic Fatty Liver Disease",
  "MASLD": "Metabolic Dysfunction-Associated Steatotic Liver Disease",
  "TOS": "The Obesity Society",
  "Rx": "Prescription",
  "NCD": "Non-Communicable Disease",
};

function AbbreviationLabel({ abbr, fullForm }: { abbr: string; fullForm?: string }) {
  const displayFullForm = fullForm || fullForms[abbr] || abbr;

  return (
    <div className="group relative inline-block">
      <button className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-help">
        {abbr}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Info className="h-3 w-3 text-muted-foreground/50" /></span>
      </button>
      <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-10">
        <div className="bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-lg border border-border whitespace-nowrap">
          {displayFullForm}
        </div>
      </div>
    </div>
  );
}

function FullFormsLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <Card className="border-border/40 bg-muted/20">
        <CollapsibleTrigger asChild>
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Abbreviations & Full Forms</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-xs">
              {Object.entries(fullForms).map(([abbr, full]) => (
                <div key={abbr} className="flex items-baseline gap-2">
                  <span className="font-medium text-foreground min-w-[3rem]">{abbr}</span>
                  <span className="text-muted-foreground">{full}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

interface OCRUploadProps {
  onValuesExtracted: (values: {
    fg?: string;
    a1c?: string;
    ldl?: string;
    hdl?: string;
    tg?: string;
    creatinine?: string;
    egfr?: string;
    age?: string;
  }) => void;
}

function OCRUpload({ onValuesExtracted }: OCRUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedValues, setExtractedValues] = useState<Record<string, string> | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsProcessing(true);
    setExtractedValues(null);

    // Simulate OCR processing with mock values
    setTimeout(() => {
      const mockValues = {
        fg: "142",
        a1c: "7.2",
        ldl: "128",
        hdl: "42",
        tg: "156",
        creatinine: "1.1",
        egfr: "",
        age: "58",
      };
      setExtractedValues(mockValues);
      onValuesExtracted(mockValues);
      setIsProcessing(false);
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setExtractedValues(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <Card className="border-border/40 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CollapsibleTrigger asChild>
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-foreground">Smart Lab Upload (OCR)</span>
              <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">Beta</Badge>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!previewUrl ? (
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Upload lab report image</p>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG, PDF</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">Auto-extracts: Glucose, HbA1c, Lipids, Creatinine, eGFR</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <img src={previewUrl} alt="Lab report preview" className="rounded-lg max-h-48 mx-auto" />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Extracting values...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {extractedValues && !isProcessing && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-green-400">Extracted Values</span>
                        <button onClick={clearImage} className="text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {extractedValues.fg && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">FG:</span>
                            <span className="font-medium">{extractedValues.fg}</span>
                          </div>
                        )}
                        {extractedValues.a1c && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">HbA1c:</span>
                            <span className="font-medium">{extractedValues.a1c}%</span>
                          </div>
                        )}
                        {extractedValues.ldl && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">LDL:</span>
                            <span className="font-medium">{extractedValues.ldl}</span>
                          </div>
                        )}
                        {extractedValues.hdl && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">HDL:</span>
                            <span className="font-medium">{extractedValues.hdl}</span>
                          </div>
                        )}
                        {extractedValues.tg && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">TG:</span>
                            <span className="font-medium">{extractedValues.tg}</span>
                          </div>
                        )}
                        {extractedValues.creatinine && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Creat:</span>
                            <span className="font-medium">{extractedValues.creatinine}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
                <p className="font-medium mb-1">Note on OCR:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Upload clear, well-lit images for best results</li>
                  <li>Review extracted values before generating prescriptions</li>
                  <li>Manual correction may be needed for handwritten reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Dashboard Summary Card Component
interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  quickStats: { label: string; value: string }[];
  features: string[];
  linkTo: string;
  linkText: string;
}

function DashboardCard({ title, icon, color, bgColor, borderColor, quickStats, features, linkTo, linkText }: DashboardCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 hover:border-border transition-all hover:shadow-md group">
      <div className="absolute top-0 left-0 right-0 h-1 opacity-60" style={{ background: color }} />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: bgColor }}>
            {icon}
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          {quickStats.map((stat, i) => (
            <div key={i} className="p-2 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground uppercase">{stat.label}</p>
              <p className="text-sm font-semibold" style={{ color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="space-y-1">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1 h-1 rounded-full" style={{ background: color }} />
              {feature}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link to={linkTo}>
          <Button
            variant="outline"
            className="w-full text-xs h-9 mt-2 group-hover:bg-primary/5 transition-colors"
            style={{ borderColor }}
          >
            {linkText}
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Quick Action Card Component
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

function QuickAction({ title, description, icon, to }: QuickActionProps) {
  return (
    <Link to={to}>
      <div className="p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/30 hover:border-border/60 transition-all cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();

  // Dashboard data
  const dashboardCards: DashboardCardProps[] = [
    {
      title: "Diabetes Management",
      icon: <Syringe className="h-5 w-5" style={{ color: categoryColors.diabetes.accent }} />,
      color: categoryColors.diabetes.accent,
      bgColor: categoryColors.diabetes.bg,
      borderColor: categoryColors.diabetes.border,
      quickStats: [
        { label: "Target HbA1c", value: "< 7.0%" },
        { label: "Fasting Glucose", value: "< 130 mg/dL" },
      ],
      features: [
        "Insulin dosing & titration",
        "Sliding scale reference",
        "Hypoglycemia risk calculator",
        "Renal dosing adjustments",
        "GLP-1 administration guide",
      ],
      linkTo: "/diabetes",
      linkText: "Go to Diabetes Tab",
    },
    {
      title: "Hypertension",
      icon: <Heart className="h-5 w-5" style={{ color: categoryColors.hypertension.accent }} />,
      color: categoryColors.hypertension.accent,
      bgColor: categoryColors.hypertension.bg,
      borderColor: categoryColors.hypertension.border,
      quickStats: [
        { label: "Target BP", value: "< 130/80" },
        { label: "Classification", value: "ESC 2024" },
      ],
      features: [
        "GFR calculator",
        "Secondary HTN checklist",
        "Drug interaction checker",
        "Treatment algorithm",
        "Potency tables",
      ],
      linkTo: "/hypertension",
      linkText: "Go to Hypertension Tab",
    },
    {
      title: "Lipid Management",
      icon: <Dna className="h-5 w-5" style={{ color: categoryColors.lipid.accent }} />,
      color: categoryColors.lipid.accent,
      bgColor: categoryColors.lipid.bg,
      borderColor: categoryColors.lipid.border,
      quickStats: [
        { label: "Very High Risk LDL", value: "< 55 mg/dL" },
        { label: "High Risk LDL", value: "< 70 mg/dL" },
      ],
      features: [
        "ASCVD risk calculator",
        "LAI 2023 Indian guidelines",
        "CAC/LDL target guide",
        "Lp(a) risk stratification",
        "Statin intensity guide",
      ],
      linkTo: "/lipids",
      linkText: "Go to Lipids Tab",
    },
    {
      title: "Obesity & Weight",
      icon: <Scale className="h-5 w-5" style={{ color: categoryColors.obesity.accent }} />,
      color: categoryColors.obesity.accent,
      bgColor: categoryColors.obesity.bg,
      borderColor: categoryColors.obesity.border,
      quickStats: [
        { label: "BMI Categories", value: "WHO + LAI" },
        { label: "Indian Cutoff", value: "BMI ≥ 23" },
      ],
      features: [
        "BMI calculator with units",
        "Waist-height ratio",
        "GLP-1 obesity algorithm",
        "Metabolic risk assessment",
        "Weight management tools",
      ],
      linkTo: "/obesity/bmi-calculator",
      linkText: "Open BMI Calculator",
    },
  ];

  // Quick Actions data
  const quickActions: QuickActionProps[] = [
    {
      title: "ASCVD Risk Calculator",
      description: "Calculate 10-year cardiovascular risk with LAI 2023 guidelines",
      icon: <Calculator className="h-4 w-4 text-primary" />,
      to: "/ascvd-risk",
    },
    {
      title: "Insulin Titration",
      description: "Calculate basal and prandial insulin doses",
      icon: <Syringe className="h-4 w-4 text-red-500" />,
      to: "/insulin-titration",
    },
    {
      title: "GFR Calculator",
      description: "Calculate eGFR using CKD-EPI and Cockcroft-Gault",
      icon: <Activity className="h-4 w-4 text-orange-500" />,
      to: "/gfr-calculator",
    },
    {
      title: "Drug Interactions",
      description: "Check for interactions between antihypertensives",
      icon: <FileSearch className="h-4 w-4 text-blue-500" />,
      to: "/drug-interactions",
    },
    {
      title: "BMI Calculator",
      description: "Calculate BMI with Indian population cutoffs",
      icon: <Scale className="h-4 w-4 text-violet-500" />,
      to: "/obesity/bmi-calculator",
    },
    {
      title: "Sliding Scale Insulin",
      description: "Quick reference for correction doses",
      icon: <Stethoscope className="h-4 w-4 text-red-500" />,
      to: "/sliding-scale",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header Section */}
      <header className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight">
              NCD Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Comprehensive non-communicable disease management tools — diabetes, hypertension, lipids, and obesity.
              Access detailed assessment tools, treatment algorithms, and clinical guidelines.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 px-4 py-3 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: categoryColors.diabetes.accent }} />
              <span>Diabetes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: categoryColors.hypertension.accent }} />
              <span>HTN</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: categoryColors.lipid.accent }} />
              <span>Lipids</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: categoryColors.obesity.accent }} />
              <span>Obesity</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
        {/* OCR Upload */}
        <OCRUpload onValuesExtracted={(values) => {
          // Store values in localStorage for use across the app
          if (values.fg) localStorage.setItem("ocr_fg", values.fg);
          if (values.a1c) localStorage.setItem("ocr_a1c", values.a1c);
          if (values.age) localStorage.setItem("ocr_age", values.age);
          if (values.creatinine) localStorage.setItem("ocr_creatinine", values.creatinine);
          if (values.ldl) localStorage.setItem("ocr_ldl", values.ldl);
          if (values.hdl) localStorage.setItem("ocr_hdl", values.hdl);
          if (values.tg) localStorage.setItem("ocr_tg", values.tg);
        }} />

        {/* Dashboard Cards Grid */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Condition Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {dashboardCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <QuickAction key={action.title} {...action} />
            ))}
          </div>
        </section>

        {/* Prescription Generator (Collapsed by default) */}
        <section>
          <Collapsible className="border border-border/40 rounded-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full px-6 py-4 flex items-center justify-between bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold">Comprehensive Prescription Generator</h2>
                    <p className="text-sm text-muted-foreground">Generate prescriptions for all four conditions at once</p>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 ui-open:rotate-180" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm mb-4">
                  This tool generates integrated prescriptions for diabetes, hypertension, lipids, and obesity
                  based on patient inputs. Navigate to individual tabs for detailed assessment tools.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/diabetes">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Syringe className="h-3.5 w-3.5 mr-1.5" />
                      Diabetes Tools
                    </Button>
                  </Link>
                  <Link to="/hypertension">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Heart className="h-3.5 w-3.5 mr-1.5" />
                      HTN Tools
                    </Button>
                  </Link>
                  <Link to="/lipids">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Dna className="h-3.5 w-3.5 mr-1.5" />
                      Lipid Tools
                    </Button>
                  </Link>
                  <Link to="/ascvd-risk">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Calculator className="h-3.5 w-3.5 mr-1.5" />
                      ASCVD Risk
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Guidelines Footer */}
        <section className="pt-4 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                ADA Guidelines 2024
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                ESC/ESH 2024
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                ACC/AHA + LAI 2023
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Evidence-based clinical decision support tools
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
