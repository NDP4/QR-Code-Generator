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

type Extension = "png" | "jpeg" | "webp" | "svg";
import { Download, Upload, RefreshCw, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function QRCodeGenerator() {
    const [url, setUrl] = useState("https://example.com");
    const [fileExt, setFileExt] = useState<Extension>("png");
    const [dotColor, setDotColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [dotType, setDotType] = useState<DotType>("rounded");
    const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>("extra-rounded");
    const [cornerDotType, setCornerDotType] = useState<CornerDotType>("dot");
    const [image, setImage] = useState<string | undefined>(undefined);
    const ref = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

    useEffect(() => {
        const qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            image: image,
            dotsOptions: {
                color: dotColor,
                type: dotType,
            },
            cornersSquareOptions: {
                type: cornerSquareType,
                color: dotColor, // Matching dots for consistency, can be separate
            },
            cornersDotOptions: {
                type: cornerDotType,
                color: dotColor,
            },
            backgroundOptions: {
                color: bgColor,
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10,
            },
        });
        setQrCode(qrCode);
    }, []);

    useEffect(() => {
        if (qrCode) {
            qrCode.update({
                data: url,
                image: image,
                dotsOptions: {
                    color: dotColor,
                    type: dotType,
                },
                cornersSquareOptions: {
                    type: cornerSquareType,
                    color: dotColor,
                },
                cornersDotOptions: {
                    type: cornerDotType,
                    color: dotColor,
                },
                backgroundOptions: {
                    color: bgColor,
                },
            });
            if (ref.current) {
                ref.current.innerHTML = "";
                qrCode.append(ref.current);
            }
        }
    }, [qrCode, url, dotColor, bgColor, dotType, cornerSquareType, cornerDotType, image]);

    const onDownloadClick = () => {
        if (!qrCode) return;
        qrCode.download({
            extension: fileExt,
        });
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {/* Control Panel */}
            <Card className="lg:col-span-1 shadow-xl border-0 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                <CardHeader>
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Customization
                    </CardTitle>
                    <CardDescription>Tailor your QR code to your brand.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="url">Content URL</Label>
                        <Input
                            id="url"
                            placeholder="https://your-site.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="border-zinc-300 dark:border-zinc-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Dot Color</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={dotColor}
                                    onChange={(e) => setDotColor(e.target.value)}
                                    className="h-10 w-full p-1 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Background</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="h-10 w-full p-1 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Dot Style</Label>
                        <Select value={dotType} onValueChange={(v) => setDotType(v as DotType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select style" />
                            </SelectTrigger>
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

                    <div className="space-y-2">
                        <Label>Corner Square Style</Label>
                        <Select value={cornerSquareType} onValueChange={(v) => setCornerSquareType(v as CornerSquareType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select corner square" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dot">Dot</SelectItem>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Corner Dot Style</Label>
                        <Select value={cornerDotType} onValueChange={(v) => setCornerDotType(v as CornerDotType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select corner dot" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dot">Dot</SelectItem>
                                <SelectItem value="square">Square</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <Input type="file" onChange={onLogoUpload} accept="image/*" className="cursor-pointer" />
                    </div>
                </CardContent>
            </Card>

            {/* Preview Panel */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-2xl">
                        <div ref={ref} className="bg-transparent" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                    <Select value={fileExt} onValueChange={(v) => setFileExt(v as Extension)}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="webp">WEBP</SelectItem>
                            <SelectItem value="svg">SVG</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={onDownloadClick} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transform active:scale-95 transition-all">
                        <Download className="mr-2 h-4 w-4" /> Download QR Code
                    </Button>
                </div>
            </div>
        </div>
    );
}
