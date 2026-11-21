import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export function FeedbackModal({ isOpen, onClose, complaint, onSubmitFeedback, onReopen }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [wasFixed, setWasFixed] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    onSubmitFeedback(complaint.id, {
      rating,
      comment: comment || (wasFixed ? 'Issue verified resolved cleanly.' : 'Issue persists.'),
      wasFixed
    });

    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Resolution Feedback
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ticket {complaint.id} • {complaint.room}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Question: Was the problem actually fixed? */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
              Was the problem actually fixed?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWasFixed(true)}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                  wasFixed
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                <span>Yes, fully fixed!</span>
              </button>

              <button
                type="button"
                onClick={() => setWasFixed(false)}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                  !wasFixed
                    ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ThumbsDown className="w-4 h-4 text-rose-500" />
                <span>No, still broken</span>
              </button>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Rate Maintenance Resolution (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Feedback Comments
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., The technician arrived quickly and replaced the fan switch. Working perfectly now!"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Warning banner if No */}
          {!wasFixed && (
            <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-rose-900 dark:text-rose-200 leading-relaxed">
                If the problem is still unresolved, you can also <strong>Reopen</strong> this ticket immediately so maintenance is dispatched back.
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {!wasFixed && onReopen ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReopen(complaint);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
              >
                Reopen Ticket Instead
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
