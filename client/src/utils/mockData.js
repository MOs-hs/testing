// Mock Data Storage and API utilities

// Initialize mock data in localStorage
// Initialize mock data in localStorage
export const initializeMockData = () => {
  // Check if we've already converted to English, if not, force clear and re-init
  if (!localStorage.getItem('khadamati_english_v1')) {
    console.log('Clearing old Arabic data and initializing English data...');
    localStorage.removeItem('khadamati_initialized');
    localStorage.removeItem('khadamati_categories');
    localStorage.removeItem('khadamati_services');
    localStorage.removeItem('khadamati_providers');
    localStorage.removeItem('khadamati_requests');
    localStorage.removeItem('khadamati_statuses');
    localStorage.removeItem('khadamati_payments');
    localStorage.removeItem('khadamati_reports');
    localStorage.removeItem('khadamati_notifications');
    localStorage.removeItem('khadamati_certificates');
    localStorage.removeItem('khadamati_reviews');
    localStorage.removeItem('khadamati_locations');
    localStorage.removeItem('khadamati_currencies');
  }

  if (!localStorage.getItem('khadamati_initialized') || !localStorage.getItem('khadamati_english_v1')) {
    // Categories
    const categories = [
      { category_id: 1, name: 'Plumbing', description: 'Plumbing and maintenance services' },
      { category_id: 2, name: 'Electricity', description: 'Electrical services and installations' },
      { category_id: 3, name: 'Carpentry', description: 'Carpentry and furniture services' },
      { category_id: 4, name: 'Painting', description: 'Painting and decoration services' },
      { category_id: 5, name: 'Cleaning', description: 'Cleaning and maintenance services' },
      { category_id: 6, name: 'Gardening', description: 'Gardening and landscaping services' },
      { category_id: 7, name: 'Air Conditioning', description: 'AC installation and maintenance' },
      { category_id: 8, name: 'Moving', description: 'Moving and packaging services' }
    ];
    localStorage.setItem('khadamati_categories', JSON.stringify(categories));

    // Services
    const services = [
      {
        service_id: 1,
        title: 'Water Leak Repair',
        description: 'Repairing all types of water leaks',
        provider_id: 2,
        category_id: 1,
        create_at: new Date().toISOString()
      },
      {
        service_id: 2,
        title: 'AC Installation',
        description: 'Installation and maintenance of AC units',
        provider_id: 3,
        category_id: 2,
        create_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('khadamati_services', JSON.stringify(services));

    // Providers
    const providers = [
      {
        provider_id: 1,
        user_id: 2,
        specialization: 'Plumbing',
        approved: true
      },
      {
        provider_id: 2,
        user_id: 3,
        specialization: 'Electricity',
        approved: true
      }
    ];
    localStorage.setItem('khadamati_providers', JSON.stringify(providers));

    // Service Requests
    const requests = [
      {
        request_id: 1,
        customer_id: 4,
        provider_id: 1,
        service_id: 1,
        status_id: 1,
        price: 150.00,
        details: 'Leak in the bathroom',
        request_date: new Date().toISOString(),
        scheduled_date: new Date(Date.now() + 86400000).toISOString()
      }
    ];
    localStorage.setItem('khadamati_requests', JSON.stringify(requests));

    // Statuses
    const statuses = [
      { status_id: 1, values: 'Pending', completed_at: null },
      { status_id: 2, values: 'In Progress', completed_at: null },
      { status_id: 3, values: 'Completed', completed_at: null },
      { status_id: 4, values: 'Cancelled', completed_at: null }
    ];
    localStorage.setItem('khadamati_statuses', JSON.stringify(statuses));

    // Payments
    const payments = [
      {
        payment_id: 1,
        request_id: 1,
        amount: 150.00,
        status: 'Completed',
        method: 'Credit Card',
        create_at: new Date().toISOString(),
        transaction_date: new Date().toISOString(),
        getaway_response: 'Success'
      }
    ];
    localStorage.setItem('khadamati_payments', JSON.stringify(payments));

    // Reports
    const reports = [
      {
        report_id: 1,
        report_type: 'Service',
        target_id: 1,
        target_type: 'Service',
        title: 'Service Issue',
        content: 'The service was not as expected',
        user_id: 4,
        admin_id: null,
        create_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('khadamati_reports', JSON.stringify(reports));

    // Notifications
    const notifications = [
      {
        notification_id: 1,
        user_id: 4,
        type: 'Request',
        title: 'New Request',
        message: 'Your request has been accepted',
        is_read: false,
        sent_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('khadamati_notifications', JSON.stringify(notifications));

    // Certificates
    const certificates = [
      {
        certificate_id: 1,
        provider_id: 1,
        image: '/placeholder.jpg',
        issue_date: new Date().toISOString()
      }
    ];
    localStorage.setItem('khadamati_certificates', JSON.stringify(certificates));

    // Reviews
    const reviews = [
      {
        review_id: 1,
        request_id: 1,
        rating: 5,
        comment: 'Excellent service',
        create_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('khadamati_reviews', JSON.stringify(reviews));

    // Locations - Restricted to Baalbek-Hermel
    const locations = [
      { id: 1, name: 'Baalbek', nameAr: 'Baalbek', governorate: 'Baalbek-Hermel' },
      { id: 2, name: 'Hermel', nameAr: 'Hermel', governorate: 'Baalbek-Hermel' },
      { id: 3, name: 'Arsal', nameAr: 'Arsal', governorate: 'Baalbek-Hermel' },
      { id: 4, name: 'Ras Baalbek', nameAr: 'Ras Baalbek', governorate: 'Baalbek-Hermel' },
      { id: 5, name: 'Brital', nameAr: 'Brital', governorate: 'Baalbek-Hermel' },
      { id: 6, name: 'Deir El Ahmar', nameAr: 'Deir El Ahmar', governorate: 'Baalbek-Hermel' },
      { id: 7, name: 'Labweh', nameAr: 'Labweh', governorate: 'Baalbek-Hermel' },
      { id: 8, name: 'Nabi Sheet', nameAr: 'Nabi Sheet', governorate: 'Baalbek-Hermel' },
      { id: 9, name: 'Shmestar', nameAr: 'Shmestar', governorate: 'Baalbek-Hermel' },
      { id: 10, name: 'Bednayel', nameAr: 'Bednayel', governorate: 'Baalbek-Hermel' }
    ];
    localStorage.setItem('khadamati_locations', JSON.stringify(locations));

    // Currencies - Restricted to LBP and USD
    const currencies = [
      { code: 'LBP', symbol: 'L.L.', name: 'Lebanese Pound' },
      { code: 'USD', symbol: '$', name: 'US Dollar' }
    ];
    localStorage.setItem('khadamati_currencies', JSON.stringify(currencies));

    localStorage.setItem('khadamati_initialized', 'true');
    localStorage.setItem('khadamati_english_v1', 'true');
  }
};

// API functions
export const getCategories = () => {
  return JSON.parse(localStorage.getItem('khadamati_categories') || '[]');
};

export const getServices = () => {
  return JSON.parse(localStorage.getItem('khadamati_services') || '[]');
};

export const getProviders = () => {
  return JSON.parse(localStorage.getItem('khadamati_providers') || '[]');
};

export const getUsers = () => {
  const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
  return users.map(({ password, ...user }) => user);
};

export const getRequests = () => {
  return JSON.parse(localStorage.getItem('khadamati_requests') || '[]');
};

export const getPayments = () => {
  return JSON.parse(localStorage.getItem('khadamati_payments') || '[]');
};

export const getReports = () => {
  return JSON.parse(localStorage.getItem('khadamati_reports') || '[]');
};

export const getNotifications = (userId = null) => {
  const notifications = JSON.parse(localStorage.getItem('khadamati_notifications') || '[]');
  if (userId) {
    return notifications.filter(n => n.user_id === userId);
  }
  return notifications;
};

export const getCertificates = (providerId = null) => {
  const certificates = JSON.parse(localStorage.getItem('khadamati_certificates') || '[]');
  if (providerId) {
    return certificates.filter(c => c.provider_id === providerId);
  }
  return certificates;
};

export const getReviews = (requestId = null) => {
  const reviews = JSON.parse(localStorage.getItem('khadamati_reviews') || '[]');
  if (requestId) {
    return reviews.filter(r => r.request_id === requestId);
  }
  return reviews;
};

export const getLocations = () => {
  const locations = localStorage.getItem('khadamati_locations');
  return locations ? JSON.parse(locations) : [];
};

export const getCurrencies = () => {
  const currencies = localStorage.getItem('khadamati_currencies');
  return currencies ? JSON.parse(currencies) : [];
};

// Create functions
export const createCategory = (category) => {
  const categories = getCategories();
  const newCategory = {
    category_id: Date.now(),
    ...category
  };
  categories.push(newCategory);
  localStorage.setItem('khadamati_categories', JSON.stringify(categories));
  return newCategory;
};

export const createService = (service) => {
  const services = getServices();
  const newService = {
    service_id: Date.now(),
    create_at: new Date().toISOString(),
    ...service
  };
  services.push(newService);
  localStorage.setItem('khadamati_services', JSON.stringify(services));
  return newService;
};

export const createRequest = (request) => {
  const requests = getRequests();
  const newRequest = {
    request_id: Date.now(),
    request_date: new Date().toISOString(),
    status_id: 1, // Pending
    ...request
  };
  requests.push(newRequest);
  localStorage.setItem('khadamati_requests', JSON.stringify(requests));
  return newRequest;
};

export const createNotification = (notification) => {
  const notifications = getNotifications();
  const newNotification = {
    notification_id: Date.now(),
    sent_at: new Date().toISOString(),
    is_read: false,
    ...notification
  };
  notifications.push(newNotification);
  localStorage.setItem('khadamati_notifications', JSON.stringify(notifications));
  return newNotification;
};

// Update functions
export const updateCategory = (categoryId, updates) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.category_id === categoryId);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem('khadamati_categories', JSON.stringify(categories));
    return categories[index];
  }
  return null;
};

export const updateService = (serviceId, updates) => {
  const services = getServices();
  const index = services.findIndex(s => s.service_id === serviceId);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    localStorage.setItem('khadamati_services', JSON.stringify(services));
    return services[index];
  }
  return null;
};

export const updateRequest = (requestId, updates) => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.request_id === requestId);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    localStorage.setItem('khadamati_requests', JSON.stringify(requests));
    return requests[index];
  }
  return null;
};

export const updateUser = (userId, updates) => {
  const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
  const index = users.findIndex(u => u.user_id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('khadamati_users', JSON.stringify(users));
    return users[index];
  }
  return null;
};

// Delete functions
export const deleteCategory = (categoryId) => {
  const categories = getCategories();
  const filtered = categories.filter(c => c.category_id !== categoryId);
  localStorage.setItem('khadamati_categories', JSON.stringify(filtered));
  return true;
};

export const deleteService = (serviceId) => {
  const services = getServices();
  const filtered = services.filter(s => s.service_id !== serviceId);
  localStorage.setItem('khadamati_services', JSON.stringify(filtered));
  return true;
};

export const deleteUser = (userId) => {
  const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
  const filtered = users.filter(u => u.user_id !== userId);
  localStorage.setItem('khadamati_users', JSON.stringify(filtered));
  return true;
};

export const deleteReport = (reportId) => {
  const reports = getReports();
  const filtered = reports.filter(r => r.report_id !== reportId);
  localStorage.setItem('khadamati_reports', JSON.stringify(filtered));
  return true;
};
