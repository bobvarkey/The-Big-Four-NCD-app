import { useState, useMemo } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';

export interface DecisionNode {
  id: string;
  type: 'decision' | 'outcome';
  question?: string;
  text?: string;
  yesLabel?: string;
  noLabel?: string;
  yesNext?: string;
  noNext?: string;
}

interface DecisionTreeProps {
  nodes: Record<string, DecisionNode>;
  startNodeId: string;
  title: string;
}

export default function DecisionTree({ nodes, startNodeId, title }: DecisionTreeProps) {
  const [currentNodeId, setCurrentNodeId] = useState(startNodeId);
  const [history, setHistory] = useState<string[]>([startNodeId]);

  const currentNode = nodes[currentNodeId];

  // Calculate progress percentage
  const progressPercent = useMemo(() => {
    const totalNodes = Object.keys(nodes).length;
    const visitedNodes = new Set(history).size;
    return Math.round((visitedNodes / totalNodes) * 100);
  }, [history, nodes]);

  const handleDecision = (isYes: boolean) => {
    const nextNodeId = isYes ? currentNode.yesNext : currentNode.noNext;

    if (nextNodeId) {
      setCurrentNodeId(nextNodeId);
      setHistory([...history, nextNodeId]);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(startNodeId);
    setHistory([startNodeId]);
  };

  if (!currentNode) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Error: Node "{currentNodeId}" not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Progress: {progressPercent}% ({history.length} of {Object.keys(nodes).length} nodes visited)
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 rounded-lg"
            aria-label="Reset decision tree"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Current Node Content */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6">
        {currentNode.type === 'decision' ? (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentNode.question}</h3>

            {/* Decision Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => handleDecision(true)}
                className="flex-1 px-6 py-3 bg-clinical-success hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                disabled={!currentNode.yesNext}
              >
                {currentNode.yesLabel || 'Yes'}
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDecision(false)}
                className="flex-1 px-6 py-3 bg-clinical-danger hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                disabled={!currentNode.noNext}
              >
                {currentNode.noLabel || 'No'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-clinical-success flex items-center justify-center">
                <span className="text-white font-semibold">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Outcome Reached</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">{currentNode.text}</p>

            {/* Reset Button for Outcome */}
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Decision History */}
      {history.length > 1 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Decision History</h4>
          <div className="space-y-2">
            {history.slice(0, -1).map((nodeId, index) => {
              const node = nodes[nodeId];
              return (
                <div key={index} className="text-sm text-gray-600">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold flex items-center justify-center mr-2">
                    {index + 1}
                  </span>
                  {node.question || node.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
