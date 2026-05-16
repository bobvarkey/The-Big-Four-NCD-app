// ============================================================
// OBESITY GUIDELINES - BMI and WHtR Thresholds
// Ethnicity-specific guidelines for South East Asians and Indians
// ============================================================

export type EthnicityType = "standard" | "asian-pacific" | "indian";
export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";
export type RiskLevel = "underweight" | "healthy" | "increased" | "high";

export interface BmiThreshold {
  max: number;
  category: BmiCategory;
  label: string;
  color: string;
}

export interface EthnicityGuideline {
  id: EthnicityType;
  name: string;
  description: string;
  thresholds: BmiThreshold[];
}

export const ETHNICITY_GUIDELINES: EthnicityGuideline[] = [
  {
    id: "standard",
    name: "Standard WHO",
    description: "For Europid, African, and other non-Asian populations",
    thresholds: [
      { max: 18.5, category: "underweight", label: "Underweight", color: "text-yellow-500" },
      { max: 25, category: "normal", label: "Normal", color: "text-emerald-500" },
      { max: 30, category: "overweight", label: "Overweight", color: "text-amber-500" },
      { max: 35, category: "obese", label: "Obese Class I", color: "text-orange-500" },
      { max: 40, category: "obese", label: "Obese Class II", color: "text-red-500" },
      { max: Infinity, category: "obese", label: "Obese Class III", color: "text-red-700" },
    ],
  },
  {
    id: "asian-pacific",
    name: "WHO Asian-Pacific",
    description: "For East Asian, Southeast Asian, and Pacific populations",
    thresholds: [
      { max: 18.5, category: "underweight", label: "Underweight", color: "text-yellow-500" },
      { max: 23, category: "normal", label: "Normal", color: "text-emerald-500" },
      { max: 25, category: "overweight", label: "Overweight/At Risk", color: "text-amber-500" },
      { max: 27.5, category: "obese", label: "Obese Class I", color: "text-orange-500" },
      { max: Infinity, category: "obese", label: "Obese Class II+", color: "text-red-500" },
    ],
  },
  {
    id: "indian",
    name: "Indian-Specific (ICMR)",
    description: "For South Asian/Indian populations with higher metabolic risk",
    thresholds: [
      { max: 18.5, category: "underweight", label: "Underweight", color: "text-yellow-500" },
      { max: 22.9, category: "normal", label: "Normal", color: "text-emerald-500" },
      { max: 24.9, category: "overweight", label: "Overweight", color: "text-amber-500" },
      { max: 29.9, category: "obese", label: "Obese", color: "text-orange-500" },
      { max: Infinity, category: "obese", label: "Severely Obese", color: "text-red-500" },
    ],
  },
];

export interface WhtrCategory {
  max: number;
  riskLevel: RiskLevel;
  label: string;
  color: string;
  action: string;
}

export const WHTR_CATEGORIES: WhtrCategory[] = [
  { max: 0.4, riskLevel: "underweight", label: "Underweight", color: "text-yellow-500", action: "Nutritional assessment recommended" },
  { max: 0.5, riskLevel: "healthy", label: "Healthy", color: "text-emerald-500", action: "Maintain current lifestyle" },
  { max: 0.6, riskLevel: "increased", label: "Increased Risk", color: "text-amber-500", action: "Lifestyle modification recommended" },
  { max: Infinity, riskLevel: "high", label: "High Risk", color: "text-red-500", action: "Intensive intervention required" },
];

export interface WaistThreshold {
  gender: "male" | "female";
  ethnicity: "standard" | "asian";
  threshold: number;
  label: string;
}

export const WAIST_THRESHOLDS: WaistThreshold[] = [
  { gender: "male", ethnicity: "standard", threshold: 94, label: "Central obesity" },
  { gender: "female", ethnicity: "standard", threshold: 80, label: "Central obesity" },
  { gender: "male", ethnicity: "asian", threshold: 90, label: "Central obesity" },
  { gender: "female", ethnicity: "asian", threshold: 80, label: "Central obesity" },
];

export interface TreatmentGuideline {
  bmiMin: number;
  bmiMax: number;
  ethnicity?: EthnicityType;
  recommendations: string[];
  medications?: string[];
  surgeryConsideration?: boolean;
}

