import * as realApi from './api.real';
import * as mockApi from './api.mock';

const isDemoMode = () => import.meta.env.VITE_API_MODE !== 'real';

export const fetchOrganizationDashboardStats = () => {
  return isDemoMode()
    ? mockApi.fetchOrganizationDashboardStats()
    : realApi.fetchOrganizationDashboardStats();
};

export const fetchOrganizationDetails = () => {
  return isDemoMode()
    ? mockApi.fetchOrganizationDetails()
    : realApi.fetchOrganizationDetails();
};

export const fetchOrganizationEvents = () => {
  return isDemoMode()
    ? mockApi.fetchOrganizationEvents()
    : realApi.fetchOrganizationEvents();
};

export const fetchEventParticipants = (eventId: number) => {
  return isDemoMode()
    ? mockApi.fetchEventParticipants(eventId)
    : realApi.fetchEventParticipants(eventId);
};
