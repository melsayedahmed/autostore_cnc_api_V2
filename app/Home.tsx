"use client";

import {
  Search,
  Shield,
  Star,
  Phone,
  Mail,
  MapPin,
  Play,
  ArrowRight,
  Zap,
  Award,
  Clock,
  CheckCircle,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useTheme } from "@/app/layout"; // ✅ استيراد الثيم من الكونتكست
import React, { useState, useRef, useEffect } from "react";
import { search as searchApi } from "../lib/api";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [showDropdown]);
  const handleSearch = async (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await searchApi(value);
        const flatRes =
          Array.isArray(res) && Array.isArray(res[0]) ? res[0] : res;
        setResults(flatRes);
        setShowDropdown(true);
      } catch {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);
  };

  const getResultLink = (item: any): string => {
    return `/types/${encodeURIComponent(item.type)}/models/${encodeURIComponent(
      item.subtype
    )}/submodels/${encodeURIComponent(item.submodel)}/years/${item.id}/parts`;
  };
  const carBrands = [
    { name: "ACURA", logo: "/placeholder.svg?height=80&width=80" },
    { name: "AION", logo: "/placeholder.svg?height=80&width=80" },
    { name: "AITO", logo: "/placeholder.svg?height=80&width=80" },
    { name: "ALFA ROMEO", logo: "/placeholder.svg?height=80&width=80" },
    { name: "ARCFOX", logo: "/placeholder.svg?height=80&width=80" },
    { name: "ASTON MARTIN", logo: "/placeholder.svg?height=80&width=80" },
    { name: "AUDI", logo: "/placeholder.svg?height=80&width=80" },
    { name: "AVATR", logo: "/placeholder.svg?height=80&width=80" },
    { name: "BENTLEY", logo: "/placeholder.svg?height=80&width=80" },
    { name: "BMW", logo: "/placeholder.svg?height=80&width=80" },
    { name: "MERCEDES", logo: "/placeholder.svg?height=80&width=80" },
    { name: "TOYOTA", logo: "/placeholder.svg?height=80&width=80" },
  ];

  const features = [
    {
      icon: Shield,
      title: "AI-Powered Protection",
      description:
        "Advanced nano-ceramic coatings with self-healing technology",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Instant Application",
      description: "Revolutionary 120-minute installation process",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Lifetime Guarantee",
      description: "Industry-leading warranty with 24/7 monitoring",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Monitor your protection status via our mobile app",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "50K+", label: "Protected Vehicles", icon: Shield },
    { number: "99.9%", label: "Success Rate", icon: CheckCircle },
    { number: "24/7", label: "Support Available", icon: Clock },
    { number: "15+", label: "Years Experience", icon: Award },
  ];

  // Theme classes
  const themeClasses = {
    background: isDarkMode
      ? "bg-black text-white"
      : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-900",

    backgroundOverlay: isDarkMode
      ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
      : "bg-gradient-to-br from-white/80 via-blue-100/50 to-purple-100/50",

    cardBg: isDarkMode
      ? "bg-white/5 backdrop-blur-2xl border-white/10"
      : "bg-white/70 backdrop-blur-2xl border-white/40 shadow-xl",

    cardHover: isDarkMode
      ? "hover:bg-white/10"
      : "hover:bg-white/90 hover:shadow-2xl",

    text: isDarkMode ? "text-white" : "text-slate-900",

    textSecondary: isDarkMode ? "text-gray-300" : "text-slate-700",

    textMuted: isDarkMode ? "text-gray-400" : "text-slate-500",

    navBg: isDarkMode
      ? "bg-white/10 backdrop-blur-2xl border-white/20"
      : "bg-white/80 backdrop-blur-2xl border-white/60 shadow-lg",

    gradient: isDarkMode
      ? "from-white to-gray-300"
      : "from-slate-900 to-slate-700",

    gradientReverse: isDarkMode
      ? "from-blue-400 via-purple-400 to-pink-400"
      : "from-blue-600 via-purple-600 to-pink-600",
  };

  return (
    <div
      className={`min-h-screen overflow-hidden transition-all duration-700 ${themeClasses.background}`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 transition-all duration-700 ${themeClasses.backgroundOverlay}`}
        ></div>
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"
          }`}
        ></div>
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isDarkMode ? "opacity-30" : "opacity-20"
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at ${
              50 + scrollY * 0.01
            }% ${50 + scrollY * 0.005}%, ${
              isDarkMode
                ? "rgba(59, 130, 246, 0.1)"
                : "rgba(59, 130, 246, 0.15)"
            } 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          {/* Floating Badge */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              className={`bg-gradient-to-r ${
                isDarkMode
                  ? "from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300"
                  : "from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-600"
              } hover:${
                isDarkMode
                  ? "from-blue-500/30 hover:to-purple-500/30"
                  : "from-blue-500/20 hover:to-purple-500/20"
              } px-6 py-2 rounded-full backdrop-blur-sm transition-all duration-300`}
            >
              🚀 Revolutionary AI Protection Technology
            </Badge>
          </div>

          {/* Main Heading with Gradient Animation */}
          <div
            className={`mb-8 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span
                className={`bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent animate-pulse`}
              >
                PROTECT
              </span>
              <br />
              <span
                className={`bg-gradient-to-r ${themeClasses.gradientReverse} bg-clip-text text-transparent`}
              >
                THE FUTURE
              </span>
            </h1>
            <div className="relative">
              <p
                className={`text-xl md:text-2xl ${themeClasses.textSecondary} max-w-4xl mx-auto leading-relaxed`}
              >
                Experience next-generation vehicle protection with our{" "}
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${themeClasses.gradientReverse} font-semibold`}
                >
                  AI-powered nano-ceramic technology
                </span>{" "}
                that adapts and evolves with your car.
              </p>
            </div>
          </div>

          {/* Futuristic Search Bar */}
          <div
            className={`max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative group  z-50">
              {/* الخلفية المتوهجة */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* الكارد الأساسي */}
              <div
                className={`relative ${themeClasses.cardBg} rounded-2xl p-4 shadow-xl border border-white/10 backdrop-blur-lg transition-all duration-700`}
              >
                {/* كونتينر الإنبت */}
                <div ref={searchRef} className="relative w-full">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search Your Car..."
                    className={`w-full px-5 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-inner transition-all duration-300 placeholder:italic ${
                      isDarkMode
                        ? "bg-slate-800 text-white placeholder-gray-400"
                        : "bg-white text-black placeholder-gray-500"
                    }`}
                    onFocus={() => query && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />

                  {showDropdown &&
                    results.length > 0 &&
                    createPortal(
                      <div
                        className={`
        absolute
        max-h-72 overflow-y-auto
        rounded-xl border shadow-2xl transition-all duration-300
        ${
          isDarkMode
            ? "bg-slate-800 text-white border-gray-700"
            : "bg-white text-black border-gray-200"
        }
      `}
                        style={{
                          position: "absolute",
                          top: dropdownPos.top,
                          left: dropdownPos.left,
                          width: dropdownPos.width,
                          zIndex: 9999,
                        }}
                      >
                        {results.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="px-4 py-3 hover:bg-blue-600 hover:text-white text-sm cursor-pointer transition-colors duration-200"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setShowDropdown(false);
                              router.push(getResultLink(item));
                            }}
                          >
                            <span className="font-semibold mr-2">
                              {[
                                item.type,
                                item.subtype,
                                item.submodel,
                                item.year,
                              ]
                                .filter(Boolean)
                                .join(" - ")}
                            </span>
                            {item.name || `${item.type} ${item.subtype}`}
                          </div>
                        ))}
                      </div>,
                      document.body
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}

          {/* Floating Stats */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      isDarkMode
                        ? "from-blue-500/20 to-purple-500/20"
                        : "from-blue-500/10 to-purple-500/10"
                    } rounded-2xl blur group-hover:blur-md transition-all duration-300`}
                  ></div>
                  <Card
                    className={`relative ${themeClasses.cardBg} ${themeClasses.cardHover} rounded-2xl transition-all duration-300`}
                  >
                    <CardContent className="p-6 text-center">
                      <stat.icon
                        className={`h-8 w-8 mx-auto mb-3 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <div
                        className={`text-3xl font-bold bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.number}
                      </div>
                      <div className={`text-sm ${themeClasses.textMuted}`}>
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="services" className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-5xl font-bold mb-6 bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent`}
            >
              Revolutionary Features
            </h2>
            <p
              className={`text-xl ${themeClasses.textMuted} max-w-3xl mx-auto`}
            >
              Powered by artificial intelligence and quantum-grade materials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden ${themeClasses.cardBg} ${themeClasses.cardHover} rounded-3xl transition-all duration-500 hover:scale-105`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-${
                    isDarkMode ? "20" : "10"
                  } transition-opacity duration-500`}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${
                      feature.color.split(" ")[1]
                    }, ${feature.color.split(" ")[3]})`,
                  }}
                ></div>
                <CardContent className="relative p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-4 ${themeClasses.text} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${themeClasses.gradientReverse} transition-all duration-300`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`${themeClasses.textMuted} group-hover:${themeClasses.textSecondary} transition-colors duration-300`}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Car Brands - Floating Grid */}

      {/* CTA Section - Holographic Effect */}
      <section className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDarkMode
                  ? "from-blue-500/20 via-purple-500/20 to-pink-500/20"
                  : "from-blue-500/10 via-purple-500/10 to-pink-500/10"
              } rounded-3xl blur-xl`}
            ></div>
            <div
              className={`relative ${themeClasses.cardBg} rounded-3xl p-16 text-center transition-all duration-700`}
            >
              <div className="max-w-4xl mx-auto">
                <h2
                  className={`text-5xl font-bold mb-6 bg-gradient-to-r ${
                    isDarkMode
                      ? "from-white via-blue-200 to-purple-200"
                      : "from-slate-900 via-blue-700 to-purple-700"
                  } bg-clip-text text-transparent`}
                >
                  Ready for the Future?
                </h2>
                <p
                  className={`text-xl ${themeClasses.textSecondary} mb-10 leading-relaxed`}
                >
                  Join thousands of forward-thinking car owners who've already
                  upgraded to AI-powered protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 py-5 px-6 border-t ${
          isDarkMode ? "border-white/10" : "border-slate-200"
        } transition-all duration-700`}
      >
        <div className="container mx-auto">
          <div
            className={` ${
              isDarkMode ? "border-white/10" : "border-slate-200"
            } text-center transition-all duration-700`}
          >
            <p className={themeClasses.textMuted}>
              &copy; 2025 AutoStore. All rights reserved. | Powered by
              AutoStore
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
