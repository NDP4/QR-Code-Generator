"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, {
    Options,
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
} from "qr-code-styling";
import { getContrastRatio } from "@/lib/utils";

type Extension = "png" | "jpeg" | "webp" | "svg";
import { Download, Upload, RefreshCw, Smartphone, AlertTriangle, Wifi, User, Link as LinkIcon, Mail, Palette, Type, Eye, ShieldCheck, Settings2, Trash2, RotateCcw, Zap, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function QRCodeGenerator() {
    // State for Content Types
    const [contentType, setContentType] = useState("url");
    const [url, setUrl] = useState("https://example.com");
    const [wifiSsid, setWifiSsid] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifiEncryption, setWifiEncryption] = useState("WPA");
    const [wifiHidden, setWifiHidden] = useState(false);
    const [vCardFirstName, setVCardFirstName] = useState("");
    const [vCardLastName, setVCardLastName] = useState("");
    const [vCardPhone, setVCardPhone] = useState("");
    const [vCardEmail, setVCardEmail] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");

    // Advanced Customization State
    const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>("Q");
    const [dotType, setDotType] = useState<DotType>("rounded");
    const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>("extra-rounded");
    const [cornerDotType, setCornerDotType] = useState<CornerDotType>("dot");

    // Style State
    const [fileExt, setFileExt] = useState<Extension>("png");
    const [dotColor, setDotColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [isTransparent, setIsTransparent] = useState(false);
    const [image, setImage] = useState<string | undefined>(undefined);

    // Text / Frame State (Visual Only for now)
    const [bottomText, setBottomText] = useState("");
    const [bottomTextFont, setBottomTextFont] = useState("sans-serif");
    const [bottomTextSize, setBottomTextSize] = useState(16);
    const [bottomTextColor, setBottomTextColor] = useState("#000000");

    // Add Preload State
    const [isPreloadEnabled, setIsPreloadEnabled] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!qrData) return;
        navigator.clipboard.writeText(qrData);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Core
    const ref = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
    const [qrData, setQrData] = useState("");

    // Calculate Data based on Type
    useEffect(() => {
        let data = "";
        switch (contentType) {
            case "url":
                let processedUrl = url.trim();
                // Strip redundant protocols if any, then prepend single https://
                processedUrl = processedUrl.replace(/^(https?:\/\/)+/i, "");
                if (processedUrl) {
                    processedUrl = `https://${processedUrl}`;
                }

                if (isPreloadEnabled && processedUrl) {
                    const origin = typeof window !== "undefined" ? window.location.origin : "";
                    // Support for local dev IP instead of localhost for easier scanning
                    data = `${origin}/go?to=${encodeURIComponent(processedUrl)}`;
                } else {
                    data = processedUrl;
                }
                break;
            case "wifi":
                data = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden};;`;
                break;
            case "vcard":
                data = `BEGIN:VCARD\nVERSION:3.0\nN:${vCardLastName};${vCardFirstName}\nFN:${vCardFirstName} ${vCardLastName}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nEND:VCARD`;
                break;
            case "email":
                data = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                break;
            default:
                data = url;
        }
        setQrData(data);
    }, [contentType, url, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, vCardFirstName, vCardLastName, vCardPhone, vCardEmail, emailAddress, emailSubject, emailBody, isPreloadEnabled]);

    // Calculate contrast ratio
    const contrastRatio = getContrastRatio(dotColor, isTransparent ? "#ffffff" : bgColor);
    const isContrastLow = contrastRatio < 4.5;

    useEffect(() => {
        const qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            image: image,
            dotsOptions: { color: dotColor, type: dotType },
            cornersSquareOptions: { type: cornerSquareType, color: dotColor },
            cornersDotOptions: { type: cornerDotType, color: dotColor },
            backgroundOptions: { color: isTransparent ? "transparent" : bgColor },
            imageOptions: { crossOrigin: "anonymous", margin: 10 },
            qrOptions: { errorCorrectionLevel: errorCorrectionLevel },
        });
        setQrCode(qrCode);
    }, []);

    useEffect(() => {
        if (qrCode) {
            // Auto-optimize correction level if preload is enabled
            const finalCorrectionLevel = isPreloadEnabled ? "H" : errorCorrectionLevel;

            qrCode.update({
                data: qrData,
                image: image,
                dotsOptions: { color: dotColor, type: dotType },
                cornersSquareOptions: { type: cornerSquareType, color: dotColor },
                cornersDotOptions: { type: cornerDotType, color: dotColor },
                backgroundOptions: { color: isTransparent ? "transparent" : bgColor },
                qrOptions: { errorCorrectionLevel: finalCorrectionLevel as ErrorCorrectionLevel },
            });
            if (ref.current) {
                ref.current.innerHTML = "";
                qrCode.append(ref.current);
            }
        }
    }, [qrCode, qrData, dotColor, bgColor, isTransparent, dotType, cornerSquareType, cornerDotType, image, errorCorrectionLevel, isPreloadEnabled]);

    const onDownloadClick = () => {
        if (!qrCode) return;
        qrCode.download({ extension: fileExt });
    };

    const onLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const resetConfig = () => {
        setContentType("url");
        setUrl("https://example.com");
        setWifiSsid(""); setWifiPassword(""); setWifiEncryption("WPA"); setWifiHidden(false);
        setVCardFirstName(""); setVCardLastName(""); setVCardPhone(""); setVCardEmail("");
        setEmailAddress(""); setEmailSubject(""); setEmailBody("");

        setDotColor("#000000"); setBgColor("#ffffff"); setIsTransparent(false);
        setDotType("rounded"); setCornerSquareType("extra-rounded"); setCornerDotType("dot");
        setErrorCorrectionLevel("Q");
        setImage(undefined);
        setBottomText(""); setBottomTextColor("#000000"); setBottomTextSize(16);
    };

    const applyPreset = (preset: string) => {
        switch (preset) {
            case "neon":
                setDotColor("#ff00ff");
                setBgColor("#000000");
                setIsTransparent(false);
                setDotType("square");
                setCornerSquareType("square");
                setErrorCorrectionLevel("H");
                break;
            case "warm":
                setDotColor("#d97706");
                setBgColor("#fffbeb");
                setIsTransparent(false);
                setDotType("rounded");
                setCornerSquareType("extra-rounded");
                setErrorCorrectionLevel("Q");
                break;
            case "corporate":
                setDotColor("#1e3a8a");
                setBgColor("#ffffff");
                setIsTransparent(false);
                setDotType("classy");
                setCornerSquareType("extra-rounded");
                setErrorCorrectionLevel("M");
                break;
            case "eco":
                setDotColor("#15803d");
                setBgColor("#f0fdf4");
                setIsTransparent(false);
                setDotType("dots");
                setCornerSquareType("dot");
                setErrorCorrectionLevel("Q");
                break;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full h-full items-stretch">

            {/* Control Panel (Scrollable) */}
            <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0">
                <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 flex flex-col overflow-hidden">
                    <CardHeader className="py-4 px-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    Configuration
                                </CardTitle>
                                <CardDescription>Customize your QR code</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={resetConfig} title="Reset All">
                                <RotateCcw className="w-4 h-4 text-zinc-400 hover:text-red-500 transition-colors" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <ScrollArea className="h-full px-6">
                            <div className="py-4 pb-12">
                                <Accordion type="single" collapsible defaultValue="content" className="w-full">

                                    {/* Presets Section */}
                                    <AccordionItem value="presets" className="border-zinc-200/50 dark:border-zinc-800/50">
                                        <AccordionTrigger className="hover:no-underline py-3 px-1"><span className="flex items-center gap-2 text-sm font-semibold"><Palette className="w-4 h-4 text-blue-500" /> Quick Presets</span></AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-4 gap-2 pt-2">
                                                <Button variant="outline" size="sm" onClick={() => applyPreset("neon")} className="bg-black text-pink-500 border-pink-500 hover:bg-zinc-900 h-8 text-[10px]">Neon</Button>
                                                <Button variant="outline" size="sm" onClick={() => applyPreset("warm")} className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 h-8 text-[10px]">Warm</Button>
                                                <Button variant="outline" size="sm" onClick={() => applyPreset("corporate")} className="bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 h-8 text-[10px]">Corp</Button>
                                                <Button variant="outline" size="sm" onClick={() => applyPreset("eco")} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 h-8 text-[10px]">Eco</Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Content Section */}
                                    <AccordionItem value="content">
                                        <AccordionTrigger><span className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Content Data</span></AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <Tabs defaultValue="url" value={contentType} onValueChange={setContentType} className="w-full">
                                                <TabsList className="grid w-full grid-cols-4 mb-4">
                                                    <TabsTrigger value="url"><LinkIcon className="w-4 h-4" /></TabsTrigger>
                                                    <TabsTrigger value="wifi"><Wifi className="w-4 h-4" /></TabsTrigger>
                                                    <TabsTrigger value="vcard"><User className="w-4 h-4" /></TabsTrigger>
                                                    <TabsTrigger value="email"><Mail className="w-4 h-4" /></TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="url" className="space-y-4 pt-2">
                                                    <div className="space-y-2">
                                                        <Label>Website URL</Label>
                                                        <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
                                                    </div>
                                                    <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                                        <Checkbox id="preload" checked={isPreloadEnabled} onCheckedChange={(c) => setIsPreloadEnabled(c as boolean)} />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <Label htmlFor="preload" className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                                                                <Zap className="w-3 h-3" /> Aktifkan Animasi Preload
                                                            </Label>
                                                            <p className="text-[10px] text-zinc-500">
                                                                User akan melihat animasi keren sebelum dialihkan ke URL tujuan.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="wifi" className="space-y-3">
                                                    <div><Label>SSID</Label><Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} /></div>
                                                    <div><Label>Password</Label><Input value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} type="password" /></div>
                                                    <div>
                                                        <Label>Encryption</Label>
                                                        <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                                                                <SelectItem value="WEP">WEP</SelectItem>
                                                                <SelectItem value="nopass">None</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id="hidden-wifi" checked={wifiHidden} onCheckedChange={(c) => setWifiHidden(c as boolean)} />
                                                        <Label htmlFor="hidden-wifi">Hidden</Label>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="vcard" className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div><Label>First Name</Label><Input value={vCardFirstName} onChange={(e) => setVCardFirstName(e.target.value)} /></div>
                                                        <div><Label>Last Name</Label><Input value={vCardLastName} onChange={(e) => setVCardLastName(e.target.value)} /></div>
                                                    </div>
                                                    <div><Label>Phone</Label><Input value={vCardPhone} onChange={(e) => setVCardPhone(e.target.value)} /></div>
                                                    <div><Label>Email</Label><Input value={vCardEmail} onChange={(e) => setVCardEmail(e.target.value)} /></div>
                                                </TabsContent>

                                                <TabsContent value="email" className="space-y-3">
                                                    <div><Label>Email To</Label><Input value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} /></div>
                                                    <div><Label>Subject</Label><Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} /></div>
                                                    <div><Label>Body</Label><Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} /></div>
                                                </TabsContent>
                                            </Tabs>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Appearance Section */}
                                    <AccordionItem value="appearance">
                                        <AccordionTrigger><span className="flex items-center gap-2"><Eye className="w-4 h-4" /> Appearance & Colors</span></AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-xs">Dot Color</Label>
                                                    <Input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="h-10 w-full p-1 cursor-pointer" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Background</Label>
                                                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={isTransparent} className={`h-10 w-full p-1 cursor-pointer ${isTransparent ? 'opacity-50' : ''}`} />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="transparent" checked={isTransparent} onCheckedChange={(c) => setIsTransparent(c as boolean)} />
                                                <Label htmlFor="transparent">Transparent Background</Label>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Dot Style</Label>
                                                <Select value={dotType} onValueChange={(v) => setDotType(v as DotType)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="dots">Dots</SelectItem>
                                                        <SelectItem value="rounded">Rounded</SelectItem>
                                                        <SelectItem value="classy">Classy</SelectItem>
                                                        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                                                        <SelectItem value="square">Square</SelectItem>
                                                        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">External Eye</Label>
                                                    <Select value={cornerSquareType} onValueChange={(v) => setCornerSquareType(v as CornerSquareType)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dot">Dot</SelectItem>
                                                            <SelectItem value="square">Square</SelectItem>
                                                            <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Internal Eye</Label>
                                                    <Select value={cornerDotType} onValueChange={(v) => setCornerDotType(v as CornerDotType)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dot">Dot</SelectItem>
                                                            <SelectItem value="square">Square</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Logo & Text Section */}
                                    <AccordionItem value="branding">
                                        <AccordionTrigger><span className="flex items-center gap-2"><Type className="w-4 h-4" /> Logo & Text</span></AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <Label>Logo Image</Label>
                                                <div className="flex gap-2 items-center">
                                                    <Input type="file" onChange={onLogoUpload} accept="image/*" className="cursor-pointer text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                                                    {image && <Button variant="ghost" size="icon" onClick={() => setImage(undefined)}><Trash2 className="w-4 h-4 text-red-500" /></Button>}
                                                </div>
                                            </div>
                                            <div className="space-y-2 border-t pt-4">
                                                <Label>Label Text</Label>
                                                <Input placeholder="e.g. SCAN ME" value={bottomText} onChange={(e) => setBottomText(e.target.value)} />
                                                <div className="grid grid-cols-3 gap-2">
                                                    <Select value={bottomTextFont} onValueChange={setBottomTextFont}>
                                                        <SelectTrigger><SelectValue placeholder="Font" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="sans-serif">Sans</SelectItem>
                                                            <SelectItem value="serif">Serif</SelectItem>
                                                            <SelectItem value="monospace">Mono</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input type="number" placeholder="Size" value={bottomTextSize} onChange={(e) => setBottomTextSize(Number(e.target.value))} />
                                                    <Input type="color" value={bottomTextColor} onChange={(e) => setBottomTextColor(e.target.value)} className="p-1 cursor-pointer" />
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Advanced Section */}
                                    <AccordionItem value="advanced">
                                        <AccordionTrigger><span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Advanced</span></AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <div className="space-y-2">
                                                <Label>Error Correction Level</Label>
                                                <Select value={errorCorrectionLevel} onValueChange={(v) => setErrorCorrectionLevel(v as ErrorCorrectionLevel)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="L">Low (7%) - Cleanest</SelectItem>
                                                        <SelectItem value="M">Medium (15%) - Standard</SelectItem>
                                                        <SelectItem value="Q">Quartile (25%) - High</SelectItem>
                                                        <SelectItem value="H">High (30%) - Max Reliability</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                </Accordion>

                                {isContrastLow && (
                                    <div className="mt-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-900 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex">
                                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" aria-hidden="true" />
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Low Contrast</h3>
                                                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                    <p>{isTransparent ? "Transparent BG requires contrasty surface." : "Colors are too similar."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[500px] p-6">
                <div className="relative group perspective-1000">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <div className="relative bg-white dark:bg-zinc-800 p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6 transition-transform transform group-hover:scale-[1.01]">
                        <div ref={ref} className="bg-transparent" />
                        {bottomText && (
                            <p className="mt-2" style={{
                                fontFamily: bottomTextFont,
                                fontSize: `${bottomTextSize}px`,
                                color: bottomTextColor,
                                fontWeight: 'bold'
                            }}>
                                {bottomText}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                    <Select value={fileExt} onValueChange={(v) => setFileExt(v as Extension)}>
                        <SelectTrigger className="w-full sm:w-[120px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                            <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="webp">WEBP</SelectItem>
                            <SelectItem value="svg">SVG</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={onDownloadClick} size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg transform active:scale-95 transition-all text-lg h-12 rounded-xl">
                        <Download className="mr-2 h-5 w-5" /> Download QR
                    </Button>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-md bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Raw QR Data:</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            onClick={handleCopy}
                            title="Copy to clipboard"
                        >
                            {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-600 dark:text-zinc-300 break-all bg-white dark:bg-black/40 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                        {qrData || "No data..."}
                    </p>
                    {qrData.length > 150 && (
                        <p className="text-[10px] text-amber-500 font-medium text-center">
                            ⚠️ Link sangat panjang. Gunakan Dot Style 'Square' untuk scan lebih stabil.
                        </p>
                    )}
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-500 text-center max-w-sm">
                    High quality export ready for print.
                </p>
            </div>
        </div>
    );
}
