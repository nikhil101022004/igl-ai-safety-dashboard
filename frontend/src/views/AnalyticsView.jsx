import React, { useState, useEffect, useRef } from "react";
import { BarChart3, Database, AlertTriangle, Download, Activity } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, Legend 
} from "recharts";
import { fetchAnalyticsApi } from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Colors for the charts
const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];
const SEVERITY_COLORS = { 'LOW': '#10b981', 'MEDIUM': '#f59e0b', 'HIGH': '#ef4444', 'CRITICAL': '#dc2626' };

export default function AnalyticsView() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  // Ref to capture the charts for PDF
  const analyticsRef = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchAnalyticsApi();
      setAnalyticsData(res);
      setLoading(false);
    }
    load();
  }, []);

  // PDF Download Function
  const downloadPDF = async () => {
    setDownloading(true);
    const element = analyticsRef.current;
    
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#f8fafc" });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; 
      const pageHeight = 295;  
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('IGL_Safety_Analytics_Report.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setDownloading(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" ref={analyticsRef}>
      {/* Title & Download Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            Safety Reports & Analytics Graphs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Safety trend graphs calculated strictly from actual alert records saved in database.
          </p>
        </div>
        
        {!loading && analyticsData && analyticsData.has_data && (
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating PDF..." : "Export PDF Report"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs font-mono">
          Loading safety database reports...
        </div>
      ) : !analyticsData || !analyticsData.has_data ? (
        /* Empty Database State Banner */
        <div className="p-12 text-center text-slate-400 text-xs space-y-3 border border-dashed border-slate-300 rounded-2xl bg-white">
          <Database className="w-12 h-12 mx-auto text-slate-400 mb-1" />
          <h3 className="text-base font-bold text-slate-700">No data available for analytics</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            There are zero saved safety incidents in the database right now. As soon as a real camera alert is detected or tested, summary charts will automatically appear here.
          </p>
        </div>
      ) : (
        /* Real Analytics Data Breakdown */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Chart 1: Event Breakdown (Bar Chart) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600" />
              Alert Types Breakdown
            </h2>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.event_breakdown} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="event_type" 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    tickFormatter={(val) => val.replace(/_/g, ' ')} 
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Severity Breakdown (Pie Chart) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Danger Level Distribution
            </h2>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={analyticsData.severity_breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="severity"
                  >
                    {analyticsData.severity_breakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={SEVERITY_COLORS[entry.severity] || '#94a3b8'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}