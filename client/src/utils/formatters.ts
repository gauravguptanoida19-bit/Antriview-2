export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds || seconds <= 0) return '0m';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
};

export const getScoreBadgeColor = (score: number): string => {
  if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (score >= 70) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'hard':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};
