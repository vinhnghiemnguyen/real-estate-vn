export interface RawProjectData {
    "Trang": string;
    "Tên Dự Án": string;
    "URL Dự Án": string;
    "URL Tin Rao (1st)": string;
    "Cấp 1": string;
    "Cấp 2": string;
    "Cấp 3": string;
    "Cấp 4": string;
    "Latitude": string;
    "Longitude": string;
    "Diện tích": string;
    "Số căn": string;
    "Số tòa": string;
    "Chủ đầu tư": string;
    "Attributes (Other)": string;
    "_tool_name": string;
    "_tool_province": string;
    "_tool_district": string;
    "priceHistory": {
        labels: string[];
        avg: number[];
        min: number[];
        max: number[];
    } | null;
}

export interface Project {
    id: string;
    name: string;
    province: string;
    district: string;
    lat: number;
    lng: number;
    area?: string;
    investor?: string;
    priceRange?: string;
    url?: string;
    priceHistory?: {
        labels: string[];
        avg: number[];
        min: number[];
        max: number[];
    } | null;
    raw: RawProjectData;
}
