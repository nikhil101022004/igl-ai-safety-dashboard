import React, { useRef, useEffect, useState } from "react";
import { MonitorPlay, Camera, Eye, EyeOff, ShieldAlert, Activity } from "lucide-react";
import { useSafety } from "../context/SafetyContext";

export default function LiveMonitoringView() {
  // FIXED: Added activeStream to the list
  const { activeStream, streamSource, restrictedZones, setActiveTab, dispatchAlert } = useSafety();
  
  const videoRef = useRef(null);
  const [yoloFrame, setYoloFrame] = useState(null);
  const [showZones, setShowZones] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Attach Stream to Video Element
  useEffect(() => {
    // FIXED: Use activeStream (the actual video) instead of streamSource
    if (videoRef.current && activeStream && activeStream instanceof MediaStream) {
      videoRef.current.srcObject = activeStream;
      videoRef.current.play().catch((e) => console.log("Video play error:", e));
    }
  }, [activeStream]);

  // The Real AI Loop
  useEffect(() => {
    if (!activeStream || !videoRef.current) return;

    const interval = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      
      // 1. Draw the video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 2. Draw Restricted Zones
      if (showZones && restrictedZones.length > 0) {
        restrictedZones.forEach((zone) => {
          if (zone.polygon_coords && zone.polygon_coords.length > 2) {
            ctx.beginPath();
            ctx.moveTo(zone.polygon_coords[0][0] * canvas.width, zone.polygon_coords[0][1] * canvas.height);
            for (let i = 1; i < zone.polygon_coords.length; i++) {
              ctx.lineTo(zone.polygon_coords[i][0] * canvas.width, zone.polygon_coords[i][1] * canvas.height);
            }
            ctx.closePath();
            ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
            ctx.fill();
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 10]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#ef4444";
            ctx.font = "bold 24px sans-serif";
            ctx.fillText(`RESTRICTED: ${zone.zone_name}`, zone.polygon_coords[0][0] * canvas.width + 10, zone.polygon_coords[0][1] * canvas.height + 30);
          }
        });
      }

      // 3. Send to Backend AI
      const imageData = canvas.toDataURL("image/jpeg", 0.7);
      setIsProcessing(true);

      try {
        const response = await fetch("http://localhost:8000/api/ai/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_base64: imageData }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.image_base64) {
            setYoloFrame(data.image_base64); 
          }
        }
      } catch (error) {
        console.error("AI Backend Error:", error);
      } finally {
        setIsProcessing(false);
      }
    }, 500); 

    return () => clearInterval(interval);
  }, [activeStream, showZones, restrictedZones]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-cyan-600" />
            Live AI Monitoring (YOLOv8 Active)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time object detection processing frames every 500ms.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition ${
              showZones ? "bg-red-100 text-red-700 border border-red-200" : "bg-slate-100 text-slate-500"
            }`}
          >
            {showZones ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Restricted Zones
          </button>
          
          <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold ${isProcessing ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            <Activity className={`w-4 h-4 ${isProcessing ? "animate-pulse" : ""}`} />
            {isProcessing ? "AI Processing..." : "AI Idle"}
          </div>
        </div>
      </div>

      {/* Main Video/AI Display */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
          
          {/* Hidden Video Source */}
          <video ref={videoRef} autoPlay playsInline muted className="hidden" />

          {/* The AI Annotated Image */}
          {yoloFrame ? (
            <img src={yoloFrame} alt="AI Live Feed" className="w-full h-full object-contain" />
          ) : (
            <div className="text-slate-500 text-sm">Waiting for first AI frame...</div>
          )}

          {/* No Camera State */}
          {!activeStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <Camera className="w-16 h-16 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">NO LIVE INPUT</h3>
              <button onClick={() => setActiveTab("camera-input")} className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold">
                Go to Camera Setup
              </button>
            </div>
          )}
        </div>

        {/* Action Bar */}
        {activeStream && (
          <div className="flex items-center justify-between text-xs pt-2">
            <div className="text-slate-500">
              Source: <strong className="text-emerald-600">{streamSource?.name || "Webcam"}</strong>
            </div>
            <button 
              onClick={() => dispatchAlert && dispatchAlert({ event_type: "PPE_VIOLATION", zone_name: "Live Zone", severity: "HIGH", confidence: 0.99 })}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Trigger Manual Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}