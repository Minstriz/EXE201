'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function DrawingPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [isDrawing, setIsDrawing] = useState(true);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(5);
    const [shadowColor, setShadowColor] = useState('#000000');
    const [shadowWidth, setShadowWidth] = useState(0);
    const [shadowOffset, setShadowOffset] = useState(0);
    const [brushType, setBrushType] = useState('Pencil');
    const [textValue, setTextValue] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [textAlign] = useState<'left' | 'center' | 'right'>('left');
    const [isBold] = useState(false);
    const [isItalic] = useState(false);
    const [isUnderline] = useState(false);

    // ================= NEW: Upload image into fabric canvas =================
    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (f) => {
            const data = f.target?.result;
            if (!data || typeof data !== 'string') return;

            try {
                const img = await fabric.Image.fromURL(data, { crossOrigin: 'anonymous' });
                const canvas = fabricCanvasRef.current;
                if (!canvas) return;

                // scale down nếu ảnh quá to
                const maxDim = Math.min(canvas.getWidth(), canvas.getHeight()) * 0.7;
                const ratio = Math.min(
                    maxDim / (img.width ?? maxDim),
                    maxDim / (img.height ?? maxDim),
                    1
                );

                img.set({
                    left: canvas.getWidth() / 2 - ((img.width ?? 0) * ratio) / 2,
                    top: canvas.getHeight() / 2 - ((img.height ?? 0) * ratio) / 2,
                    selectable: true,
                    hasControls: true,
                    scaleX: ratio,
                    scaleY: ratio,
                    originX: 'left',
                    originY: 'top',
                });

                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            } catch (err) {
                console.error('Error loading image:', err);
            }
        };
        reader.readAsDataURL(file);
    };



    const createBrush = React.useCallback((canvas: fabric.Canvas, type: string): fabric.BaseBrush => {
        switch (type) {
            case 'hline': {
                const brush = new fabric.PatternBrush(canvas);
                brush.getPatternSrc = () => {
                    const patternCanvas = document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    const ctx = patternCanvas.getContext('2d')!;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(0, 5);
                    ctx.lineTo(10, 5);
                    ctx.stroke();
                    return patternCanvas;
                };
                return brush;
            }
            case 'vline': {
                const brush = new fabric.PatternBrush(canvas);
                brush.getPatternSrc = () => {
                    const patternCanvas = document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    const ctx = patternCanvas.getContext('2d')!;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(5, 0);
                    ctx.lineTo(5, 10);
                    ctx.stroke();
                    return patternCanvas;
                };
                return brush;
            }
            case 'Pencil':
                return new fabric.PencilBrush(canvas);
            case 'Spray':
                return new fabric.SprayBrush(canvas);
            case 'Circle':
                return new fabric.CircleBrush(canvas);
            // 'Square' brush is not available in fabric.js by default.
            // You can either remove this case or implement a custom SquareBrush.
            // For now, fallback to PencilBrush for 'Square'.
            case 'Square':
                return new fabric.PencilBrush(canvas);
            default:
                return new fabric.PencilBrush(canvas);
        }
    }, [color]);

    const applyBrushSettings = React.useCallback((canvas: fabric.Canvas) => {
        const brush = canvas.freeDrawingBrush;
        if (!brush) return;

        // Fabric.js BaseBrush không khai báo sẵn các property này, nên dùng Partial typing
        (brush as fabric.BaseBrush & { color?: string; width?: number; shadow?: fabric.Shadow }).color = color;
        (brush as fabric.BaseBrush & { color?: string; width?: number; shadow?: fabric.Shadow }).width = lineWidth;
        (brush as fabric.BaseBrush & { color?: string; width?: number; shadow?: fabric.Shadow }).shadow = new fabric.Shadow({
            blur: shadowWidth,
            offsetX: shadowOffset,
            offsetY: shadowOffset,
            affectStroke: true,
            color: shadowColor,
        });

        if ('getPatternSrc' in brush && typeof (brush as fabric.PatternBrush).getPatternSrc === 'function') {
            try {
                (brush as fabric.PatternBrush).source = (brush as fabric.PatternBrush).getPatternSrc.call(brush);
            } catch {
                // bỏ err vì không dùng
            }
        }
    }, [color, lineWidth, shadowColor, shadowWidth, shadowOffset]);


    useEffect(() => {
        const canvas = fabricCanvasRef.current;

        if (!canvas) return;

        canvas.isDrawingMode = isDrawing;

        // Khi tắt chế độ vẽ thì chọn được object để di chuyển/phóng to/thu nhỏ
        canvas.selection = !isDrawing;

        canvas.forEachObject(obj => {
            obj.selectable = !isDrawing;
            obj.evented = !isDrawing;
        });
        canvas.renderAll();
    }, [isDrawing]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (canvas && container) {
            const { width, height } = container.getBoundingClientRect();

            // Set canvas actual size in pixels
            canvas.width = width;
            canvas.height = height;

            // Optional: Set CSS size as well (for safe measure)
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
            preserveObjectStacking: true, // quan trọng để vẽ không che mất SVG
        });
        // Set a reasonable viewport / size if needed
        fabricCanvasRef.current = canvas;
        const defaultBrush = createBrush(canvas, brushType);
        canvas.freeDrawingBrush = defaultBrush;
        applyBrushSettings(canvas);

        // Optional: make retina scaling off if needed, or handle multiplier on toDataURL
        return () => {
            canvas.dispose();
        };
    }, []); // keep initial only

    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const brush = createBrush(canvas, brushType);
        canvas.freeDrawingBrush = brush;
        applyBrushSettings(canvas);
    }, [brushType, color, lineWidth, shadowColor, shadowWidth, shadowOffset, createBrush, applyBrushSettings]);

    const handleClear = () => {
        fabricCanvasRef.current?.clear();
    };
    const handleDownload = (format: 'png' | 'jpeg') => {
        alert(`Đang tải xuống tệp ở định dạng: ${format}`);
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format,
            quality: 1.0,
            multiplier: 1,
        });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `canvas.${format}`;
        link.click();
    };

    /**
     * applyToShirt: vẽ áo + overlay họa tiết vào canvas #shirtCanvas
     * Trả về Promise để biết khi nào render xong (để dùng trước khi tạo ZIP)
     */
    const applyToShirt = (drawnImage: HTMLImageElement | string): Promise<void> => {
        return new Promise((resolve) => {
            const canvas = document.getElementById("shirtCanvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve();
                return;
            }

            // Load áo trắng
            const shirtImage = new Image();
            // ensure crossOrigin to avoid tainted canvas (so we can export)
            shirtImage.crossOrigin = 'anonymous';
            shirtImage.src = "/images/black_white/aotrang.png";
            shirtImage.onload = () => {
                // Vẽ nền là áo
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Kích thước áo mong muốn
                const shirtWidth = 400;
                const shirtHeight = 600;

                // Căn giữa áo trên canvas
                const shirtX = (canvas.width - shirtWidth) / 2;
                const shirtY = (canvas.height - shirtHeight) / 2;
                ctx.drawImage(shirtImage, shirtX, shirtY, shirtWidth, shirtHeight);

                // Load hình đã vẽ (dưới dạng image hoặc base64)
                const overlay = new Image();
                overlay.crossOrigin = 'anonymous';
                overlay.src = typeof drawnImage === "string" ? drawnImage : drawnImage.src;

                overlay.onload = () => {
                    // Tùy chỉnh vị trí và kích thước hình vẽ trên áo
                    const x = 150;
                    const y = 200;
                    const width = 300;
                    const height = 300;

                    ctx.drawImage(overlay, x, y, width, height);
                    // ensure a tiny pause for canvas rasterization if needed, then resolve
                    // but onload + drawImage is synchronous for drawing into same-origin canvas,
                    // so resolve immediately
                    resolve();
                };

                overlay.onerror = () => {
                    // even if overlay fails, resolve to avoid blocking
                    resolve();
                };
            };

            shirtImage.onerror = () => {
                // can't load shirt image, still resolve to avoid hang
                resolve();
            };
        });
    };

    const handleApplyToShirt = async () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1.0,
            multiplier: 1,
        });

        await applyToShirt(dataURL);
    };

    // ================= NEW: download ZIP (pattern + shirt merged) =================
    const handleDownloadZip = async () => {
        const canvas = fabricCanvasRef.current;
        const shirtCanvas = document.getElementById("shirtCanvas") as HTMLCanvasElement;
        if (!canvas || !shirtCanvas) {
            alert("Canvas chưa sẵn sàng.");
            return;
        }
        alert('Đang tải xuống tệp ZIP');
        // 1) Render shirt with current pattern (ensure shirtCanvas updated)
        const patternDataURL = canvas.toDataURL({ format: 'png', quality: 1.0, multiplier: 1 });

        // apply pattern onto shirtCanvas first and wait
        await applyToShirt(patternDataURL);

        // 2) Get both dataURLs
        const patternData = patternDataURL; // canvas vẽ (pattern only)
        // shirtCanvas already updated by applyToShirt
        const shirtData = shirtCanvas.toDataURL('image/png');

        // 3) Put into ZIP (strip data URL prefix and set base64 true)
        const zip = new JSZip();
        try {
            const patternBase64 = patternData.split(',')[1];
            const shirtBase64 = shirtData.split(',')[1];
            zip.file("pattern.png", patternBase64, { base64: true });
            zip.file("shirt_with_pattern.png", shirtBase64, { base64: true });

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "designs.zip");
        } catch (err) {
            console.error(err);
            alert("Tạo ZIP thất bại. Kiểm tra console.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 mt-20 h-auto">
            <div className="max-w-screen mx-auto space-y-6">
                <div className="flex flex-col md:flex-row gap-6 md:w-full bg-white shadow rounded-lg p-6">
                    {/* LEFT: Controls */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex gap-2 md:flex-row">
                            <button
                                onClick={() => setIsDrawing(!isDrawing)}
                                className={`w-full md:w-2/3 cursor-pointer py-2 rounded transition ${isDrawing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                    } text-white`}
                            >
                                {isDrawing ? 'Tắt Drawing Mode' : 'Bật Drawing Mode'}
                            </button>
                            <div className="md:w-1/3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadImage}
                                    className="hidden"
                                    id="upload-image-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("upload-image-input")?.click()}
                                    className="px-4 py-2 text-black border border-gray-300 cursor-pointer rounded hover:bg-black hover:text-white transition"
                                >
                                    Chọn ảnh
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                placeholder="Nhập Text"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />

                            {/* Font Family */}
                            <div className="flex gap-2">
                                <select
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                >
                                    <option value="Arial">Arial</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Comic Sans MS">Comic Sans MS</option>
                                </select>

                                {/* Font Size */}
                                <input
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Font Size"
                                />
                                <button
                                    onClick={() => {
                                        if (!textValue.trim()) return;
                                        const canvas = fabricCanvasRef.current;
                                        if (!canvas) return;

                                        const text = new fabric.IText(textValue, {
                                            left: 100,
                                            top: 100,
                                            fill: color,
                                            fontSize,
                                            fontFamily,
                                            fontWeight: isBold ? 'bold' : 'normal',
                                            fontStyle: isItalic ? 'italic' : 'normal',
                                            underline: isUnderline,
                                            textAlign,
                                            selectable: true,
                                            shadow: new fabric.Shadow({
                                                blur: shadowWidth,
                                                offsetX: shadowOffset,
                                                offsetY: shadowOffset,
                                                affectStroke: true,
                                                color: shadowColor,
                                            }),
                                        });

                                        canvas.add(text);
                                        canvas.setActiveObject(text);
                                        canvas.renderAll();
                                        setTextValue('');
                                    }}
                                    className="w-full py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                >
                                    Thêm chữ
                                </button>
                            </div>

                        </div>

                        {/* Brush type */}
                        <div className="space-y-1">
                            <label className="block font-bold">Brush</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={brushType}
                                onChange={(e) => setBrushType(e.target.value)}
                            >
                                <option value="Pencil">Pencil</option>
                                <option value="Circle">Circle</option>
                                <option value="Square">Square</option>
                                <option value="Spray">Spray</option>
                                <option value="hline">H-Pattern</option>
                                <option value="vline">V-Pattern</option>
                            </select>
                        </div>

                        <div className="flex gap-5">
                            {/* Color */}
                            <div className="space-y-1">
                                <label className="block font-bold">Color</label>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full h-10 rounded border border-gray-300"
                                />
                            </div>
                            {/* Shadow Color */}
                            <div className="space-y-1">
                                <label className="block font-bold">Shadow Color</label>
                                <input
                                    type="color"
                                    value={shadowColor}
                                    onChange={(e) => setShadowColor(e.target.value)}
                                    className="w-full h-10 rounded border border-gray-300"
                                />
                            </div>
                        </div>
                        {/* Line Width */}
                        <div className="space-y-1">
                            <label className="block font-medium">Line Width ({lineWidth})</label>
                            <input
                                type="range"
                                min={1}
                                max={100}
                                value={lineWidth}
                                onChange={(e) => setLineWidth(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        {/* Shadow Blur */}
                        <div className="space-y-1">
                            <label className="block font-medium">Shadow Blur ({shadowWidth})</label>
                            <input
                                type="range"
                                min={0}
                                max={50}
                                value={shadowWidth}
                                onChange={(e) => setShadowWidth(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Shadow Offset */}
                        <div className="space-y-1">
                            <label className="block font-medium">Shadow Offset ({shadowOffset})</label>
                            <input
                                type="range"
                                min={0}
                                max={50}
                                value={shadowOffset}
                                onChange={(e) => setShadowOffset(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                    </div>

                    <div className="flex flex-col md:flex w-full  md:flex-col gap-4">
                        {/* RIGHT: Canvas */}
                        <div className="flex flex-col gap-2 md:flex-row w-full justify-start">
                            {/* Clear Button */}
                            <button
                                onClick={handleClear}
                                className="pl-5 pr-5 h-10 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Xoá Canvas
                            </button>

                            <button
                                onClick={handleApplyToShirt}
                                className="pl-5 pr-5 h-10 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                            >
                                Áp dụng lên áo
                            </button>
                            <button
                                onClick={() => handleDownload('png')}
                                className="pl-5 pr-5 h-10 bg-blue-950 text-white rounded hover:bg-blue-600 transition"
                            >
                                Tải xuống (PNG)
                            </button>
                            <button
                                onClick={() => handleDownload('jpeg')}
                                className="pl-5 pr-5 h-10 bg-green-700 text-white rounded hover:bg-green-600 transition"
                            >
                                Tải xuống (JPG)
                            </button>
                            <button
                                onClick={handleDownloadZip}
                                className="pl-5 pr-5 h-10 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                            >
                                Tải ZIP (Áo + Họa tiết)
                            </button>
                            
                        </div>
                        <div className="w-full h-[600px] flex">
                            <div
                                ref={containerRef}
                                className="w-full  h-[600px] bg-grey-50 border border-gray-300 rounded"
                            >
                                <canvas
                                    id="canvas"
                                    width={1000}
                                    height={1000}
                                    ref={canvasRef}
                                    className="w-full h-full border"
                                />
                            </div>
                        </div>

                        <div className="shirtContainer h-[600px] flex justify-center items-center md:overflow-hidden md:">
                            <canvas id="shirtCanvas" width={600} height={600}></canvas>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
}
