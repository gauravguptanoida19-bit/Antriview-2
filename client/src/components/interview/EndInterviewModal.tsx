import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface EndInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
  isLoading?: boolean;
}

export const EndInterviewModal: React.FC<EndInterviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions,
  isLoading = false,
}) => {
  const isAllAnswered = answeredCount >= totalQuestions;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="End Technical Interview?" maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            {isAllAnswered ? (
              <span>
                You have completed all <strong>{totalQuestions}</strong> questions! Ready to generate
                your comprehensive AI scorecard and evaluation roadmap?
              </span>
            ) : (
              <span>
                You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
                Unanswered questions will receive zero points in the final calculation.
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Once ended, your session will be locked, your responses synthesized by Google Gemini, and
          your overall score will be recorded to your performance history.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Resume Interview
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Yes, Finish & Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
