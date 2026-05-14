import { useState, useMemo } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';

export interface CalculatorField {
  id: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  default?: number;
  description?: string;
}

export interface CalculatorResult {
  score: number;
  interpretation: string;
  details?: string;
}

interface CalculatorProps {
  title: string;
  description: string;
  fields: CalculatorField[];
  calculate: (values: Record<string, number>) => CalculatorResult;
  resultColor?: 'success' | 'warning' | 'danger' | 'info';
}

export default function Calculator({
  title,
  description,
  fields,
  calculate,
  resultColor = 'info',
}: CalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    fields.forEach((field) => {
      initial[field.id] = field.default !== undefined ? field.default : field.min;
    });
    return initial;
  });

  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    return calculate(values);
  }, [values, calculate]);

  const handleValueChange = (fieldId: string, newValue: number) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: newValue,
    }));
    setShowResult(false);
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    const reset: Record<string, number> = {};
    fields.forEach((field) => {
      reset[field.id] = field.default !== undefined ? field.default : field.min;
    });
    setValues(reset);
    setShowResult(false);
  };

  const colorClasses = {
    success: 'bg-clinical-success',
    warning: 'bg-clinical-warning',
    danger: 'bg-clinical-danger',
    info: 'bg-clinical-info',
  };

  const colorBgClasses = {
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50',
  };

  const colorBorderClasses = {
    success: 'border-green-200',
    warning: 'border-yellow-200',
    danger: 'border-red-200',
    info: 'border-blue-200',
  };

  const colorTextClasses = {
    success: 'text-green-800',
    warning: 'text-yellow-800',
    danger: 'text-red-800',
    info: 'text-blue-800',
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <CalculatorIcon className="w-6 h-6 text-accent-500" />
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Input Fields */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.id}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-900">
                  {field.label}
                  {field.unit && <span className="text-gray-500 text-xs ml-1">({field.unit})</span>}
                </label>
                <span className="text-sm font-semibold text-accent-600">
                  {values[field.id]}
                  {field.unit && <span className="text-gray-500 ml-1">{field.unit}</span>}
                </span>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step || 1}
                value={values[field.id]}
                onChange={(e) => handleValueChange(field.id, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
                aria-label={field.label}
              />

              {/* Min/Max Labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{field.min}</span>
                <span>{field.max}</span>
              </div>

              {/* Description */}
              {field.description && (
                <p className="text-xs text-gray-600 mt-2">{field.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleCalculate}
            className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-white ${colorClasses[resultColor]} hover:opacity-90`}
          >
            Calculate
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 font-medium rounded-lg transition-colors bg-gray-200 text-gray-900 hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Result Display */}
      {showResult && (
        <div className={`border-2 ${colorBorderClasses[resultColor]} ${colorBgClasses[resultColor]} rounded-lg p-6 transition-all animate-in`}>
          <h3 className={`text-lg font-semibold ${colorTextClasses[resultColor]} mb-2`}>
            Result
          </h3>

          {/* Score Display */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Score</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${colorTextClasses[resultColor]}`}>
                {result.score}
              </span>
              <span className={`text-sm ${colorTextClasses[resultColor]}`}>points</span>
            </div>
          </div>

          {/* Interpretation */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Interpretation</p>
            <p className={`text-base font-medium ${colorTextClasses[resultColor]}`}>
              {result.interpretation}
            </p>
          </div>

          {/* Additional Details */}
          {result.details && (
            <div className={`pt-4 border-t-2 ${colorBorderClasses[resultColor]}`}>
              <p className="text-sm text-gray-700">{result.details}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
