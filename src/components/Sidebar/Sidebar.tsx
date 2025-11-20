import { useState, useMemo } from 'react';
import type { Project } from '../../types';
import { Search, MapPin, Building, DollarSign, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PriceChart from '../Charts/PriceChart';

interface SidebarProps {
    projects: Project[];
    selectedProject: Project | null;
    onSelectProject: (project: Project) => void;
    filters: {
        province: string;
        district: string;
        investor: string;
        minProjects: number;
    };
    onFilterChange: (key: string, value: string | number) => void;
    filterOptions: {
        provinces: string[];
        investors: { name: string; count: number }[];
        districtsByProvince: Record<string, string[]>;
    };
}

const Sidebar = ({
    projects,
    selectedProject,
    onSelectProject,
    filters,
    onFilterChange,
    filterOptions
}: SidebarProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const filteredProjects = useMemo(() => {
        return projects.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.district.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 50);
    }, [projects, searchTerm]);

    const availableDistricts = useMemo(() => {
        return filters.province ? filterOptions.districtsByProvince[filters.province] || [] : [];
    }, [filters.province, filterOptions.districtsByProvince]);

    const filteredInvestors = useMemo(() => {
        return filterOptions.investors.filter(i => i.count >= filters.minProjects);
    }, [filterOptions.investors, filters.minProjects]);

    return (
        <div className="flex flex-col h-full bg-white/90 backdrop-blur-md border-r border-slate-200 shadow-2xl z-10 w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
                    Real Estate Map
                </h1>

                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${showFilters ? 'bg-primary-100 text-primary-600' : 'hover:bg-slate-200 text-slate-500'}`}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-3 overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary-500/20 outline-none"
                                        value={filters.province}
                                        onChange={(e) => onFilterChange('province', e.target.value)}
                                    >
                                        <option value="">All Provinces</option>
                                        {filterOptions.provinces.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary-500/20 outline-none"
                                        value={filters.district}
                                        onChange={(e) => onFilterChange('district', e.target.value)}
                                        disabled={!filters.province}
                                    >
                                        <option value="">All Districts</option>
                                        {availableDistricts.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 font-medium ml-1">
                                        Min Projects per Investor: {filters.minProjects}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        step="1"
                                        value={filters.minProjects}
                                        onChange={(e) => onFilterChange('minProjects', parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                    />
                                </div>

                                <select
                                    className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary-500/20 outline-none"
                                    value={filters.investor}
                                    onChange={(e) => onFilterChange('investor', e.target.value)}
                                >
                                    <option value="">All Investors</option>
                                    {filteredInvestors.map(i => (
                                        <option key={i.name} value={i.name}>{i.name} ({i.count})</option>
                                    ))}
                                </select>

                                {(filters.province || filters.district || filters.investor || filters.minProjects > 0) && (
                                    <button
                                        onClick={() => {
                                            onFilterChange('province', '');
                                            onFilterChange('district', '');
                                            onFilterChange('investor', '');
                                            onFilterChange('minProjects', 0);
                                        }}
                                        className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
                                    >
                                        <X className="w-3 h-3 mr-1" /> Clear Filters
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-white rounded-xl border border-primary-100 shadow-lg p-4 sticky top-0 z-10"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-slate-800">{selectedProject.name}</h2>
                            <button
                                onClick={() => onSelectProject(null as any)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600">
                            <p><span className="font-semibold">Location:</span> {selectedProject.district}, {selectedProject.province}</p>
                            {selectedProject.investor && <p><span className="font-semibold">Investor:</span> {selectedProject.investor}</p>}
                            {selectedProject.area && <p><span className="font-semibold">Area:</span> {selectedProject.area}</p>}
                            {selectedProject.priceRange && <p className="text-primary-600 font-semibold">{selectedProject.priceRange}</p>}
                            {selectedProject.url && (
                                <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline block mt-1">
                                    View Details
                                </a>
                            )}
                        </div>

                        {selectedProject.priceHistory && (
                            <PriceChart project={selectedProject} />
                        )}
                    </motion.div>
                )}

                {filteredProjects.map((project) => (
                    <motion.div
                        key={project.id}
                        layoutId={project.id}
                        onClick={() => onSelectProject(project)}
                        className={`
              p-4 rounded-xl cursor-pointer transition-all duration-200 border
              ${selectedProject?.id === project.id
                                ? 'bg-primary-50 border-primary-200 shadow-md ring-1 ring-primary-200'
                                : 'bg-white border-slate-100 hover:border-primary-100 hover:shadow-sm'
                            }
            `}
                    >
                        <h3 className={`font-bold text-lg mb-2 ${selectedProject?.id === project.id ? 'text-primary-700' : 'text-slate-800'}`}>
                            {project.name}
                        </h3>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-slate-500">
                                <MapPin className="w-4 h-4 mr-2 shrink-0" />
                                <span className="truncate">{project.district}, {project.province}</span>
                            </div>

                            {project.area && (
                                <div className="flex items-center text-sm text-slate-500">
                                    <Building className="w-4 h-4 mr-2 shrink-0" />
                                    <span>{project.area}</span>
                                </div>
                            )}

                            {project.priceRange && (
                                <div className="flex items-center text-sm font-medium text-primary-600">
                                    <DollarSign className="w-4 h-4 mr-2 shrink-0" />
                                    <span>{project.priceRange}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <p>No projects found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
