import React, { useState } from 'react';

const MapComponent = () => {
    const [address, setAddress] = useState('');
    const [suggestedAddresses, setSuggestedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [showLoading, setShowLoading] = useState(false);
    const handleAddressChange = (event) => {
        const newAddress = event.target.value;
        setAddress(newAddress);
        setShowLoading(newAddress.length > 0);
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(newAddress)}&key=AIzaSyAKKzPfrnhLHFG7xMO-snpRQ7ULl91iOQw&libraries=places&language=en&region=IN`)
            .then(response => response.json())
            .then(data => {
                const suggestions = data.results.map(result => result.formatted_address);
                setSuggestedAddresses(suggestions);
            })
            .catch(error => console.error('Error fetching address suggestions:', error));
    };

    const handleAddressSelect = (selected) => {
        setSelectedAddress(selected);
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(selected)}&key=AIzaSyAKKzPfrnhLHFG7xMO-snpRQ7ULl91iOQw&libraries=places&language=en&region=IN`)
            .then(response => response.json())
            .then(data => {
                const coordinates = data.results[0].geometry.location;
                setSelectedCoordinates(coordinates);
                const mapLink = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
                console.log('Map Link:', mapLink);
                setSuggestedAddresses([]);
            })
            .catch(error => console.error('Error fetching coordinates:', error));
    };

    return (
        <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
                Address
            </label>
            <div className="relativeInput">
                <input
                    type="text"
                    className="common-fonts common-input bmp-input "
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Type your address"
                />
                {showLoading && (
                    <ul className="autocomplete-dropdown">
                        {suggestedAddresses.map((suggestion, index) => (
                            <li key={index} className="differentLink" onClick={() => handleAddressSelect(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}

            </div>
            {selectedAddress && <p>Selected Address: {selectedAddress}</p>}
            {selectedCoordinates && (
                <>
                    <p>coordinate:{`${selectedCoordinates.lat},${selectedCoordinates.lng}`}</p>
                    <p>
                        Map Link:{' '}
                        <a
                            href={`https://www.google.com/maps?q=${selectedCoordinates.lat},${selectedCoordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open in Google Maps
                        </a>
                    </p>
                </>
            )}
        </div>
    );
};

export default MapComponent;