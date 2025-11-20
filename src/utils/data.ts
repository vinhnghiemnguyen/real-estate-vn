import type { Project, RawProjectData } from '../types';
import rawData from '../../data.json';

export const loadProjects = (): Project[] => {
    const projects: Project[] = (rawData as RawProjectData[])
        .filter(item => item.Latitude && item.Longitude && !isNaN(parseFloat(item.Latitude)) && !isNaN(parseFloat(item.Longitude)))
        .map((item, index) => {
            let priceRange = '';
            try {
                if (item["Attributes (Other)"]) {
                    const attrs = JSON.parse(item["Attributes (Other)"]);
                    priceRange = attrs["Giá"] || '';
                }
            } catch (e) {
                // Ignore parse error
            }

            return {
                id: `proj-${index}`,
                name: item["Tên Dự Án"] || item["_tool_name"] || "Unknown Project",
                province: item["Cấp 2"] || item["_tool_province"] || "",
                district: item["Cấp 3"] || item["_tool_district"] || "",
                lat: parseFloat(item.Latitude),
                lng: parseFloat(item.Longitude),
                area: item["Diện tích"],
                investor: item["Chủ đầu tư"],
                priceRange,
                url: item["URL Dự Án"],
                priceHistory: item.priceHistory,
                raw: item
            };
        });

    return projects;
};

export const getInvestorsWithCounts = (projects: Project[]) => {
    const investorCounts: Record<string, number> = {};
    projects.forEach(p => {
        if (p.investor) {
            investorCounts[p.investor] = (investorCounts[p.investor] || 0) + 1;
        }
    });

    return Object.entries(investorCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
};

export const getFilterOptions = (projects: Project[]) => {
    const provinces = Array.from(new Set(projects.map(p => p.province).filter(Boolean))).sort();

    const investors = getInvestorsWithCounts(projects);

    // Map province to districts
    const districtsByProvince: Record<string, string[]> = {};
    projects.forEach(p => {
        if (p.province && p.district) {
            if (!districtsByProvince[p.province]) {
                districtsByProvince[p.province] = [];
            }
            if (!districtsByProvince[p.province].includes(p.district)) {
                districtsByProvince[p.province].push(p.district);
            }
        }
    });

    // Sort districts
    Object.keys(districtsByProvince).forEach(prov => {
        districtsByProvince[prov].sort();
    });

    return { provinces, investors, districtsByProvince };
};
