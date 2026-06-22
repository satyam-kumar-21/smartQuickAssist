import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import EasyPostClient from '@easypost/api';

function getDistanceFromLatLonInMiles(lat1: number | null, lon1: number | null, lat2: number | null, lon2: number | null) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 3959; // Radius of earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Number(d.toFixed(1));
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { address, city, postalCode, country, state, phone, cartItems } = await request.json();

        const totalItems = cartItems && cartItems.length > 0 
            ? cartItems.reduce((acc: number, item: any) => acc + item.qty, 0)
            : 1;
        const weightMultiplier = Math.max(1, Math.ceil(totalItems / 3));

        const getFallbackRates = () => {
            const isDomesticCA = (country || 'US').toUpperCase() === 'CA';
            const isDomesticUS = (country || 'US').toUpperCase() === 'US';
            
            if (isDomesticCA) {
                return [
                    { id: 'flat_standard_ca', carrier: 'Smart Quick Assist', service: 'Standard Shipping (5-8 business days)', rate: (9.99 * weightMultiplier).toFixed(2), currency: 'CAD', delivery_days: 8 },
                    { id: 'flat_express_ca', carrier: 'Smart Quick Assist', service: 'Express Shipping (2-4 business days)', rate: (16.99 * weightMultiplier).toFixed(2), currency: 'CAD', delivery_days: 4 },
                    { id: 'flat_priority_ca', carrier: 'Smart Quick Assist', service: 'Priority Shipping (1-2 business days)', rate: (24.99 * weightMultiplier).toFixed(2), currency: 'CAD', delivery_days: 2 },
                ];
            } else if (isDomesticUS) {
                return [
                    { id: 'flat_standard_us', carrier: 'Smart Quick Assist', service: 'Standard Shipping (5-8 business days)', rate: (8.99 * weightMultiplier).toFixed(2), currency: 'USD', delivery_days: 8 },
                    { id: 'flat_express_us', carrier: 'Smart Quick Assist', service: 'Express Shipping (2-4 business days)', rate: (14.99 * weightMultiplier).toFixed(2), currency: 'USD', delivery_days: 4 },
                    { id: 'flat_priority_us', carrier: 'Smart Quick Assist', service: 'Priority Shipping (1-2 business days)', rate: (22.99 * weightMultiplier).toFixed(2), currency: 'USD', delivery_days: 2 },
                ];
            } else {
                return [
                    { id: 'flat_standard_intl', carrier: 'Smart Quick Assist', service: 'International Standard (10-15 business days)', rate: (19.99 * weightMultiplier).toFixed(2), currency: 'USD', delivery_days: 15 },
                    { id: 'flat_express_intl', carrier: 'Smart Quick Assist', service: 'International Express (5-8 business days)', rate: (34.99 * weightMultiplier).toFixed(2), currency: 'USD', delivery_days: 8 },
                ];
            }
        };

        if (!process.env.EASYPOST_API_KEY) {
            console.log('EasyPost API Key not configured. Returning fallback flat-rates.');
            return NextResponse.json({
                rates: getFallbackRates(),
                distance: null
            });
        }

        try {
            const client = new EasyPostClient(process.env.EASYPOST_API_KEY);

            const toAddress = await client.Address.create({
                name: user.name,
                street1: address,
                city: city,
                state: state, 
                zip: postalCode,
                country: country || 'US',
                phone: phone || '8883225251',
                email: user.email,
            });

            const fromAddress = await client.Address.create({
                company: 'Smart Quick Assist',
                street1: process.env.COMPANY_ADDRESS || '440 Davis Court',
                city: process.env.COMPANY_CITY || 'San Francisco',
                state: process.env.COMPANY_STATE || 'CA',
                zip: process.env.COMPANY_ZIP || '94111',
                country: process.env.COMPANY_COUNTRY || 'US',
                phone: process.env.COMPANY_PHONE || '',
            });

            const totalWeight = cartItems && cartItems.length > 0 
                ? cartItems.reduce((acc: number, item: any) => acc + (16 * item.qty), 0)
                : 16;

            const parcel = await client.Parcel.create({
                weight: totalWeight,
                length: 10,
                width: 8,
                height: 4
            });

            const shipment = await client.Shipment.create({
                to_address: toAddress,
                from_address: fromAddress,
                parcel: parcel,
            });

            let distance = null;
            try {
                const fromCoords = { latitude: 43.4255, longitude: -80.5112 };
                let toCoords = null;
                if (toAddress.verifications && toAddress.verifications.delivery && toAddress.verifications.delivery.details) {
                    toCoords = toAddress.verifications.delivery.details;
                }

                if (toCoords && fromCoords) {
                    distance = getDistanceFromLatLonInMiles(
                        fromCoords.latitude, 
                        fromCoords.longitude, 
                        toCoords.latitude, 
                        toCoords.longitude
                    );
                }
            } catch (calcError) {
                console.error('Distance calc error:', calcError);
            }

            const allowedAccounts = [
                'ca_e3cbd16a6eb84914985d90875a6ec074', // Canada Post
                'ca_76d0939dc1ce4c99870bbc2844d8d02b', // FedEx
                'ca_c5f03a14c10d4fbab837e8a35b01c7df', // UPS
                'ca_b82a2962176446d09a48bc649977f467', // USPS
                'ca_fb3ad562209b4e7d930bd0f31f44f2fe'  // DHL Express
            ];
            
            const filteredRates = shipment.rates.filter((rate: any) => allowedAccounts.includes(rate.carrier_account_id));
            let finalRates = filteredRates.length > 0 ? filteredRates : shipment.rates;

            if (finalRates.length === 0) {
                finalRates = getFallbackRates();
            }

            return NextResponse.json({
                rates: finalRates,
                distance
            });
        } catch (easypostErr: any) {
            console.error('EasyPost runtime error, falling back to flat-rates:', easypostErr.message);
            return NextResponse.json({
                rates: getFallbackRates(),
                distance: null
            });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
