import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Interview, IInterview } from '../models/Interview.js';
import { GeminiService } from '../services/geminiService.js';
import { CodeExecutionService } from '../services/codeExecutionService.js';

export class InterviewController {
  public static createInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const {
        role = 'Software Engineer',
        technology = 'JavaScript',
        difficulty = 'Medium',
        interviewType = 'technical',
        questionCount = 3,
        durationMinutes = 30,
      } = req.body;

      // Generate dynamic questions using Gemini
      console.log(`🤖 [InterviewController] Generating ${questionCount} questions for ${role} (${technology}, ${difficulty}, ${interviewType})...`);
      const questions = await GeminiService.generateQuestions(
        role,
        technology,
        difficulty,
        interviewType,
        Number(questionCount) || 3
      );

      const interview = await Interview.create({
        userId: user._id,
        role,
        technology,
        difficulty,
        interviewType,
        durationMinutes: Number(durationMinutes) || 30,
        questions,
        status: 'pending',
        currentQuestionIndex: 0,
      });

      res.status(201).json({
        success: true,
        message: 'Interview session created successfully',
        interview,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getInterviews = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const {
        status,
        difficulty,
        role,
        interviewType,
        search,
        sortBy = 'createdAt',
        order = 'desc',
        page = 1,
        limit = 10,
      } = req.query;

      const query: any = { userId: user._id };

      if (status && status !== 'all') {
        query.status = status;
      }
      if (difficulty && difficulty !== 'all') {
        query.difficulty = difficulty;
      }
      if (interviewType && interviewType !== 'all') {
        query.interviewType = interviewType;
      }
      if (role && role !== 'all') {
        query.role = { $regex: String(role), $options: 'i' };
      }
      if (search) {
        query.$or = [
          { role: { $regex: String(search), $options: 'i' } },
          { technology: { $regex: String(search), $options: 'i' } },
        ];
      }

      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Math.min(100, Number(limit)));
      const skip = (pageNum - 1) * limitNum;

      const sortOptions: any = {};
      sortOptions[String(sortBy)] = order === 'asc' ? 1 : -1;

      const [interviews, total] = await Promise.all([
        Interview.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Interview.countDocuments(query),
      ]);

      res.json({
        success: true,
        interviews,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static getInterviewById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const interview = await Interview.findOne({ _id: id, userId: user._id });
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview session not found',
        });
        return;
      }

      res.json({
        success: true,
        interview,
      });
    } catch (error) {
      next(error);
    }
  };

  public static updateInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { currentQuestionIndex, timeSpentSeconds, status } = req.body;

      const interview = await Interview.findOne({ _id: id, userId: user._id });
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview session not found',
        });
        return;
      }

      if (typeof currentQuestionIndex === 'number') {
        interview.currentQuestionIndex = currentQuestionIndex;
      }
      if (typeof timeSpentSeconds === 'number') {
        interview.timeSpentSeconds = timeSpentSeconds;
      }
      if (status) {
        interview.status = status;
      }

      await interview.save();

      res.json({
        success: true,
        interview,
      });
    } catch (error) {
      next(error);
    }
  };

  public static deleteInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const result = await Interview.findOneAndDelete({ _id: id, userId: user._id });
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Interview session not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Interview session deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public static startInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const interview = await Interview.findOne({ _id: id, userId: user._id });
      if (!interview) {
        res.status(404).json({ success: false, message: 'Interview session not found' });
        return;
      }

      interview.status = 'in_progress';
      if (!interview.startedAt) {
        interview.startedAt = new Date();
      }
      await interview.save();

      res.json({
        success: true,
        message: 'Interview session started',
        interview,
      });
    } catch (error) {
      next(error);
    }
  };

  public static submitAnswer = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { questionIndex, answer } = req.body;

      const interview = await Interview.findOne({ _id: id, userId: user._id });
      if (!interview) {
        res.status(404).json({ success: false, message: 'Interview session not found' });
        return;
      }

      const qIndex = Number(questionIndex);
      if (qIndex < 0 || qIndex >= interview.questions.length) {
        res.status(400).json({ success: false, message: 'Invalid question index' });
        return;
      }

      const currentQ = interview.questions[qIndex];
      currentQ.candidateAnswer = answer || '';
      currentQ.answeredAt = new Date();

      // Trigger AI evaluation with Gemini
      const evaluation = await GeminiService.evaluateAnswer(
        currentQ,
        currentQ.candidateAnswer || '',
        interview.role,
        interview.difficulty
      );

      currentQ.evaluation = evaluation;
      interview.markModified('questions');
      await interview.save();

      res.json({
        success: true,
        message: 'Answer evaluated successfully',
        evaluation,
        question: currentQ,
      });
    } catch (error) {
      next(error);
    }
  };

  public static submitCode = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { questionIndex, code, language = 'javascript', runOnly = false } = req.body;

      const interview = await Interview.findOne({ _id: id, userId: user._id });
      if (!interview) {
        res.status(404).json({ success: false, message: 'Interview session not found' });
        return;
      }

      const qIndex = Number(questionIndex);
      if (qIndex < 0 || qIndex >= interview.questions.length) {
        res.status(400).json({ success: false, message: 'Invalid question index' });
        return;
      }

      const currentQ = interview.questions[qIndex];
      const testCases = currentQ.testCases || [];

      // Execute code safely against test cases
      const executionResult = CodeExecutionService.executeCode(code, language, testCases);

      currentQ.codeAnswer = code;
      currentQ.language = language;
      currentQ.codeExecutionResult = executionResult;

      let evaluation = currentQ.evaluation;

      // If this is a final submission (not just a "Run Tests" check), evaluate with Gemini
      if (!runOnly) {
        evaluation = await GeminiService.evaluateCode(
          currentQ,
          code,
          language,
          executionResult
        );
        currentQ.evaluation = evaluation;
        currentQ.answeredAt = new Date();
      }

      interview.markModified('questions');
      await interview.save();

      res.json({
        success: true,
        message: runOnly ? 'Tests executed' : 'Code evaluated successfully',
        executionResult,
        evaluation,
      });
    } catch (error) {
      next(error);
    }
  };

  public static completeInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { timeSpentSeconds } = req.body;

      const interview = await Interview.findOne({ _id: id, userId: user._id });
      if (!interview) {
        res.status(404).json({ success: false, message: 'Interview session not found' });
        return;
      }

      interview.status = 'completed';
      interview.completedAt = new Date();
      if (typeof timeSpentSeconds === 'number') {
        interview.timeSpentSeconds = timeSpentSeconds;
      }

      // Generate aggregate metrics, summary, strengths, weaknesses & roadmap with Gemini
      const summary = await GeminiService.generateInterviewSummary(interview);

      interview.overallScore = summary.overallScore;
      interview.technicalScore = summary.technicalScore;
      interview.codingScore = summary.codingScore;
      interview.clarityScore = summary.clarityScore;
      interview.overallFeedback = summary.overallFeedback;
      interview.strengthsSummary = summary.strengthsSummary;
      interview.weaknessesSummary = summary.weaknessesSummary;
      interview.recommendedRoadmap = summary.recommendedRoadmap;

      await interview.save();

      res.json({
        success: true,
        message: 'Interview completed and evaluated',
        interview,
      });
    } catch (error) {
      next(error);
    }
  };
}
