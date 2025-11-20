import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { Project } from '../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    projects: Project[];
    selectedProject: Project | null;
    onSelectProject: (project: Project) => void;
}

const MapEvents = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) => {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange(map.getBounds());
        },
        zoomend: () => {
            onBoundsChange(map.getBounds());
        },
    });

    useEffect(() => {
        onBoundsChange(map.getBounds());
    }, [map, onBoundsChange]);

    return null;
};

const MapView = ({ projects, selectedProject, onSelectProject }: MapProps) => {
    const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
    const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
    const lastCenteredProjectId = useRef<string | null>(null);

    useEffect(() => {
        if (!bounds) {
            return;
        }

        const filtered = projects.filter(p =>
            bounds.contains([p.lat, p.lng])
        );

        setVisibleProjects(filtered.slice(0, 500));
    }, [bounds, projects]);

    // Center map on selected project
    const MapUpdater = () => {
        const map = useMapEvents({});

        useEffect(() => {
            if (selectedProject && selectedProject.id !== lastCenteredProjectId.current) {
                map.flyTo([selectedProject.lat, selectedProject.lng], 15, {
                    animate: true,
                    duration: 1.5
                });
                lastCenteredProjectId.current = selectedProject.id;
            }
        }, [selectedProject, map]);
        return null;
    };

    return (
        <MapContainer
            center={[16.047079, 108.206230]} // Center of Vietnam roughly
            zoom={6}
            className="w-full h-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onBoundsChange={setBounds} />
            <MapUpdater />

            {visibleProjects.map((project) => (
                <Marker
                    key={project.id}
                    position={[project.lat, project.lng]}
                    eventHandlers={{
                        click: () => onSelectProject(project),
                    }}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                            <p className="text-sm text-gray-600">{project.district}, {project.province}</p>
                            {project.priceRange && (
                                <p className="text-sm font-semibold text-primary-600 mt-1">{project.priceRange}</p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;
