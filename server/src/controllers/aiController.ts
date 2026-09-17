import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { GeminiService } from '../services/geminiService.js';
import { CodeExecutionService } from '../services/codeExecutionService.js';

export class AIController {
  public static generateQuestion = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        role = 'Full Stack Developer',
        technology = 'React',
        difficulty = 'Medium',
        interviewType = 'technical',
      } = req.body;

      const questions = await GeminiService.generateQuestions(
        role,
        technology,
        difficulty,
        interviewType,
        1
      );

      res.json({
        success: true,
        question: questions[0],
      });
    } catch (error) {
      next(error);
    }
  };

  public static evaluateAnswer = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { question, answer, role = 'Software Engineer', difficulty = 'Medium' } = req.body;

      if (!question || !answer) {
        res.status(400).json({
          success: false,
          message: 'Both question and answer are required for evaluation',
        });
        return;
      }

      const evaluation = await GeminiService.evaluateAnswer(question, answer, role, difficulty);

      res.json({
        success: true,
        evaluation,
      });
    } catch (error) {
      next(error);
    }
  };

  public static evaluateCode = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { question, code, language = 'javascript' } = req.body;

      if (!question || !code) {
        res.status(400).json({
          success: false,
          message: 'Both question and code are required for evaluation',
        });
        return;
      }

      const testCases = question.testCases || [];
      const testResults = CodeExecutionService.executeCode(code, language, testCases);
      const evaluation = await GeminiService.evaluateCode(question, code, language, testResults);

      res.json({
        success: true,
        executionResult: testResults,
        evaluation,
      });
    } catch (error) {
      next(error);
    }
  };

  public static generateFeedback = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { interview } = req.body;

      if (!interview) {
        res.status(400).json({
          success: false,
          message: 'Interview data required',
        });
        return;
      }

      const summary = await GeminiService.generateInterviewSummary(interview);

      res.json({
        success: true,
        summary,
      });
    } catch (error) {
      next(error);
    }
  };
}
