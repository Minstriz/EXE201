'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

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
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
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

        brush.color = color;
        brush.width = lineWidth;
        brush.shadow = new fabric.Shadow({
            blur: shadowWidth,
            offsetX: shadowOffset,
            offsetY: shadowOffset,
            affectStroke: true,
            color: shadowColor,
        });

        if ('getPatternSrc' in brush && typeof brush.getPatternSrc === 'function') {
            (brush as fabric.PatternBrush).source = brush.getPatternSrc.call(brush);
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
        fabricCanvasRef.current = canvas;
        const defaultBrush = createBrush(canvas, brushType);
        canvas.freeDrawingBrush = defaultBrush;
        applyBrushSettings(canvas);

        return () => {
            canvas.dispose();
        };
    }, []);

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
    return (
        <div className="min-h-screen bg-gray-100 p-4 mt-20">
            <div className="max-w-screen mx-auto space-y-6">
                <div className="flex flex-col md:flex-row gap-6 md:w-full bg-white shadow rounded-lg p-6">
                    {/* LEFT: Controls */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="pt-2">
                            <button
                                onClick={() => setIsDrawing(!isDrawing)}
                                className={`w-full py-2 rounded transition ${isDrawing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
                                    } text-white`}
                            >
                                {isDrawing ? 'Tắt Drawing Mode' : 'Bật Drawing Mode'}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">Thêm chữ vào canvas</label>
                            <input
                                type="text"
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                placeholder="Nhập nội dung..."
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />

                            {/* Font Family */}
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

                            {/* Text Style Toggle */}
                            <div className="flex gap-2">
                                <label className="flex items-center gap-1">
                                    <input type="checkbox" checked={isBold} onChange={() => setIsBold(!isBold)} />
                                    <span className="text-sm">Bold</span>
                                </label>
                                <label className="flex items-center gap-1">
                                    <input type="checkbox" checked={isItalic} onChange={() => setIsItalic(!isItalic)} />
                                    <span className="text-sm">Italic</span>
                                </label>
                                <label className="flex items-center gap-1">
                                    <input type="checkbox" checked={isUnderline} onChange={() => setIsUnderline(!isUnderline)} />
                                    <span className="text-sm">Underline</span>
                                </label>
                            </div>

                            {/* Text Alignment */}
                            <div className="flex gap-2">
                                <button
                                    className={`flex-1 py-1 rounded border ${textAlign === 'left' ? 'bg-indigo-500 text-white' : 'bg-white'} `}
                                    onClick={() => setTextAlign('left')}
                                >
                                    Left
                                </button>
                                <button
                                    className={`flex-1 py-1 rounded border ${textAlign === 'center' ? 'bg-indigo-500 text-white' : 'bg-white'} `}
                                    onClick={() => setTextAlign('center')}
                                >
                                    Center
                                </button>
                                <button
                                    className={`flex-1 py-1 rounded border ${textAlign === 'right' ? 'bg-indigo-500 text-white' : 'bg-white'} `}
                                    onClick={() => setTextAlign('right')}
                                >
                                    Right
                                </button>
                            </div>

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
                                className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                            >
                                Thêm chữ
                            </button>
                        </div>

                        {/* Brush type */}
                        <div className="space-y-1">
                            <label className="block font-medium">Brush</label>
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

                        {/* Color */}
                        <div className="space-y-1">
                            <label className="block font-medium">Color</label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-full h-10 rounded border border-gray-300"
                            />
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

                        {/* Shadow Color */}
                        <div className="space-y-1">
                            <label className="block font-medium">Shadow Color</label>
                            <input
                                type="color"
                                value={shadowColor}
                                onChange={(e) => setShadowColor(e.target.value)}
                                className="w-full h-10 rounded border border-gray-300"
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

                        <div className="flex flex-col">
                            {/* Clear Button */}
                            <div className="pt-2">
                                <button
                                    onClick={handleClear}
                                    className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Xoá Canvas
                                </button>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => handleDownload('png')}
                                    className="w-full py-2 bg-blue-950 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Tải xuống (PNG)
                                </button>
                                <button
                                    onClick={() => handleDownload('jpeg')}
                                    className="w-full py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
                                >
                                    Tải xuống (JPG)
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT: Canvas */}
                    <div className="w-full h-[600px] md:w-2/3 flex items-start justify-start">
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

                </div>
            </div>
        </div>

    );
}
