import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interviewApi } from '../services/api';
import { IInterview } from '../types';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { formatDate, formatDuration, getScoreBadgeColor, getStatusColor, getDifficultyColor } from '../utils/formatters';

export const HistoryPage: React.FC = () => {
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewApi.getAll({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        interviewType: typeFilter !== 'all' ? typeFilter : undefined,
        sortBy,
        order,
        page,
        limit: 8,
      });

      if (res.success) {
        setInterviews(res.interviews);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [page, statusFilter, difficultyFilter, typeFilter, sortBy, order]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInterviews();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this interview record?')) {
      try {
        await interviewApi.delete(id);
        fetchInterviews();
      } catch (err) {
        alert('Failed to delete interview record.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Interview History & Records
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {totalCount} total sessions recorded across your interview journey
            </p>
          </div>

          <Link to="/interview/setup">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Start New Interview
            </Button>
          </Link>
        </div>

        {/* Filter / Search Deck */}
        <Card className="p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role, technology (e.g. React, Python)..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <Button type="submit" variant="secondary" size="sm">
              Search
            </Button>
          </form>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 text-xs">
            <span className="text-gray-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Interview Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Modes</option>
              <option value="combined">Combined</option>
              <option value="coding">Coding</option>
              <option value="technical">Technical</option>
              <option value="voice">Voice</option>
            </select>

            {/* Sort Filter */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-gray-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
              >
                <option value="createdAt">Date Created</option>
                <option value="overallScore">Overall Score</option>
                <option value="durationMinutes">Duration</option>
              </select>

              <button
                onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                title={`Sort ${order === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {order === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
          </div>
        </Card>

        {/* Interviews List Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : interviews.length === 0 ? (
          <EmptyState
            title="No interview records found"
            description="Try changing your search keywords or clear filters."
            actionText="Launch an Interview"
            onAction={() => (window.location.href = '/interview/setup')}
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-900/80 text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Tech Domain</th>
                    <th className="py-3 px-4 font-semibold">Mode / Rigor</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Duration</th>
                    <th className="py-3 px-4 font-semibold">Score</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {interviews.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-gray-500 font-mono">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-gray-100">
                        {item.role}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-medium">
                        {item.technology}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="capitalize text-gray-400">{item.interviewType}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-mono">
                        {formatDuration(item.timeSpentSeconds || item.durationMinutes * 60)}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {item.status === 'completed' ? (
                          <span className={`px-2 py-0.5 rounded border ${getScoreBadgeColor(item.overallScore)}`}>
                            {item.overallScore}%
                          </span>
                        ) : (
                          <span className="text-gray-500 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={
                              item.status === 'completed'
                                ? `/history/${item._id}`
                                : `/interview/${item._id}`
                            }
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-white"
                            title="Open Assessment Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>
                  Page {page} of {totalPages} ({totalCount} items)
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                    leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
