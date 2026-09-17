import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN as any }
  );
};

export class AuthController {
  public static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, targetRole, experienceLevel, skills } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Please provide name, email, and password',
        });
        return;
      }

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
        return;
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        targetRole: targetRole || 'Software Engineer',
        experienceLevel: experienceLevel || 'Mid-Level',
        skills: skills || ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      });

      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Please provide email and password',
        });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static demoLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let user = await User.findOne({ email: 'demo@antiview.dev' });
      if (!user) {
        user = await User.create({
          name: 'Alex Chen',
          email: 'demo@antiview.dev',
          password: 'DemoPassword123!',
          role: 'candidate',
          targetRole: 'Full Stack Engineer',
          experienceLevel: 'Senior',
          skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design'],
        });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: 'Demo session active',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { name, targetRole, experienceLevel, skills } = req.body;
      if (name) user.name = name;
      if (targetRole) user.targetRole = targetRole;
      if (experienceLevel) user.experienceLevel = experienceLevel;
      if (skills && Array.isArray(skills)) user.skills = skills;

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
