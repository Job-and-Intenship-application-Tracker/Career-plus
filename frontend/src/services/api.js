const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('careerplus_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // 1. Applications REST API
  async getApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline or unreachable, using local state:', err);
      return null;
    }
  },

  async createApplication(applicationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(applicationData),
      });
      if (!response.ok) throw new Error('Failed to create application');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline, saved to local state:', err);
      return null;
    }
  },

  async updateApplication(id, applicationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(applicationData),
      });
      if (!response.ok) throw new Error('Failed to update application');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline, updated local state:', err);
      return null;
    }
  },

  async deleteApplication(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline, deleted from local state:', err);
      return null;
    }
  },

  // 2. User Resumes REST API
  async getResumes() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/resumes`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch resumes');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline, using local resumes:', err);
      return null;
    }
  },

  async createResume(resumeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/resumes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resumeData),
      });
      if (!response.ok) throw new Error('Failed to save resume');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline, saved local resume:', err);
      return null;
    }
  },

  async deleteResume(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/resumes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline, deleted local resume:', err);
      return null;
    }
  }
};
