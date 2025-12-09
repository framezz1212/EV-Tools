import React, { useState, useEffect, useCallback } from 'react';
import InputGroup from './InputGroup';
import { BatteryIcon, BoltIcon, ClockIcon, PercentIcon, SparklesIcon, TargetIcon, CheckCircleIcon } from './icons';

const Calculator: React.FC = () => {
  const [totalCapacity, setTotalCapacity] = useState<string>('75.3');
  const [chargingSpeed, setChargingSpeed] = useState<string>('6.9');
  const [startSoc, setStartSoc] = useState<string>('20');
  const [targetSoc, setTargetSoc] = useState<string>('');
  const [timeHours, setTimeHours] = useState<string>('');
  const [timeMinutes, setTimeMinutes] = useState<string>('');
  const [startTimeHours, setStartTimeHours] = useState<string>('');
  const [startTimeMinutes, setStartTimeMinutes] = useState<string>('');

  const [calculatedTime, setCalculatedTime] = useState<{ h: number; m: number } | null>(null);
  const [calculatedTargetSoc, setCalculatedTargetSoc] = useState<number | null>(null);
  const [calculatedSpeed, setCalculatedSpeed] = useState<number | null>(null);
  const [calculatedEndTime, setCalculatedEndTime] = useState<{ h: number; m: number } | null>(null);
  const [fieldToCalculate, setFieldToCalculate] = useState<string | null>(null);

  useEffect(() => {
    const numCapacity = parseFloat(totalCapacity);
    const numStartSoc = parseFloat(startSoc);

    // Reset calculated values for each run
    setCalculatedTime(null);
    setCalculatedTargetSoc(null);
    setCalculatedSpeed(null);
    setFieldToCalculate(null);

    // Basic validation
    if (isNaN(numCapacity) || numCapacity <= 0 || isNaN(numStartSoc) || numStartSoc < 0 || numStartSoc > 100) {
      return;
    }

    const isSpeedEmpty = chargingSpeed.trim() === '';
    const isTargetSocEmpty = targetSoc.trim() === '';
    const isTimeEmpty = timeHours.trim() === '' && timeMinutes.trim() === '';
    
    const emptyFields = [];
    if (isSpeedEmpty) emptyFields.push('speed');
    if (isTargetSocEmpty) emptyFields.push('targetSoc');
    if (isTimeEmpty) emptyFields.push('time');

    if (emptyFields.length !== 1) {
      return;
    }

    const field = emptyFields[0];
    setFieldToCalculate(field);

    switch (field) {
      case 'time': {
        const numTargetSoc = parseFloat(targetSoc);
        const numSpeed = parseFloat(chargingSpeed);
        if (isNaN(numTargetSoc) || isNaN(numSpeed) || numSpeed <= 0 || numTargetSoc <= numStartSoc) {
          setCalculatedTime({ h: 0, m: 0 });
          return;
        }
        const energyNeeded = ((numTargetSoc - numStartSoc) / 100) * numCapacity;
        const timeInHours = energyNeeded / numSpeed;
        const totalMinutes = Math.round(timeInHours * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        setCalculatedTime({ h, m });
        break;
      }
      case 'targetSoc': {
        const numSpeed = parseFloat(chargingSpeed);
        const h = parseInt(timeHours || '0', 10);
        const m = parseInt(timeMinutes || '0', 10);
        const totalTimeInHours = h + m / 60;
        if (isNaN(numSpeed) || numSpeed <= 0 || totalTimeInHours <= 0) {
          setCalculatedTargetSoc(Math.round(numStartSoc));
          return;
        }
        const energyAdded = numSpeed * totalTimeInHours;
        const socAdded = (energyAdded / numCapacity) * 100;
        let finalSoc = numStartSoc + socAdded;
        if (finalSoc > 100) finalSoc = 100;
        setCalculatedTargetSoc(Math.round(finalSoc));
        break;
      }
      case 'speed': {
        const numTargetSoc = parseFloat(targetSoc);
        const h = parseInt(timeHours || '0', 10);
        const m = parseInt(timeMinutes || '0', 10);
        const totalTimeInHours = h + m / 60;
        if (isNaN(numTargetSoc) || numTargetSoc <= numStartSoc || totalTimeInHours <= 0) {
          setCalculatedSpeed(0);
          return;
        }
        const energyNeeded = ((numTargetSoc - numStartSoc) / 100) * numCapacity;
        const speed = energyNeeded / totalTimeInHours;
        setCalculatedSpeed(parseFloat(speed.toFixed(2)));
        break;
      }
      default:
        break;
    }
  }, [totalCapacity, chargingSpeed, startSoc, targetSoc, timeHours, timeMinutes]);

  useEffect(() => {
    if (fieldToCalculate === 'time' && calculatedTime && startTimeHours.trim() !== '' && startTimeMinutes.trim() !== '') {
        const startH = parseInt(startTimeHours, 10);
        const startM = parseInt(startTimeMinutes, 10);

        if (!isNaN(startH) && !isNaN(startM) && startH >= 0 && startH < 24 && startM >= 0 && startM < 60) {
            const totalStartMinutes = startH * 60 + startM;
            const totalChargeMinutes = calculatedTime.h * 60 + calculatedTime.m;
            const totalEndMinutes = totalStartMinutes + totalChargeMinutes;

            const endH = Math.floor(totalEndMinutes / 60) % 24;
            const endM = totalEndMinutes % 60;

            setCalculatedEndTime({ h: endH, m: endM });
        } else {
            setCalculatedEndTime(null);
        }
    } else {
        setCalculatedEndTime(null);
    }
  }, [calculatedTime, startTimeHours, startTimeMinutes, fieldToCalculate]);
  
  const handleReset = useCallback(() => {
    setTotalCapacity('75.3');
    setChargingSpeed('6.9');
    setStartSoc('20');
    setTargetSoc('');
    setTimeHours('');
    setTimeMinutes('');
    setStartTimeHours('');
    setStartTimeMinutes('');
  }, []);

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup
          label="ขนาดแบตเตอรี่ทั้งหมด"
          unit="kWh"
          icon={<BatteryIcon />}
          value={totalCapacity}
          onChange={(e) => setTotalCapacity(e.target.value)}
          placeholder="เช่น 75.3"
        />
        <InputGroup
          label="ความเร็วในการชาร์จ"
          unit="kW"
          icon={<BoltIcon />}
          value={fieldToCalculate === 'speed' && calculatedSpeed !== null ? String(calculatedSpeed) : chargingSpeed}
          onChange={(e) => setChargingSpeed(e.target.value)}
          placeholder="เช่น 6.9"
          isCalculated={fieldToCalculate === 'speed'}
        />
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
      <div className="space-y-6">
        <InputGroup
          label="แบตเตอรี่เริ่มต้น"
          unit="%"
          icon={<PercentIcon />}
          value={startSoc}
          onChange={(e) => setStartSoc(e.target.value)}
          placeholder="เช่น 20"
        />
        <InputGroup
          label="แบตเตอรี่เป้าหมาย"
          unit="%"
          icon={<TargetIcon />}
          value={fieldToCalculate === 'targetSoc' && calculatedTargetSoc !== null ? String(calculatedTargetSoc) : targetSoc}
          onChange={(e) => setTargetSoc(e.target.value)}
          placeholder="เช่น 80"
          isCalculated={fieldToCalculate === 'targetSoc'}
        />
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <ClockIcon />
            <span className="ml-2">เวลาที่เริ่มชาร์จ</span>
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
               <input
                type="number"
                min="0"
                max="23"
                value={startTimeHours}
                onChange={(e) => setStartTimeHours(e.target.value)}
                placeholder="ชั่วโมง"
                className="w-full pl-4 pr-12 py-2.5 text-slate-900 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400">ชม.</span>
            </div>
            <div className="relative flex-1">
               <input
                type="number"
                min="0"
                max="59"
                value={startTimeMinutes}
                onChange={(e) => setStartTimeMinutes(e.target.value)}
                placeholder="นาที"
                className="w-full pl-4 pr-12 py-2.5 text-slate-900 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
               <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400">นาที</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <ClockIcon />
            <span className="ml-2">เวลาที่ใช้ชาร์จ</span>
            {fieldToCalculate === 'time' && (
                <span className="ml-2 text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 py-0.5 px-2 rounded-full flex items-center">
                  <SparklesIcon /> <span className="ml-1">คำนวณแล้ว</span>
                </span>
             )}
          </label>
          <div className="flex items-center space-x-2">
            <div className={`relative flex-1 ${fieldToCalculate === 'time' ? 'opacity-75' : ''}`}>
               <input
                type="number"
                min="0"
                value={fieldToCalculate === 'time' && calculatedTime !== null ? calculatedTime.h : timeHours}
                onChange={(e) => setTimeHours(e.target.value)}
                placeholder="ชั่วโมง"
                disabled={fieldToCalculate === 'time'}
                className="w-full pl-4 pr-12 py-2.5 text-slate-900 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400">ชม.</span>
            </div>
            <div className={`relative flex-1 ${fieldToCalculate === 'time' ? 'opacity-75' : ''}`}>
               <input
                type="number"
                min="0"
                max="59"
                value={fieldToCalculate === 'time' && calculatedTime !== null ? calculatedTime.m : timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
                placeholder="นาที"
                disabled={fieldToCalculate === 'time'}
                className="w-full pl-4 pr-12 py-2.5 text-slate-900 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
               <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400">นาที</span>
            </div>
          </div>
        </div>
      </div>

      {calculatedEndTime && (
        <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-700 rounded-lg flex items-center justify-center text-center">
            <CheckCircleIcon />
            <div className="ml-3">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">เวลาที่ชาร์จเสร็จโดยประมาณ</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                    {String(calculatedEndTime.h).padStart(2, '0')}:{String(calculatedEndTime.m).padStart(2, '0')} น.
                </p>
            </div>
        </div>
      )}

       <button
        onClick={handleReset}
        className="w-full mt-4 py-3 px-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-300"
      >
        รีเซ็ต
      </button>

    </div>
  );
};

export default Calculator;