export const TREATMENT_GUIDELINES: TreatmentGuideline[] = [
  {
    bmiMin: 0,
    bmiMax: 18.5,
    recommendations: [
      "Nutritional assessment for underweight",
      "Rule out underlying conditions (malabsorption, eating disorders, hyperthyroidism)",
      "Refer to dietitian for healthy weight gain plan",
    ],
  },
  {
    bmiMin: 18.5,
    bmiMax: 24.9,
    recommendations: [
      "Maintain healthy lifestyle",
      "Regular physical activity (150-300 min/week)",
      "Balanced diet (Mediterranean/DASH patterns)",
      "Annual weight monitoring",
    ],
  },
  {
    bmiMin: 25,
    bmiMax: 29.9,
    ethnicity: "standard",
    recommendations: [
      "Weight loss goal: 5-10% over 3-6 months",
      "Caloric deficit: 500-750 kcal/day",
      "Physical activity: 150-300 min/week moderate intensity",
      "Behavioral interventions: self-monitoring, goal setting",
      "Screen for comorbidities (HTN, T2DM, dyslipidemia)",
    ],
  },
  {
    bmiMin: 23,
    bmiMax: 24.9,
    ethnicity: "asian-pacific",
    recommendations: [
      "Weight loss goal: 5-10% over 3-6 months (earlier intervention for Asian populations)",
      "Caloric deficit: 500-750 kcal/day",
      "Physical activity: 150-300 min/week",
      "Emphasize waist circumference assessment (higher visceral fat risk)",
      "Screen for metabolic syndrome components",
    ],
  },
  {
    bmiMin: 23,
    bmiMax: 24.9,
    ethnicity: "indian",
    recommendations: [
      "Weight loss goal: 5-10% over 3-6 months",
      "Higher metabolic risk at lower BMI - prioritize diabetes screening",
      "Emphasize carbohydrate quality (low glycemic index foods)",
      "Monitor for glucose intolerance even with 'normal' BMI",
      "Physical activity: 150-300 min/week + resistance training",
    ],
  },
  {
    bmiMin: 30,
    bmiMax: 34.9,
    ethnicity: "standard",
    recommendations: [
      "Weight loss goal: 10% over 6 months",
      "Intensive lifestyle intervention",
      "Consider pharmacotherapy if lifestyle alone insufficient",
      "Screen and treat all obesity-related comorbidities",
    ],
    medications: ["Orlistat", "Liraglutide 3.0mg (if available)", "Naltrexone-bupropion (if available)"],
  },
  {
    bmiMin: 25,
    bmiMax: 27.4,
    ethnicity: "asian-pacific",
    recommendations: [
      "Weight loss goal: 10% over 6 months",
      "Consider pharmacotherapy at BMI ≥25 with metabolic syndrome",
      "Intensive lifestyle intervention",
      "Monitor HbA1c, lipids, blood pressure",
    ],
    medications: ["Orlistat", "Liraglutide 3.0mg (if available)"],
  },
  {
    bmiMin: 25,
    bmiMax: 29.9,
    ethnicity: "indian",
    recommendations: [
      "Weight loss goal: 10% over 6 months",
      "Strong consideration for pharmacotherapy at BMI ≥25",
      "Intensive lifestyle intervention with cultural dietary adaptations",
      "Aggressive management of metabolic comorbidities",
      "Consider bariatric surgery if BMI ≥30 with uncontrolled T2DM",
    ],
    medications: ["Orlistat (widely available)", "Liraglutide 3.0mg", "Metformin if prediabetic"],
  },
  {
    bmiMin: 35,
    bmiMax: 39.9,
    ethnicity: "standard",
    recommendations: [
      "Weight loss goal: 15% over 6-12 months",
      "Pharmacotherapy recommended",
      "Consider bariatric surgery if comorbidities present",
      "Multidisciplinary team approach",
    ],
    medications: ["Orlistat", "Liraglutide 3.0mg", "Phentermine-topiramate (where approved)"],
    surgeryConsideration: true,
  },
  {
    bmiMin: 27.5,
    bmiMax: 32.4,
    ethnicity: "asian-pacific",
    recommendations: [
      "Weight loss goal: 15% over 6-12 months",
      "Pharmacotherapy recommended",
      "Consider bariatric surgery if BMI ≥32.5 with T2DM or metabolic syndrome",
      "Multidisciplinary team approach",
    ],
    medications: ["Orlistat", "Liraglutide 3.0mg", "Naltrexone-bupropion (if available)"],
    surgeryConsideration: true,
  },
  {
    bmiMin: 30,
    bmiMax: 32.4,
    ethnicity: "indian",
    recommendations: [
      "Weight loss goal: 15% over 6-12 months",
      "Pharmacotherapy strongly recommended",
      "Consider bariatric surgery if BMI ≥30 with poorly controlled T2DM",
      "Multidisciplinary team approach with endocrinologist referral",
    ],
    medications: ["Orlistat", "Liraglutide 3.0mg", "Consider GLP-1 agonists"],
    surgeryConsideration: true,
  },
  {
    bmiMin: 40,
    bmiMax: Infinity,
    ethnicity: "standard",
    recommendations: [
      "Weight loss goal: 20% over 12 months",
      "Bariatric surgery referral indicated",
      "Pre-surgical evaluation required",
      "Long-term follow-up essential",
    ],
    surgeryConsideration: true,
  },
  {
    bmiMin: 32.5,
    bmiMax: Infinity,
    ethnicity: "asian-pacific",
    recommendations: [
      "Weight loss goal: 20% over 12 months",
      "Bariatric surgery referral indicated at BMI ≥32.5",
      "Pre-surgical evaluation required",
      "Long-term follow-up essential",
    ],
    surgeryConsideration: true,
  },
  {
    bmiMin: 32.5,
    bmiMax: Infinity,
    ethnicity: "indian",
    recommendations: [
      "Weight loss goal: 20% over 12 months",
      "Bariatric surgery referral indicated at BMI ≥32.5 (or ≥30 with uncontrolled T2DM)",
      "Pre-surgical evaluation required",
      "Long-term follow-up essential",
    ],
    surgeryConsideration: true,
  },
];

