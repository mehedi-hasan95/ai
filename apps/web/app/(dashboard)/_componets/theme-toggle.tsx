"use client";

import { Check } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light" as const, label: "Light" },
    { value: "dark" as const, label: "Dark" },
    { value: "system" as const, label: "System" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold text-muted-foreground mb-6 tracking-tight">
        APPEARANCE
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="group relative flex flex-col items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl cursor-pointer"
          >
            <div
              className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-[3px] transition-colors ${
                theme === themeOption.value
                  ? "border-foreground"
                  : "border-border"
              }`}
            >
              {themeOption.value === "light" && (
                <div className="w-full h-full bg-[#f5f5f5] flex items-center justify-center">
                  <div className="bg-white rounded-xl shadow-sm w-[70%] h-[60%] flex items-center justify-center">
                    <span className="text-4xl font-bold text-black">Aa</span>
                    {theme === "light" && (
                      <div className="absolute bottom-2 right-2 bg-black rounded-full w-8 h-8 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {themeOption.value === "dark" && (
                <div className="w-full h-full bg-[#4a4a4a] flex items-center justify-center">
                  <div className="bg-[#1a1a1a] rounded-xl shadow-sm w-[70%] h-[60%] flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">Aa</span>
                    {theme === "dark" && (
                      <div className="absolute bottom-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                        <Check className="w-5 h-5 text-black" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {themeOption.value === "system" && (
                <div className="w-full h-full bg-[#4a4a4a] flex items-center justify-center">
                  <div className="flex w-[70%] h-[60%] rounded-xl overflow-hidden shadow-sm">
                    <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">Aa</span>
                    </div>
                    <div className="flex-1 bg-white flex items-center justify-center relative">
                      <span className="text-3xl font-bold text-black">Aa</span>
                      {theme === "system" && (
                        <div className="absolute bottom-2 right-2 bg-black rounded-full w-8 h-8 flex items-center justify-center">
                          <Check
                            className="w-5 h-5 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className="text-lg font-medium">{themeOption.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
