'use client';

interface SaveBarProps {
  isDirty: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export default function SaveBar({ isDirty, isSubmitting, onSave, onDiscard }: SaveBarProps) {
  if (!isDirty) return null;

  return (
    <div className="fixed bottom-0 left-0 lg:left-56 right-0 z-50 animate-slide-up">
      <div className="bg-gray-900 border-t border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-end gap-2 sm:gap-3 shadow-2xl">
        <span className="text-xs sm:text-sm text-gray-400 mr-auto">Unsaved changes</span>
        <button
          type="button"
          onClick={onDiscard}
          className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-transparent border border-gray-600 hover:border-gray-500 px-3 sm:px-4 py-2 rounded-lg transition-colors"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className="text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 px-4 sm:px-6 py-2 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