// Helper functions
export function getBmiCategory(bmi: number, ethnicity: EthnicityType): BmiThreshold {
  const guideline = ETHNICITY_GUIDELINES.find((g) => g.id === ethnicity);
  if (!guideline) throw new Error(`Unknown ethnicity: ${ethnicity}`);

  for (const threshold of guideline.thresholds) {
    if (bmi < threshold.max) return threshold;
  }
  return guideline.thresholds[guideline.thresholds.length - 1];
}

export function getWhtrCategory(whtr: number): WhtrCategory {
  for (const category of WHTR_CATEGORIES) {
    if (whtr < category.max) return category;
  }
  return WHTR_CATEGORIES[WHTR_CATEGORIES.length - 1];
}

export function getWaistThreshold(gender: "male" | "female", ethnicity: "standard" | "asian"): number {
  const threshold = WAIST_THRESHOLDS.find(
    (t) => t.gender === gender && t.ethnicity === ethnicity
  );
  return threshold?.threshold || (gender === "male" ? 94 : 80);
}

export function getTreatmentGuidelines(
  bmi: number,
  ethnicity: EthnicityType
): TreatmentGuideline | undefined {
  // First try to find exact ethnicity match
  let guideline = TREATMENT_GUIDELINES.find(
    (g) =>
      bmi >= g.bmiMin &&
      bmi < g.bmiMax &&
      g.ethnicity === ethnicity
  );

  // Fallback to standard if no ethnicity-specific guideline found
  if (!guideline && ethnicity !== "standard") {
    guideline = TREATMENT_GUIDELINES.find(
      (g) => bmi >= g.bmiMin && bmi < g.bmiMax && g.ethnicity === "standard"
    );
  }

  // Final fallback - any matching BMI range
  if (!guideline) {
    guideline = TREATMENT_GUIDELINES.find(
      (g) => bmi >= g.bmiMin && bmi < g.bmiMax && !g.ethnicity
    );
  }

  return guideline;
}
