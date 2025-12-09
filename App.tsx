import React, { useState } from 'react';
import Calculator from './components/Calculator';
import TripPlan from './components/TripPlan';
import NedcCalculator from './components/NedcCalculator';
import { BatteryIcon, BoltIcon } from './components/icons';

type ViewState = 'menu' | 'calculator' | 'tripPlan' | 'nedc';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('menu');

  // TripPlan handles its own full-screen layout
  if (view === 'tripPlan') {
    return <TripPlan onBack={() => setView('menu')} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {view === 'menu' && (
        <div className="w-full max-w-md space-y-6">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-sky-600 dark:text-sky-400">EV Tools</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">เลือกเครื่องมือที่ต้องการใช้งาน</p>
            </header>
            
            <button 
                onClick={() => setView('calculator')}
                className="w-full p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center space-x-5 border border-slate-200 dark:border-slate-700"
            >
                <div className="p-4 bg-sky-100 dark:bg-sky-900/50 rounded-full text-sky-600 dark:text-sky-400">
                    <BatteryIcon />
                </div>
                <div className="text-left">
                    <h2 className="text-xl font-bold">เครื่องคำนวณการชาร์จ</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">คำนวณเวลา, % แบตเตอรี่, กำลังไฟ</p>
                </div>
            </button>

            <button 
                onClick={() => setView('tripPlan')}
                className="w-full p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center space-x-5 border border-slate-200 dark:border-slate-700"
            >
                 <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 dark:text-emerald-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7" />
                     </svg>
                </div>
                <div className="text-left">
                    <h2 className="text-xl font-bold">แผนการเดินทาง</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">จัดการจุดแวะชาร์จ (Demo)</p>
                </div>
            </button>

            <button 
                onClick={() => setView('nedc')}
                className="w-full p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center space-x-5 border border-slate-200 dark:border-slate-700"
            >
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
                     <BoltIcon />
                </div>
                <div className="text-left">
                    <h2 className="text-xl font-bold">คำนวณ NEDC</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">แปลงมาตรฐานระยะทาง EV</p>
                </div>
            </button>
        </div>
      )}

      {view === 'calculator' && (
        <div className="w-full flex flex-col items-center max-w-lg">
             <div className="w-full flex items-center justify-between mb-6">
                <button 
                    onClick={() => setView('menu')}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับ
                </button>
            </div>
            
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold text-sky-600 dark:text-sky-400">เครื่องคำนวณการชาร์จ</h1>
                 <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                    ทิ้งว่าง 1 ช่องเพื่อให้ระบบคำนวณอัตโนมัติ
                </p>
            </header>
            <Calculator />
        </div>
      )}

      {view === 'nedc' && (
         <div className="w-full max-w-lg flex flex-col items-center">
            <NedcCalculator onBack={() => setView('menu')} />
         </div>
      )}
      
      {view !== 'tripPlan' && (
        <footer className="text-center mt-12 text-sm text-slate-500">
            <p>สร้างขึ้นเพื่อการประเมินเบื้องต้นเท่านั้น</p>
        </footer>
      )}
    </div>
  );
};

export default App;