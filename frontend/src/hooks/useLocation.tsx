import { useCallback, useState } from "react"

import { Location } from '../types'


const useLocation = (timeout = 5000, enableHighAccuracy = true, maximumAge = 0) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [coords, setCoords] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onSuccess = (position: GeolocationPosition) => {
        setLoading(false)
        setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        setError(null)
    }
    const onError = (positionError: GeolocationPositionError) => {
        setLoading(false)
        setCoords(null)
        setError(positionError.message)
    }

    const fetchLocation = useCallback(() => {

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!navigator.geolocation) {
            setError('Geolocation not supported.')
            setCoords(null)
            return
        }

        const options = {
            enableHighAccuracy,
            timeout,
            maximumAge,
        };

        setLoading(true);
        setError('');
        navigator.geolocation.getCurrentPosition(
            onSuccess,
            onError,
            options
        );
    }, [timeout, enableHighAccuracy, maximumAge])

    return { loading, coords, error, fetch: fetchLocation }
}

export default useLocation