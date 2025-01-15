'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';


type Item = {
    id: number;
    title: string;
    coverImageUrl: string;
    photoCount: number;
};

const Home = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const response = await fetch(
                    'https://finder-api.chavaramatrimony.com/PhotoGallery/list',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pagination: {
                                currentPage: 1,
                                recordCount: 5,
                            },
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setItems(data.items);
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Photo Gallery</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Link href={`/events/${item.id}`}>
                        <div key={item.id} className="border rounded-lg shadow-sm p-4">
                            <Image
                                width={1000}
                                height={1000}
                                src={item.coverImageUrl}
                                alt={item.title}

                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                            <p className="text-sm text-gray-500">Photos: {item.photoCount}</p>
                        </div>
                    </Link>

                ))}
            </div>
        </div>
    );
};

export default Home;