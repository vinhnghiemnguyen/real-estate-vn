import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Project } from '../../types';

interface PriceChartProps {
    project: Project;
}

const PriceChart = ({ project }: PriceChartProps) => {
    if (!project.priceHistory || !project.priceHistory.labels || project.priceHistory.labels.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 text-sm">
                No price history available
            </div>
        );
    }

    const data = project.priceHistory.labels.map((label, index) => ({
        name: label,
        avg: project.priceHistory?.avg[index] || 0,
        min: project.priceHistory?.min[index] || 0,
        max: project.priceHistory?.max[index] || 0,
    }));

    return (
        <div className="w-full h-64 mt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Price History (Million VND/m²)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        interval="preserveStartEnd"
                        minTickGap={30}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="max"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={false}
                        name="Max Price"
                    />
                    <Line
                        type="monotone"
                        dataKey="avg"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={false}
                        name="Avg Price"
                    />
                    <Line
                        type="monotone"
                        dataKey="min"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        name="Min Price"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;
