// FILE: frontend/src/lib/api.organizer.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Route organizer dashboard API calls to mock or real adapters.
//   SCOPE: Organization stats, details, events, and participant lists
//   DEPENDS: M-FRONTEND-API
//   LINKS: M-FRONTEND-API V-M-FRONTEND-API
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   fetchOrganizationDashboardStats - organizer dashboard metric cards
//   fetchOrganizationDetails - current organizer organization record
//   fetchOrganizationEvents - events owned by the organizer
//   fetchEventParticipants - participants for one organizer event
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import * as realApi from './api.real';
import * as mockApi from './api.mock';

const isDemoMode = () => import.meta.env.VITE_API_MODE !== 'real';

// START_CONTRACT: fetchOrganizationDashboardStats
//   PURPOSE: Load organizer dashboard stats from the selected API adapter
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationStat[]> - dashboard metric cards }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API export-fetchOrganizationDashboardStats
// END_CONTRACT: fetchOrganizationDashboardStats
export const fetchOrganizationDashboardStats = () => {
  return isDemoMode()
    ? mockApi.fetchOrganizationDashboardStats()
    : realApi.fetchOrganizationDashboardStats();
};

// START_CONTRACT: fetchOrganizationDetails
//   PURPOSE: Load the current organizer organization details
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationDetails> - organizer org record }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API export-fetchOrganizationDetails
// END_CONTRACT: fetchOrganizationDetails
export const fetchOrganizationDetails = () => {
  return isDemoMode()
    ? mockApi.fetchOrganizationDetails()
    : realApi.fetchOrganizationDetails();
};

// START_CONTRACT: fetchOrganizationEvents
//   PURPOSE: Load events owned by the current organizer
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationEvent[]> - organizer event list }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API export-fetchOrganizationEvents
// END_CONTRACT: fetchOrganizationEvents
export const fetchOrganizationEvents = () => {
  return isDemoMode()
    ? mockApi.fetchOrganizationEvents()
    : realApi.fetchOrganizationEvents();
};

// START_CONTRACT: fetchEventParticipants
//   PURPOSE: Load participants for one organizer-owned event
//   INPUTS: { eventId: number - organizer event id }
//   OUTPUTS: { Promise<EventParticipant[]> - participant rows }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API export-fetchEventParticipants
// END_CONTRACT: fetchEventParticipants
export const fetchEventParticipants = (eventId: number) => {
  return isDemoMode()
    ? mockApi.fetchEventParticipants(eventId)
    : realApi.fetchEventParticipants(eventId);
};
