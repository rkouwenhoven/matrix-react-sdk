/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useCallback, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { RoomMember } from 'matrix-js-sdk/src/matrix';

import { createMarker, parseGeoUri } from '../../../utils/location';
import Marker from './Marker';

const useMapMarker = (
    map: maplibregl.Map,
    geoUri: string,
): { marker?: maplibregl.Marker, onElementRef: (el: HTMLDivElement) => void } => {
    const [marker, setMarker] = useState<maplibregl.Marker>();

    const onElementRef = useCallback((element: HTMLDivElement) => {
        if (marker || !element) {
            return;
        }
        const coords = parseGeoUri(geoUri);
        const newMarker = createMarker(coords, element);
        newMarker.addTo(map);
        setMarker(newMarker);
    }, [marker, geoUri, map]);

    useEffect(() => {
        if (marker) {
            const coords = parseGeoUri(geoUri);
            marker.setLngLat({ lon: coords.longitude, lat: coords.latitude });
        }
    }, [marker, geoUri]);

    useEffect(() => () => {
        if (marker) {
            marker.remove();
        }
    }, [marker]);

    return {
        marker,
        onElementRef,
    };
};

interface SmartMarkerProps {
    map: maplibregl.Map;
    geoUri: string;
    id?: string;
    // renders MemberAvatar when provided
    roomMember?: RoomMember;
    // use member text color as background
    useMemberColor?: boolean;
}

/**
 * Generic location marker
 */
const SmartMarker: React.FC<SmartMarkerProps> = ({ id, map, geoUri, roomMember, useMemberColor }) => {
    const { onElementRef } = useMapMarker(map, geoUri);

    return <Marker
        ref={onElementRef}
        id={id}
        roomMember={roomMember}
        useMemberColor={useMemberColor}
    />;
};

export default SmartMarker;
