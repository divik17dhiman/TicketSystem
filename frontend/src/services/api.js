// Use environment variable or fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Extract the base URL without /api for upload endpoints
    this.uploadBaseURL = API_BASE_URL.replace('/api', '');
  }

  // Check if current user is in guest mode
  isGuestMode() {
    const token = localStorage.getItem('token');
    return token && token.startsWith('guest-token-');
  }

  // Mock data for guest mode
  getMockTickets() {
    return [
      {
        _id: 'mock-ticket-1',
        title: 'Login Issue with Mobile App',
        description: 'I am unable to login to the mobile application. The login button is not responding when I tap it. This has been happening since yesterday.',
        category: 'technical',
        priority: 'high',
        status: 'open',
        user: {
          _id: 'guest-user-id',
          name: 'Guest User',
          email: 'guest@example.com'
        },
        createdAt: '2024-01-15T10:30:00Z',
        comments: [
          {
            _id: 'comment-1',
            message: 'Thank you for reporting this issue. We are looking into it.',
            user: {
              _id: 'agent-1',
              name: 'Support Agent',
              email: 'agent@company.com',
              role: 'agent'
            },
            createdAt: '2024-01-15T11:00:00Z'
          }
        ],
        images: []
      },
      {
        _id: 'mock-ticket-2',
        title: 'Billing Discrepancy',
        description: 'There seems to be an error in my latest bill. I was charged twice for the same service.',
        category: 'billing',
        priority: 'medium',
        status: 'in-progress',
        user: {
          _id: 'guest-user-id',
          name: 'Guest User',
          email: 'guest@example.com'
        },
        assignedTo: {
          _id: 'agent-2',
          name: 'Billing Specialist',
          email: 'billing@company.com'
        },
        createdAt: '2024-01-14T14:20:00Z',
        comments: [],
        images: []
      },
      {
        _id: 'mock-ticket-3',
        title: 'Feature Request: Dark Mode',
        description: 'It would be great to have a dark mode option in the application for better user experience.',
        category: 'general',
        priority: 'low',
        status: 'resolved',
        user: {
          _id: 'guest-user-id',
          name: 'Guest User',
          email: 'guest@example.com'
        },
        createdAt: '2024-01-13T09:15:00Z',
        comments: [
          {
            _id: 'comment-2',
            message: 'Great suggestion! We have added this to our roadmap.',
            user: {
              _id: 'admin-1',
              name: 'Product Manager',
              email: 'pm@company.com',
              role: 'admin'
            },
            createdAt: '2024-01-14T16:30:00Z'
          },
          {
            _id: 'comment-3',
            message: 'Dark mode has been implemented in version 2.1.0',
            user: {
              _id: 'admin-1',
              name: 'Product Manager',
              email: 'pm@company.com',
              role: 'admin'
            },
            createdAt: '2024-01-15T12:45:00Z'
          }
        ],
        images: []
      }
    ];
  }

  getMockAgents() {
    return [
      {
        _id: 'agent-1',
        name: 'Support Agent',
        email: 'agent@company.com',
        role: 'agent'
      },
      {
        _id: 'agent-2',
        name: 'Billing Specialist',
        email: 'billing@company.com',
        role: 'agent'
      },
      {
        _id: 'admin-1',
        name: 'Product Manager',
        email: 'pm@company.com',
        role: 'admin'
      }
    ];
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
    if (this.isGuestMode()) {
      // Return guest user profile
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            token: localStorage.getItem('token'),
            user: {
              id: 'guest-user-id',
              name: 'Guest User',
              email: 'guest@example.com',
              role: 'customer'
            }
          });
        }, 200);
      });
    }
    return this.request('/auth/profile');
  }

  // Ticket methods
  async getTickets() {
    if (this.isGuestMode()) {
      // Return mock data for guest mode
      return new Promise(resolve => {
        setTimeout(() => resolve(this.getMockTickets()), 500);
      });
    }
    return this.request('/tickets');
  }

  async createTicket(ticketData) {
    if (this.isGuestMode()) {
      // Simulate ticket creation for guest mode
      return new Promise(resolve => {
        setTimeout(() => {
          const newTicket = {
            _id: 'mock-ticket-' + Date.now(),
            ...ticketData,
            status: 'open',
            user: {
              _id: 'guest-user-id',
              name: 'Guest User',
              email: 'guest@example.com'
            },
            createdAt: new Date().toISOString(),
            comments: [],
            images: ticketData.images || []
          };
          resolve(newTicket);
        }, 800);
      });
    }
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  }

  async getTicketById(id) {
    if (this.isGuestMode()) {
      // Return mock ticket data
      const tickets = this.getMockTickets();
      const ticket = tickets.find(t => t._id === id);
      return new Promise(resolve => {
        setTimeout(() => resolve(ticket || tickets[0]), 300);
      });
    }
    return this.request(`/tickets/${id}`);
  }

  async updateTicket(id, updateData) {
    if (this.isGuestMode()) {
      // Simulate ticket update for guest mode
      const tickets = this.getMockTickets();
      const ticket = tickets.find(t => t._id === id) || tickets[0];
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ ...ticket, ...updateData });
        }, 600);
      });
    }
    return this.request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async addComment(ticketId, commentData) {
    if (this.isGuestMode()) {
      // Simulate adding comment for guest mode
      const tickets = this.getMockTickets();
      const ticket = tickets.find(t => t._id === ticketId) || tickets[0];
      const newComment = {
        _id: 'comment-' + Date.now(),
        message: commentData.message,
        user: {
          _id: 'guest-user-id',
          name: 'Guest User',
          email: 'guest@example.com',
          role: 'customer'
        },
        createdAt: new Date().toISOString(),
        images: commentData.images || []
      };
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ...ticket,
            comments: [...ticket.comments, newComment]
          });
        }, 700);
      });
    }
    return this.request(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  // Image upload methods
  async uploadImage(imageFile) {
    if (this.isGuestMode()) {
      // Simulate image upload for guest mode
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            filename: 'demo-image-' + Date.now() + '.jpg',
            originalName: imageFile.name,
            url: '/uploads/demo-image.jpg',
            uploadedAt: new Date().toISOString()
          });
        }, 1000);
      });
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Uploading single image:', imageFile.name);

    try {
      const response = await fetch(`${this.uploadBaseURL}/api/upload/image`, {
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
    if (this.isGuestMode()) {
      // Simulate multiple image upload for guest mode
      return new Promise(resolve => {
        setTimeout(() => {
          const uploadedImages = Array.from(imageFiles).map((file, index) => ({
            filename: `demo-image-${Date.now()}-${index}.jpg`,
            originalName: file.name,
            url: `/uploads/demo-image-${index}.jpg`,
            uploadedAt: new Date().toISOString()
          }));
          resolve(uploadedImages);
        }, 1200);
      });
    }

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
      const response = await fetch(`${this.uploadBaseURL}/api/upload/images`, {
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
    if (this.isGuestMode()) {
      // Return filtered mock data
      let tickets = this.getMockTickets();
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        tickets = tickets.filter(ticket => 
          ticket.title.toLowerCase().includes(term) ||
          ticket.description.toLowerCase().includes(term)
        );
      }
      return new Promise(resolve => {
        setTimeout(() => resolve(tickets), 400);
      });
    }
    
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
    if (this.isGuestMode()) {
      return new Promise(resolve => {
        setTimeout(() => resolve(this.getMockAgents()), 300);
      });
    }
    return this.request('/users/agents');
  }
}

const apiService = new ApiService();
export default apiService;
