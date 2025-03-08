"use client";

// ========== Module: Imports ==========
import Head from "next/head";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  // ---------- Module: Router Hook ----------
  const router = useRouter();

  // ---------- Module: Local State ----------
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [buttonMessage, setButtonMessage] = useState<string>("Join the Waitlist");

  // ---------- Module: Refs ----------
  const headerRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const featureTitleRef = useRef<HTMLHeadingElement>(null);
  const plansTitleRef = useRef<HTMLHeadingElement>(null);

  // ---------- Module: inView Detection ----------
  const isInViewDiscover = useInView(discoverRef, { once: false });
  const isInViewFeature = useInView(featureRef, { once: false });
  const isInViewPlans = useInView(plansRef, { once: false });

  // ---------- Module: Scroll Handling ----------
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      if (Math.abs(currentScrollPos - prevScrollPos) > 50) {
        setIsHeaderVisible(!isScrollingDown);
      }
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // ---------- Module: Waitlist Handler ----------
  const handleJoinWaitlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (email) {
      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.message) {
          setButtonMessage("Thank You!");
          setTimeout(() => setButtonMessage("Join the Waitlist"), 2000);
          setEmail("");
        } else if (data.error) {
          alert(data.error);
        }
      } catch (error) {
        console.error("Error in handleJoinWaitlist:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please enter an email address.");
    }
  };

  // ---------- Module: Navigation Handlers ----------
  const scrollToFeatures = () => {
    if (featureTitleRef.current && headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const titlePos = featureTitleRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: titlePos - 2 * headerHeight, behavior: "smooth" });
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const scrollToPlans = () => {
    if (plansTitleRef.current && headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const titlePos = plansTitleRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: titlePos - 2 * headerHeight, behavior: "smooth" });
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  // ---------- Module: Render JSX (Page Layout) ----------
  return (
    <div className="min-h-screen relative overflow-hidden text-white" style={{ "--accent": "#ff6200", "--primary": "#1f2937" } as React.CSSProperties}>
      <Head>
        <title>ZeroCAD</title>
        <meta name="description" content="AI-assisted, text-based CAD design in the cloud" />
      </Head>

      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(17,24,39,0.3)_30%,transparent_60%)] bg-[length:150%_150%] animate-ripple opacity-50" />
      </div>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md z-20 py-4 px-4 flex justify-between items-center border-b border-white/10 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="ml-3">
          <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-all">
            ZeroCAD
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-all hover:glow-sm" onClick={scrollToFeatures}>
              Features
            </a>
            <a href="#plans" className="text-gray-300 hover:text-white transition-all hover:glow-sm" onClick={scrollToPlans}>
              Plans
            </a>
            <button className="text-gray-300 hover:text-white transition-all" onClick={() => console.log("Sign In clicked")}>
              Sign In
            </button>
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white transition-all hover:glow-sm focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {isMobileMenuOpen && (
            <motion.div
              className="absolute top-full left-0 w-full bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-md border-b border-white/20 md:hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <a href="#features" className="block px-4 py-2 text-right text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all" onClick={() => { scrollToFeatures(); setIsMobileMenuOpen(false); }}>
                Features
              </a>
              <a href="#plans" className="block px-4 py-2 text-right text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all" onClick={() => { scrollToPlans(); setIsMobileMenuOpen(false); }}>
                Plans
              </a>
              <button
                className="block w-full px-4 py-2 text-right text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all"
                onClick={() => { console.log("Sign In clicked"); setIsMobileMenuOpen(false); }}
              >
                Sign In
              </button>
            </motion.div>
          )}
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-start min-h-screen px-6 sm:px-12">
        <section className="flex flex-col items-center justify-center min-h-screen text-center mt-20">
          <div className="h-24 sm:h-32 mb-12"></div>
          <motion.div className="w-full max-w-5xl mx-auto mb-4" whileHover={{ scale: 1.05, translateZ: 20 }} transition={{ type: "spring", stiffness: 200 }}>
            <motion.h1
              className="text-4xl sm:text-6xl font-extrabold mb-8 text-transparent tracking-wider uppercase italic"
              style={{ WebkitTextStroke: "1px white", textShadow: "0 0 4px rgba(0, 0, 0, 0.3)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, duration: 1 }}
            >
              Design the Future: Evolve with Zero
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
              style={{ clipPath: "inset(0 100% 0 0)" }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 2.5, ease: "linear" }}
            >
              Empowering designers and creators with AI-accelerated CAD, blending legacy tools with cloud based innovation.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }}>
              <input
                type="email"
                placeholder="email"
                className="p-3 rounded bg-black/60 text-gray-300 border border-white/20 focus:outline-none focus:border-white/40 w-full sm:w-80"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="bg-[var(--accent)] text-white font-semibold py-3 px-6 rounded hover:bg-[var(--accent-hover)] active:bg-[var(--accent-darker)] transition-all hover:scale-105"
                style={{ backgroundColor: "var(--accent)" }}
                onClick={handleJoinWaitlist}
              >
                {buttonMessage}
              </button>
            </motion.div>
            <div style={{ height: "350px" }}></div>
          </motion.div>
        </section>

        <motion.div className="w-full max-w-4xl mx-auto mb-16 border-2 border-white/20 bg-gradient-to-br from-black/80 to-gray-900/80 rounded-lg overflow-hidden p-4" style={{ height: "450px", aspectRatio: "16/9" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center h-full">
            <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-white" style={{ WebkitTextStroke: "1px transparent", textShadow: "0 0 4px rgba(255, 98, 0, 0.3)" }}>
              [ Demo Coming Soon ]
            </h2>
          </div>
        </motion.div>

        <motion.section ref={discoverRef} className="mb-32 max-w-6xl mx-auto mt-16" initial={{ opacity: 1, scale: 1, translateZ: 0 }} animate={{ scale: isInViewDiscover ? 1.05 : 1, translateZ: isInViewDiscover ? 20 : 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <h2 className="text-3xl font-semibold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-white text-center" style={{ WebkitTextStroke: "1px transparent", textShadow: "0 0 2px rgba(255, 98, 0, 0.2)" }}>
            Discover ZeroCAD
          </h2>
          <motion.div className="p-8 rounded-xl bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all" whileHover={{ translateZ: 15, boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {[
                { title: "Why Choose ZeroCAD?", text: <ul className="list-disc list-inside text-gray-400 space-y-4"><li><span className="font-bold">Automated Workflow Reinvention:</span> Reimagine your design process with AI-driven automated assembly management.</li><li><span className="font-bold">Accelerated Product Development:</span> Enhance efficiency with intelligent integrations.</li><li><span className="font-bold">Multi-Platform Editing:</span> Securely access and edit your designs from any device via robust cloud infrastructure.</li><li><span className="font-bold">Enhanced Annotation Tools:</span> Easily attach notes or reminders to bodies and surfaces for quick reference and collaboration.</li></ul> },
                { title: "What's Different?", text: <ul className="list-disc list-inside text-gray-400 space-y-4"><li><span className="font-bold">Advanced Selective Editing:</span> Beyond initial model generation, ZeroCAD's integrated AI allows for precise and rapid edits on individual bodies and surfaces.</li><li><span className="font-bold">Real-Time Collaboration:</span> Optimize your designs collaboratively in real-time through secure cloud-based interactions.</li><li><span className="font-bold">Fusion of Precision and Innovation:</span> Combines traditional CAD precision with next generation AI capabilities.</li></ul> },
                { title: "Key Features", text: <ul className="list-disc list-inside text-gray-400 space-y-4"><li><span className="font-bold">AI-Accelerated Modeling:</span> Generate complex models swiftly using intuitive text-to-model commands.</li><li><span className="font-bold">Automated selective editing:</span> Select a body or surface and use text prompts to quickly implement complex changes.</li><li><span className="font-bold">Manual modeling:</span> Integrated direct and parametric modeling features enable granular editing for extreme precision and seamless user control.</li><li><span className="font-bold">Assembly Management:</span> Effortlessly handle complex assemblies with automated component categories and smart labeling.</li></ul> },
              ].map((item) => (
                <div key={item.title} className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-white" style={{ WebkitTextStroke: "1px transparent", textShadow: "0 0 2px rgba(255, 98, 0, 0.2)" }}>{item.title}</h3>
                  {item.text}
                </div>
              ))}
            </div>
            <div className="mt-2 h-[40px]"></div>
          </motion.div>
        </motion.section>

        <motion.section ref={featureRef} className="mb-32 max-w-6xl mx-auto" initial={{ opacity: 1, scale: 1, translateZ: 0 }} animate={{ scale: isInViewFeature ? 1.05 : 1, translateZ: isInViewFeature ? 20 : 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <h2 ref={featureTitleRef} className="text-3xl font-semibold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-white text-center" style={{ WebkitTextStroke: "1px transparent", textShadow: "0 0 2px rgba(255, 98, 0, 0.2)" }}>
            Experience the Future
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "AI-Accelerated Modeling", text: "Effortlessly create designs using simple yet powerful text-to-CAD commands." },
              { title: "Automated Assembly Management", text: "Automatically generate labels and organize your models into hierarchical groups." },
              { title: "Cloud-Based Accessibility", text: "Edit and manage your projects anywhere, anytime, across multiple devices with instant cloud access." },
              { title: "Accelerated Development", text: "Rapidly integrate standard components with direct access to resources like the McMaster-Carr hardware library." },
            ].map((feature, index) => (
              <motion.div key={feature.title} className="p-6 rounded-xl bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all" whileHover={{ translateZ: 15, boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)" }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-white" style={{ WebkitTextStroke: "1px transparent", textShadow: "0 0 2px rgba(255, 98, 0, 0.2)" }}>{feature.title}</h3>
                <p className="text-gray-400 mt-2">{feature.text}</p>
                <div className="mt-2 h-[50px]"></div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section ref={plansRef} className="mb-32 max-w-6xl mx-auto" initial={{ opacity: 1, scale: 1, translateZ: 0 }} animate={{ scale: isInViewPlans ? 1.05 : 1, translateZ: isInViewPlans ? 20 : 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <h2 ref={plansTitleRef} className="text-3xl font-semibold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-white text-center" style={{ WebkitTextStroke: "1px transparent", textShadow: "0 0 2px rgba(255, 98, 0, 0.2)" }}>
            Plans and Pricing
          </h2>
          <motion.div className="p-8 rounded-xl bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all" whileHover={{ translateZ: 15, boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {[
                { title: "Creator", text: <ul className="list-disc list-inside text-gray-400"><li>$12/month</li><li>Full text-to-CAD model generation capability</li><li>Direct model editing</li><li>1GB cloud storage</li></ul> },
                { title: "Developer", text: <ul className="list-disc list-inside text-gray-400"><li>$25/month</li><li>Includes Creator features, plus:</li><li>Advanced AI tools with higher limits on model generation</li><li>Assistive labeling and automated assembly management</li><li>Increased cloud storage to 10GB</li></ul> },
                { title: "Pro", text: <ul className="list-disc list-inside text-gray-400"><li>$40/month</li><li>Includes Developer features, plus:</li><li>Full AI capabilities, including unlimited model generation and accelerated selective editing</li><li>Unlimited cloud storage</li><li>Multi-user support with simultaneous live editing sessions</li></ul> },
              ].map((item) => (
                <div key={item.title} className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-white" style={{ WebkitTextStroke: "1px transparent", textShadow: "0 0 2px rgba(255, 98, 0, 0.2)" }}>{item.title}</h3>
                  {item.text}
                </div>
              ))}
            </div>
            <div className="mt-2 h-[40px]"></div>
          </motion.div>
        </motion.section>

        <section className="w-full min-h-[200px] bg-gradient-to-r from-gray-800 to-black relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1)_0%,rgba(0,0,0,0.5)_70%)] animate-pulse opacity-50" initial={{ opacity: 1 }} animate={{ opacity: 0.7 }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }} />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">We believe that the future will be built by humans working collaboratively with AI. Our goal is to empower engineers, designers, and creators at all levels to build the future that they imagine!</p>
          </div>
        </section>

        <footer className="w-full bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-md p-12 text-center border-t border-white/40">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <a href="https://twitter.com/zerocadai" className="text-gray-300 hover:text-white transition-all" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://discord.gg/zerocad" className="text-gray-300 hover:text-white transition-all" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://github.com/zerocad" className="text-gray-300 hover:text-white transition-all" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-all">Contact</a>
          </div>
          <p className="text-sm text-gray-500 mb-2">© 2025 ZeroCAD. Redefining design from the ground up.</p>
          <p className="text-sm text-gray-500 mb-2">About ZeroCAD: We’re a team of innovators building a CAD platform that bridges tradition and technology for creators worldwide.</p>
          <p className="text-sm text-gray-500">Stay connected: Follow our journey on social media for the latest updates.</p>
        </footer>
      </main>

      <style jsx>{`
        :root {
          --accent: #ff6200;
          --accent-hover: #e65c00;
          --accent-darker: #cc5200;
          --primary: #1f2937;
        }
        .hover\\:glow-sm:hover { text-shadow: 0 0 6px rgba(255, 255, 255, 0.2); }
        @keyframes ripple { 0% { background-position: 50% 50%; transform: scale(1); } 50% { background-position: 70% 70%; transform: scale(1.1); } 100% { background-position: 50% 50%; transform: scale(1); } }
        .animate-ripple { animation: ripple 20s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.7; } }
        .animate-pulse { animation: pulse 3s ease-in-out infinite; }
        @media (max-width: 768px), (prefers-reduced-motion: reduce) { .animate-ripple, .animate-pulse { animation: none; } }
        .space-y-4 li { margin-bottom: 1rem; }
      `}</style>
    </div>
  );
}