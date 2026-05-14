import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react';

export interface ChecklistStep {
  id: string;
  title: string;
  description?: string;
  warning?: string;
}

interface ProcedureChecklistProps {
  steps: ChecklistStep[];
  title: string;
  onComplete?: (completedSteps: string[]) => void;
}

export default function ProcedureChecklist({
  steps,
  title,
  onComplete,
}: ProcedureChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const progressPercent = useMemo(() => {
    if (steps.length === 0) return 0;
    return Math.round((completedSteps.size / steps.length) * 100);
  }, [completedSteps, steps]);

  const isAllComplete = completedSteps.size === steps.length;

  const handleToggleStep = (stepId: string) => {
    const updated = new Set(completedSteps);
    if (updated.has(stepId)) {
      updated.delete(stepId);
    } else {
      updated.add(stepId);
    }
    setCompletedSteps(updated);

    // Call callback with updated completed steps
    if (onComplete) {
      onComplete(Array.from(updated));
    }
  };

  const handleReset = () => {
    setCompletedSteps(new Set());
    if (onComplete) {
      onComplete([]);
    }
  };

  const handleCompleteAll = () => {
    const allSteps = new Set(steps.map((s) => s.id));
    setCompletedSteps(allSteps);
    if (onComplete) {
      onComplete(Array.from(allSteps));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-accent-600">
              {completedSteps.size} of {steps.length} ({progressPercent}%)
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="bg-accent-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Completion Message */}
        {isAllComplete && (
          <div className="bg-clinical-success bg-opacity-10 border border-clinical-success rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-clinical-success">
              ✓ All steps completed! Review before proceeding.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isAllComplete && (
            <button
              onClick={handleCompleteAll}
              className="px-4 py-2 text-sm font-medium bg-clinical-success hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Complete All
            </button>
          )}
          {completedSteps.size > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {steps.map((step) => {
          const isCompleted = completedSteps.has(step.id);

          return (
            <div key={step.id}>
              <button
                onClick={() => handleToggleStep(step.id)}
                className="w-full text-left bg-white border border-gray-300 hover:border-accent-500 hover:bg-accent-50 rounded-lg p-4 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox Icon */}
                  <div className="flex-shrink-0 pt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-clinical-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 group-hover:text-accent-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base font-medium transition-all ${
                        isCompleted
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900 group-hover:text-accent-600'
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    {step.description && (
                      <p
                        className={`text-sm mt-1 transition-colors ${
                          isCompleted ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {step.description}
                      </p>
                    )}

                    {/* Warning */}
                    {step.warning && !isCompleted && (
                      <div className="mt-2 p-2 bg-clinical-warning bg-opacity-10 border border-clinical-warning border-opacity-30 rounded">
                        <p className="text-xs font-medium text-clinical-warning">
                          ⚠️ {step.warning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {steps.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No steps defined for this checklist.</p>
        </div>
      )}

      {/* Footer Summary */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-accent-600">{completedSteps.size}</p>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-400">{steps.length - completedSteps.size}</p>
            <p className="text-xs text-gray-600 mt-1">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}
