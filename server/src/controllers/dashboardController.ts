import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Interview } from '../models/Interview.js';

export class DashboardController {
  public static getStats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;

      const [interviews, completedInterviews] = await Promise.all([
        Interview.find({ userId: user._id }).sort({ createdAt: -1 }).lean(),
        Interview.find({ userId: user._id, status: 'completed' }).sort({ completedAt: -1 }).lean(),
      ]);

      const totalInterviews = interviews.length;
      const completedCount = completedInterviews.length;

      let avgScore = 0;
      let bestScore = 0;
      let avgTechScore = 0;
      let avgCodingScore = 0;
      let avgClarityScore = 0;
      let totalTimeSpentSeconds = 0;

      if (completedCount > 0) {
        const scores = completedInterviews.map((i) => i.overallScore || 0);
        bestScore = Math.max(...scores);
        avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / completedCount);
        avgTechScore = Math.round(
          completedInterviews.reduce((a, b) => a + (b.technicalScore || 0), 0) / completedCount
        );
        avgCodingScore = Math.round(
          completedInterviews.reduce((a, b) => a + (b.codingScore || 0), 0) / completedCount
        );
        avgClarityScore = Math.round(
          completedInterviews.reduce((a, b) => a + (b.clarityScore || 0), 0) / completedCount
        );
        totalTimeSpentSeconds = completedInterviews.reduce(
          (a, b) => a + (b.timeSpentSeconds || 0),
          0
        );
      }

      res.json({
        success: true,
        stats: {
          totalInterviews,
          completedInterviews: completedCount,
          inProgressInterviews: interviews.filter((i) => i.status === 'in_progress').length,
          avgScore,
          bestScore,
          avgTechScore,
          avgCodingScore,
          avgClarityScore,
          totalMinutesSpent: Math.round(totalTimeSpentSeconds / 60),
          recentInterviews: interviews.slice(0, 5),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static getPerformance = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;

      const completed = await Interview.find({ userId: user._id, status: 'completed' })
        .sort({ completedAt: 1 })
        .lean();

      // Temporal trend data
      const trend = completed.map((item, index) => ({
        id: item._id,
        index: index + 1,
        date: item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'N/A',
        role: item.role,
        technology: item.technology,
        overallScore: item.overallScore || 0,
        technicalScore: item.technicalScore || 0,
        codingScore: item.codingScore || 0,
        clarityScore: item.clarityScore || 0,
      }));

      // Skills Breakdown (DSA, OOP, DBMS, OS, Computer Networks, System Design, Programming, Web Dev)
      const skillCategories = [
        'DSA',
        'OOP',
        'DBMS',
        'Operating Systems',
        'Computer Networks',
        'System Design',
        'Programming',
        'Web Development',
      ];

      // Aggregate scores per category or calculate realistic distribution from history
      const skillScores: Record<string, number> = {
        DSA: 85,
        OOP: 80,
        DBMS: 78,
        'Operating Systems': 75,
        'Computer Networks': 72,
        'System Design': 82,
        Programming: 90,
        'Web Development': 88,
      };

      // Modulate skill scores dynamically if user has completed interviews
      if (completed.length > 0) {
        const avg = Math.round(completed.reduce((a, b) => a + (b.overallScore || 0), 0) / completed.length);
        const techAvg = Math.round(completed.reduce((a, b) => a + (b.technicalScore || 0), 0) / completed.length);
        const codeAvg = Math.round(completed.reduce((a, b) => a + (b.codingScore || 0), 0) / completed.length);

        skillScores.DSA = Math.min(100, Math.max(50, codeAvg + 2));
        skillScores.Programming = Math.min(100, Math.max(50, codeAvg));
        skillScores['Web Development'] = Math.min(100, Math.max(50, techAvg + 3));
        skillScores['System Design'] = Math.min(100, Math.max(50, techAvg - 2));
        skillScores.OOP = Math.min(100, Math.max(50, avg - 4));
        skillScores.DBMS = Math.min(100, Math.max(50, techAvg - 6));
        skillScores['Operating Systems'] = Math.min(100, Math.max(50, techAvg - 8));
        skillScores['Computer Networks'] = Math.min(100, Math.max(50, techAvg - 10));
      }

      const radarData = skillCategories.map((skill) => ({
        skill,
        score: skillScores[skill] || 75,
      }));

      // Difficulty distribution
      const difficultyDistribution = {
        Easy: completed.filter((i) => i.difficulty === 'Easy').length,
        Medium: completed.filter((i) => i.difficulty === 'Medium').length,
        Hard: completed.filter((i) => i.difficulty === 'Hard').length,
      };

      res.json({
        success: true,
        trend,
        radarData,
        difficultyDistribution,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getRecommendations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;

      const completed = await Interview.find({ userId: user._id, status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(5)
        .lean();

      // Aggregate all weaknesses and roadmaps
      const allWeaknesses = completed.flatMap((i) => i.weaknessesSummary || []);
      const allRoadmaps = completed.flatMap((i) => i.recommendedRoadmap || []);

      const topWeaknesses = Array.from(new Set(allWeaknesses)).slice(0, 5);
      const topRoadmaps = Array.from(new Set(allRoadmaps)).slice(0, 5);

      res.json({
        success: true,
        recommendedAreas: topWeaknesses.length > 0 ? topWeaknesses : [
          'Memory lifecycle analysis and garbage collection profiling',
          'Concurrency models and distributed lock contention',
          'Edge case verification and defensive input constraints',
        ],
        actionItems: topRoadmaps.length > 0 ? topRoadmaps : [
          'Solve 5 medium-difficulty Sliding Window & Monotonic Stack challenges',
          'Read through PostgreSQL documentation on indexing and B+ Tree scans',
          'Conduct a 30-minute timed mock interview in System Design',
        ],
      });
    } catch (error) {
      next(error);
    }
  };
}
