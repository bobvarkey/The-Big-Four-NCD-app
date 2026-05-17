import React from "react";
import { Link } from "react-router-dom";
import { Dna, ChevronRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const lipidCalculators = [
  {
    path: "/lipid-panel",
    title: "Lipid Panel Calculator",
    description: "Full lipid panel with LAI 2023 Indian guidelines",
    icon: Activity,
  },
  {
    path: "/ascvd-risk",
    title: "ASCVD Risk Calculator",
    description: "10-year cardiovascular risk assessment",
    icon: Activity,
  },
];

export default function Lipids() {
  return (
    <div className="min-h-screen bg-background">
      {/* Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Dna className="h-5 w-5 text-blue-500" />
          </div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight">
            Lipids
          </h1>
        </div>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          Lipid disorder management with ACC/AHA and LAI 2023 guidelines,
          including ASCVD risk calculation and treatment targets.
        </p>
      </section>

      {/* Calculators Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Calculators & Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lipidCalculators.map((calc) => (
            <Link key={calc.path} to={calc.path}>
              <Card className="h-full border-border/60 hover:border-blue-500/30 hover:shadow-sm transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <calc.icon className="h-4 w-4 text-blue-500" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base mb-1">{calc.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {calc.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Guidelines Reference */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Quick Prescription</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a lipid prescription from the home dashboard
                </p>
              </div>
              <Link to="/">
                <Button className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border border-blue-500/30">
                  Go to Home
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
