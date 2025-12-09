
import React from 'react';
import { SparklesIcon } from './icons';

interface InputGroupProps {
  label: string;
  unit: string;
  icon: React.ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  isCalculated?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  unit,
  icon,
  value,
  onChange,
  placeholder,
  isCalculated = false,
}) => {
  const calculatedClasses = isCalculated 
    ? 'opacity-75' 
    : '';

  return (
    <div className={`flex flex-col ${calculatedClasses}`}>
      <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {icon}
        <span className="ml-2">{label}</span>
        {isCalculated && (
            <span className="ml-2 text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 py-0.5 px-2 rounded-full flex items-center">
                <SparklesIcon /> <span className="ml-1">คำนวณแล้ว</span>
            </span>
        )}
      </label>
      <div className="relative">
        <input
          type="number"
          min="0"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isCalculated}
          className="w-full pl-4 pr-14 py-2.5 text-slate-900 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-slate-400 font-medium">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default InputGroup;
