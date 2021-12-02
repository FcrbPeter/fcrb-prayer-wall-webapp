import axios from "axios";

const apiKey = process.env.REACT_APP_GEOCODING;

const hasGeo = !!navigator.geolocation;

const geoOptions = {
	enableHighAccuracy: false,
	timeout: 1000,
	maximumAge: 0,
};

const getGeoLocation = async () => {
	if (!hasGeo) {
		return null;
	}

	try {
		const result = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, geoOptions));

		return {
			latitude: result.coords.latitude,
			longitude: result.coords.longitude,
		};
	}
	catch(e) {
		return null;
	}
}

export const getCountry = async () => {
	if (!apiKey) {
		return null;
	}

	const location = await getGeoLocation();

	if(!location || !location.latitude || !location.longitude) {
		return null;
	}

	const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}`);

	const result = response?.data?.results && response?.data?.results.length > 0 ? response?.data?.results[0] : null;

	if(!result || !result['address_components']) {
		return null;
	}

	for(const c of result['address_components']) {
		if(c.types.indexOf('country') > -1) {
			return c['short_name'];
		}
	}

	return null;
}
