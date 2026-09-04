// FILE: frontend/src/app/tabs/organizations/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Organizations catalog with search, filters, and subscribe.
//   SCOPE: Load orgs, filter, subscribe confirm, toast undo
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OrganizationsPage - organizations tab catalog
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import {fetchAllOrganizations, updateOrganizationSubscription} from '../../../lib/api';
import type {Organization, OrganizationFilters} from '../../../lib/types';
import {BadgeCheck, Check, Filter, Search, SearchX} from 'lucide-react';
import SubscribeModal from '../../../components/ui/SubscribeModal';
import Toast from '../../../components/ui/Toast';
import EmptyState from '../../../components/ui/EmptyState';
import {DEFAULT_ORGANIZATION_FILTERS, MESSAGES, ORGANIZATION_CATEGORIES} from '../../../lib/constants';

const OrganizationSkeletonCell: React.FC = () => (
  <div className="flex items-center space-x-4 p-4 animate-pulse">
    <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="w-32 h-9 bg-gray-200 rounded-lg"></div>
  </div>
);

const OrganizationCell: React.FC<{
  organization: Organization;
  onSubscribe: (id: number) => void;
  onSelect: (id: number) => void;
}> = React.memo(({organization, onSubscribe, onSelect}) => (
  <div className="flex items-center space-x-4 p-4 w-full">
    <button onClick={() => onSelect(organization.id)} className="flex items-center space-x-4 flex-1 text-left">
      <img loading="lazy" src={organization.logoUrl} alt={`Логотип ${organization.name}`}
           className="w-14 h-14 rounded-full flex-shrink-0"/>
      <div className="flex-1">
        <div className="flex items-center space-x-1.5">
          <h3 className="font-bold text-md text-[#0C0D0E]">{organization.name}</h3>
          {organization.isVerified && <BadgeCheck className="w-5 h-5 text-[#007AFF] fill-current"/>}
        </div>
        <p className="text-sm text-[rgb(12,13,14,0.52)]">{organization.description}</p>
      </div>
    </button>
    <button
      onClick={() => onSubscribe(organization.id)}
      className={`flex-shrink-0 w-36 text-sm font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
        organization.isSubscribed
          ? 'bg-gray-100 text-gray-500'
          : 'bg-transparent border-2 border-[#007AFF] text-[#007AFF] hover:bg-blue-50'
      }`}
    >
      {organization.isSubscribed ? (
        <>
          <Check className="w-4 h-4"/>
          <span>Вы подписаны</span>
        </>
      ) : (
        <span>Подписаться</span>
      )}
    </button>
  </div>
));

const OrganizationFilterPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: OrganizationFilters) => void;
  initialFilters: OrganizationFilters;
}> = ({isOpen, onClose, onApply, initialFilters}) => {
  const [city, setCity] = useState(initialFilters.city);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [verifiedOnly, setVerifiedOnly] = useState(initialFilters.verifiedOnly);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleReset = () => {
    setCity(DEFAULT_ORGANIZATION_FILTERS.city);
    setSelectedCategories(DEFAULT_ORGANIZATION_FILTERS.categories);
    setVerifiedOnly(DEFAULT_ORGANIZATION_FILTERS.verifiedOnly);
  };

  const handleApply = () => {
    onApply({city, categories: selectedCategories, verifiedOnly});
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}>
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '70vh'}}
        role="dialog"
        aria-modal="true"
        aria-labelledby="org-filter-panel-title"
      >
        <div className="flex flex-col h-full">
          <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="w-16"></div>
            <div className="text-center">
              <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h2 id="org-filter-panel-title" className="text-xl font-bold text-[#0C0D0E]">Фильтры</h2>
            </div>
            <button onClick={handleReset} className="text-sm font-semibold text-[#007AFF] w-16 text-right">Сбросить
            </button>
          </header>

          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Город</h3>
              <button
                className="w-full flex justify-between items-center p-3 border border-gray-300 rounded-xl text-left">
                <span className="text-[#0C0D0E]">{city}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                     fill="currentColor">
                  <path fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"/>
                </svg>
              </button>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Направления</h3>
              <div className="flex flex-wrap gap-2">
                {ORGANIZATION_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedCategories.includes(cat) ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#0C0D0E]">Только верифицированные</h3>
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${verifiedOnly ? 'bg-[#007AFF]' : 'bg-gray-200'}`}
                  role="switch"
                  aria-checked={verifiedOnly}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${verifiedOnly ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
              </div>
            </section>
          </div>

          <footer className="p-4 border-t border-gray-200 flex-shrink-0">
            <button onClick={handleApply}
                    className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 shadow-lg">
              Показать организации
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

// START_CONTRACT: OrganizationsPage
//   PURPOSE: Load organizations and handle search, filter, and subscribe
//   INPUTS: { none - uses router }
//   OUTPUTS: { ReactElement - org list }
//   SIDE_EFFECTS: fetchAllOrganizations, updateOrganizationSubscription
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-fetchAllOrganizations, fn-updateOrganizationSubscription
// END_CONTRACT: OrganizationsPage
const OrganizationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<OrganizationFilters>(DEFAULT_ORGANIZATION_FILTERS);
  const [subscribingOrg, setSubscribingOrg] = useState<Organization | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; onUndo?: () => void }>({
    show: false,
    message: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // START_BLOCK_LOAD_ORGANIZATIONS
    const loadOrgs = async () => {
      try {
        setLoading(true);
        const orgs = await fetchAllOrganizations();
        setOrganizations(orgs);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить организации.");
      } finally {
        setLoading(false);
      }
    };
    loadOrgs();
  }, []);
    // END_BLOCK_LOAD_ORGANIZATIONS

  const onSelectOrganization = (id: number) => {
    navigate(`/app/organizations/${id}`);
  };

  const filteredOrganizations = useMemo(() => {
    let filtered = organizations.filter(org => {
      const categoryMatch = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(org.category);
      const verifiedMatch = !appliedFilters.verifiedOnly || org.isVerified;
      return categoryMatch && verifiedMatch;
    });

    if (!searchQuery) return filtered;

    return filtered.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, organizations, appliedFilters]);

  // START_BLOCK_SUBSCRIBE_ORG
  const handleSubscribeClick = async (id: number) => {
    const orgToUpdate = organizations.find(org => org.id === id);
    if (!orgToUpdate) return;

    if (orgToUpdate.isSubscribed) {
      await updateOrganizationSubscription(id, false);
      setOrganizations(prevOrgs => prevOrgs.map(org => org.id === id ? {...org, isSubscribed: false} : org));
    } else {
      setSubscribingOrg(orgToUpdate);
    }
  };

  const handleConfirmSubscription = async () => {
    if (!subscribingOrg) return;
    const {id, name} = subscribingOrg;

    await updateOrganizationSubscription(id, true);
    setOrganizations(prevOrgs => prevOrgs.map(org => org.id === id ? {...org, isSubscribed: true} : org));

    setSubscribingOrg(null);
    setToast({show: true, message: MESSAGES.TOASTS.SUBSCRIBED(name), onUndo: () => handleUndoSubscription(id)});
  };

  const handleUndoSubscription = async (orgId: number) => {
    await updateOrganizationSubscription(orgId, false);
    setOrganizations(prevOrgs => prevOrgs.map(org => org.id === orgId ? {...org, isSubscribed: false} : org));
  };

  const handleApplyFilters = (filters: OrganizationFilters) => {
    setAppliedFilters(filters);
    setIsFilterPanelOpen(false);
  };
  // END_BLOCK_SUBSCRIBE_ORG

  // START_BLOCK_RENDER_ORGANIZATIONS
  return (
    <>
      <div className="w-full min-h-full bg-white flex flex-col">
        <header className="p-6 pb-4">
          <h1 className="text-[28px] font-bold text-[#0C0D0E]">Организации и фонды</h1>
        </header>
        <div className="px-6 pb-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search
              className="w-5 h-5 text-gray-400"/></span>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Найти по названию"
                   className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                   aria-label="Поиск организаций"/>
          </div>
          <button onClick={() => setIsFilterPanelOpen(true)} aria-label="Фильтры"
                  className="flex-shrink-0 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <Filter className="w-6 h-6 text-gray-600"/>
          </button>
        </div>
        <main className="flex-grow">
          <div className="divide-y divide-gray-100">
            {loading ? (<> <OrganizationSkeletonCell/> <OrganizationSkeletonCell/> <OrganizationSkeletonCell/>
                <OrganizationSkeletonCell/> <OrganizationSkeletonCell/> </>
            ) : error ? (<div className="text-center py-10 text-red-500">{error}</div>
            ) : filteredOrganizations.length > 0 ? (
              filteredOrganizations.map(org => <OrganizationCell key={org.id} organization={org}
                                                                 onSubscribe={handleSubscribeClick}
                                                                 onSelect={onSelectOrganization}/>)
            ) : (
              <div className="pt-10"><EmptyState Icon={SearchX} title="Организации не найдены"
                                                 subtitle="По вашим фильтрам ничего не найдено. Попробуйте изменить параметры."/>
              </div>
            )}
          </div>
        </main>
        <OrganizationFilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)}
                                 onApply={handleApplyFilters} initialFilters={appliedFilters}/>
      </div>
      <SubscribeModal isOpen={!!subscribingOrg} organizationName={subscribingOrg?.name || ''}
                      onConfirm={handleConfirmSubscription} onCancel={() => setSubscribingOrg(null)}/>
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({...toast, show: false})}
             onUndo={toast.onUndo} type="success"/>
    </>
  );
  // END_BLOCK_RENDER_ORGANIZATIONS
};

export default OrganizationsPage;