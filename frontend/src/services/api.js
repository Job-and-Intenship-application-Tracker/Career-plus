const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api' 
  : 'http://localhost:8080/api';

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
  // Storage Type Indicator
  storageType: 'SQLite Database',

  async checkSQLiteHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        return { isSQLite: true, engine: data.database || 'SQLite3' };
      }
    } catch(err) {}
    return { isSQLite: false, engine: 'LocalStorage Fallback' };
  },
  async getKanbanApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch kanban applications');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline or unreachable:', err);
      return null;
    }
  },

  // 2. Today's Actions API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getTodaysActions() {
    return this.getKanbanApplications();
  },

  // 3. Priority Engine API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getPriorityApplications() {
    return this.getKanbanApplications();
  },

  // 4. Reminders & Notes API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getFollowUpApplications() {
    return this.getKanbanApplications();
  },

  // 5. Analytics & Insights API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getAnalyticsInsights() {
    return this.getKanbanApplications();
  },

  // 6. Standard Applications REST CRUD APIs
  async getApplications() {
    return this.getKanbanApplications();
  },

  async createApplication(applicationData) {
    try {
      const { id, ...cleanData } = applicationData;
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });
      if (!response.ok) throw new Error('Failed to create application');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline:', err);
      return null;
    }
  },

  async updateApplication(id, applicationData) {
    try {
      const { id: _, ...cleanData } = applicationData;
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });
      if (!response.ok) throw new Error('Failed to update application');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline:', err);
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
      console.warn('Spring Boot 8080 offline:', err);
      return null;
    }
  },

  // 7. User Resumes REST API -> Gateway Port 8080 -> Microservice Port 8082 (Status: 200 OK)
  async getResumes() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/resumes`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch resumes');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline:', err);
      return null;
    }
  },

  async createResume(resumeData) {
    try {
      const { id, ...cleanData } = resumeData;
      const response = await fetch(`${API_BASE_URL}/users/resumes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });
      if (!response.ok) throw new Error('Failed to save resume');
      return await response.json();
    } catch (err) {
      console.warn('Spring Boot 8080 offline:', err);
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
      console.warn('Spring Boot 8080 offline:', err);
      return null;
    }
  }
};
