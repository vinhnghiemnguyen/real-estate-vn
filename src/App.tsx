import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MapView from './components/Map/Map';
import { loadProjects, getFilterOptions, getInvestorsWithCounts } from './utils/data';
import type { Project } from './types';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    province: '',
    district: '',
    investor: '',
    minProjects: 0
  });

  useEffect(() => {
    // Simulate async load
    const timer = setTimeout(() => {
      const data = loadProjects();
      setProjects(data);
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filterOptions = useMemo(() => getFilterOptions(projects), [projects]);

  const availableInvestors = useMemo(() => {
    // Filter projects based on province and district ONLY to determine available investors
    const locationFiltered = projects.filter(p => {
      if (filters.province && p.province !== filters.province) return false;
      if (filters.district && p.district !== filters.district) return false;
      return true;
    });
    return getInvestorsWithCounts(locationFiltered);
  }, [projects, filters.province, filters.district]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (filters.province && p.province !== filters.province) return false;
      if (filters.district && p.district !== filters.district) return false;
      if (filters.investor && p.investor !== filters.investor) return false;

      // If minProjects is set and no specific investor is selected, 
      // filter out projects from investors with fewer projects than the threshold
      if (filters.minProjects > 0 && !filters.investor) {
        const investorCount = availableInvestors.find(i => i.name === p.investor)?.count || 0;
        if (investorCount < filters.minProjects) return false;
      }

      return true;
    });
  }, [projects, filters, availableInvestors]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset district if province changes
      if (key === 'province') {
        newFilters.district = '';
      }
      return newFilters;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar
        projects={filteredProjects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterOptions={{
          ...filterOptions,
          investors: availableInvestors
        }}
      />
      <div className="flex-1 relative">
        <MapView
          projects={filteredProjects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />
      </div>
    </div>
  );
}

export default App;
