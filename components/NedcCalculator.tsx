import React, { useState } from 'react';
import { ArrowLeft, Info, CheckCircle } from 'lucide-react';

interface NedcCalculatorProps {
  onBack: () => void;
}

type Standard = 'NEDC' | 'WLTP' | 'EPA' | 'CLTC';

const NedcCalculator: React.FC<NedcCalculatorProps> = ({ onBack }) => {
  const [distance, setDistance] = useState<string>('400');
  const [selectedStandard, setSelectedStandard] = useState<Standard>('NEDC');

  // Factors to convert FROM Standard TO WLTP
  // Formula: WLTP = Standard * Factor
  // Derived from user formulas:
  // WLTP = NEDC * 0.85
  // WLTP = CLTC * 0.82
  // WLTP = EPA * 1.168
  // WLTP = WLTP * 1.0
  const toWltpFactors: Record<Standard, number> = {
    NEDC: 0.85,
    CLTC: 0.82,
    EPA: 1.168,
    WLTP: 1.0
  };

  const standardsInfo: Record<Standard, { name: string; full: string; desc: string; color: string; bg: string }> = {
    NEDC: {
      name: 'NEDC',
      full: 'New European Driving Cycle',
      desc: 'มาตรฐานเก่า ทดสอบในห้องแล็บ ให้ค่าระยะทางสูงกว่าความเป็นจริง',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/40',
    },
    CLTC: {
      name: 'CLTC',
      full: 'China Light-Duty Vehicle Test Cycle',
      desc: 'มาตรฐานจีน เน้นการขับขี่ในเมือง ค่าสูงใกล้เคียงหรือมากกว่า NEDC',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/40',
    },
    WLTP: {
      name: 'WLTP',
      full: 'Worldwide Harmonized Light Vehicles Test Procedure',
      desc: 'มาตรฐานสากลปัจจุบัน ใกล้เคียงการใช้งานจริงมากขึ้น',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    },
    EPA: {
      name: 'EPA',
      full: 'US Environmental Protection Agency',
      desc: 'มาตรฐานอเมริกา เข้มงวดที่สุด ใกล้เคียงการใช้งานจริงมากที่สุด',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-100 dark:bg-rose-900/40',
    }
  };

  const calculateValue = (targetStd: Standard) => {
    const val = parseFloat(distance);
    if (isNaN(val)) return 0;
    
    // Step 1: Convert Input to WLTP
    // WLTP = Input * FactorInput
    const wltpVal = val * toWltpFactors[selectedStandard];
    
    // Step 2: Convert WLTP to Target
    // Since WLTP = Target * FactorTarget
    // Then Target = WLTP / FactorTarget
    const result = wltpVal / toWltpFactors[targetStd];
    
    return Math.round(result);
  };

  const getPercentageDiff = (targetStd: Standard) => {
     // Formula derived from value calc:
     // NewVal = OldVal * (FactorInput / FactorTarget)
     // Diff% = ((FactorInput / FactorTarget) - 1) * 100
     
     const f1 = toWltpFactors[selectedStandard];
     const f2 = toWltpFactors[targetStd];
     
     const diff = ((f1 / f2) - 1) * 100;
     
     // Handle near-zero floating point issues
     if (Math.abs(diff) < 0.1) return '0%';

     const formatted = diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
     return formatted;
  };

  return (
    <div className="w-full">
        {/* Header */}
        <div className="flex items-center mb-6">
            <button 
                onClick={onBack}
                className="mr-3 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">คำนวณ NEDC / WLTP</h1>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-700 overflow-hidden">
             <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                ระยะทางที่ระบุ (กม.)
             </label>
             <div className="flex gap-4 mb-6 w-full">
                <input 
                    type="number" 
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full min-w-0 text-4xl sm:text-5xl font-bold bg-transparent border-b-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:outline-none py-2 text-slate-800 dark:text-white truncate"
                    placeholder="0"
                />
             </div>

             <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                มาตรฐานของค่าที่ระบุ (เลือก 1 อย่าง)
             </label>
             <div className="grid grid-cols-2 gap-3">
                {(Object.keys(toWltpFactors) as Standard[]).map((std) => (
                    <button
                        key={std}
                        onClick={() => setSelectedStandard(std)}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                            selectedStandard === std 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                            : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {selectedStandard === std && <CheckCircle size={16} className="text-white flex-shrink-0" />}
                        <span className="font-bold tracking-wide">{std}</span>
                    </button>
                ))}
             </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wider">ผลลัพธ์โดยประมาณ</h3>
            
            {(Object.keys(toWltpFactors) as Standard[]).filter(s => s !== selectedStandard).map((std) => {
                const result = calculateValue(std);
                const info = standardsInfo[std];
                const diff = getPercentageDiff(std);
                const isPositive = parseFloat(diff) > 0;

                return (
                    <div key={std} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-transform hover:scale-[1.01]">
                         <div className="flex-1 pr-4">
                             <div className="flex items-center gap-2 mb-1">
                                 <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${info.bg} ${info.color}`}>
                                    {std}
                                 </span>
                                 <span className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {diff}
                                 </span>
                             </div>
                             <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">{info.full}</p>
                         </div>
                         <div className="text-right flex-shrink-0">
                             <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{result}</span>
                             <span className="text-xs text-slate-400 ml-1 font-medium">km</span>
                         </div>
                    </div>
                );
            })}
        </div>

        <div className="mt-8 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-slate-600 dark:text-slate-300">
                <Info size={16} />
                <span>หมายเหตุ</span>
            </div>
            ค่าที่ได้เป็นการคำนวณโดยประมาณจากสูตรการแปลงค่ามาตรฐาน:
            <ul className="list-disc list-inside mt-1 ml-1 space-y-0.5 opacity-80">
                <li>WLTP = NEDC × 0.85</li>
                <li>WLTP = CLTC × 0.82</li>
                <li>WLTP = EPA × 1.168</li>
            </ul>
            ระยะทางจริงอาจแตกต่างกันขึ้นอยู่กับรุ่นรถ, สภาพอากาศ, ความเร็ว, และพฤติกรรมการขับขี่
        </div>
    </div>
  );
};

export default NedcCalculator;