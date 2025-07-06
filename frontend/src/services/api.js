const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    // Only log errors, not every request
    try {
      const response = await fetch(url, config);
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          console.error('API Error:', data.message);
          throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned invalid response');
      }
    } catch (error) {
      console.error('API Request Error:', error.message);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Ticket methods
  async getTickets() {
    return this.request('/tickets');
  }

  async createTicket(ticketData) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  }

  async getTicketById(id) {
    return this.request(`/tickets/${id}`);
  }

  async updateTicket(id, updateData) {
    // Remove debugging logs
    return this.request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async addComment(ticketId, commentData) {
    return this.request(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  // Image upload methods
  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Uploading single image:', imageFile.name);

    try {
      const response = await fetch(`${this.baseURL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  async uploadImages(imageFiles) {
    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Uploading multiple images:', imageFiles.length);

    try {
      const response = await fetch(`${this.baseURL}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Images upload error:', error);
      throw error;
    }
  }

  // Search and filter methods
  async searchTickets(searchTerm, filters = {}) {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    return this.request(`/tickets/search?${params.toString()}`);
  }

  async getAgents() {
    return this.request('/users/agents');
  }
}

const apiService = new ApiService();
export default apiService;
