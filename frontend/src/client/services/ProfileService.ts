import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  impact?: string | null;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface CareerProfile {
  id: string;
  resume_id: string;
  owner_id: string;
  projects: Project[];
  experience: Experience[];
  skills: SkillCategory[];
  extracted_at: string;
}

export interface CareerProfileUpdate {
  projects?: Project[];
  experience?: Experience[];
  skills?: SkillCategory[];
}

export class ProfileService {
  /**
   * Get Career Profile
   * @param resumeId 
   * @returns CareerProfile
   */
  public static getProfile(resumeId: string): CancelablePromise<CareerProfile> {
      return __request(OpenAPI, {
          method: 'GET',
          url: '/api/v1/resumes/{id}/profile',
          path: {
              id: resumeId
          },
          errors: {
              404: 'Profile not found',
          }
      });
  }

  /**
   * Update Career Profile
   * @param resumeId
   * @param data
   * @returns CareerProfile
   */
  public static updateProfile(resumeId: string, data: CareerProfileUpdate): CancelablePromise<CareerProfile> {
      return __request(OpenAPI, {
          method: 'PATCH',
          url: '/api/v1/resumes/{id}/profile',
          path: {
              id: resumeId
          },
          body: data,
          mediaType: 'application/json',
          errors: {
              404: 'Profile not found',
          }
      });
  }
}
