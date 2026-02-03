"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ExternalLink, ShieldCheck, Zap } from "lucide-react";

function RedirectContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const targetUrl = searchParams.get("to");
    const [progress, setProgress] = useState(0);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!targetUrl) {
            router.push("/");
            return;
        }

        const duration = 2500; // 2.5 seconds
        const interval = 25;
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setIsRedirecting(true);
                    setTimeout(() => {
                        try {
                            window.location.href = decodeURIComponent(targetUrl);
                        } catch (e) {
                            window.location.href = targetUrl;
                        }
                    }, 500);
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [targetUrl, router]);

    return (
        <main className="z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
            <AnimatePresence mode="wait">
                {!isRedirecting ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-8 w-full"
                    >
                        {/* Logo/Icon Container */}
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px]"
                            >
                                <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
                                    <Zap className="w-10 h-10 text-white fill-white/10" />
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl -z-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Mempersiapkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Tujuan...</span>
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                Mohon tunggu sebentar, kami sedang mengamankan koneksi Anda.
                            </p>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="space-y-3 w-full max-w-xs mx-auto">
                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                <span>Verifying Secure QR</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Secure Link</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span>Fast Redirect</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="redirecting"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-emerald-500"
                            >
                                <ExternalLink className="w-8 h-8" />
                            </motion.div>
                        </div>
                        <h2 className="text-xl font-medium text-white">Dialihkan Sekarang</h2>
                        <p className="text-zinc-500 text-sm italic break-all max-w-[300px]">
                            {decodeURIComponent(targetUrl || "")}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function RedirectPage() {
    return (
        <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Artistic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px]"
                />
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-zinc-500 text-sm">Initializing secure redirect...</p>
                </div>
            }>
                <RedirectContent />
            </Suspense>

            {/* Footer */}
            <footer className="absolute bottom-8 w-full text-center">
                <p className="text-zinc-600 text-[10px] tracking-[0.2em] uppercase font-medium">
                    Powered by Artistic QR System
                </p>
            </footer>
        </div>
    );
}
