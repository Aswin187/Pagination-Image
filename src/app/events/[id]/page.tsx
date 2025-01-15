"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { use } from 'react'; // Import `use` from React to unwrap params

async function getGalleryData(id: string) {
  const res = await fetch(`https://finder-api.chavaramatrimony.com/PhotoGallery/details/${id}`);
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}

const EventsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params); // Unwrap the params object using `use()`
  const [gallery, setGallery] = useState<Event | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGalleryData(id); // Use the unwrapped id
      setGallery(data);
    };
    fetchData();
  }, [id]);

  if (!gallery) {
    return <div>Loading...</div>;
  }

  // Function to handle "Next" button click
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < gallery.galleryPhotos.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Function to handle "Previous" button click
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : gallery.galleryPhotos.length - 1
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-[600px] overflow-y-auto p-2">
      {gallery.galleryPhotos.length > 0 && (
        <div className="relative lg:col-span-2 w-full h-[500px] bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src={gallery.galleryPhotos[currentImageIndex].imageUrl || "/placeholder.svg"}
            alt={gallery.galleryPhotos[currentImageIndex].subject}
            fill
            className="object-cover"
          />

          {/* Next and Previous buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
          >
            &#9664;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
          >
            &#9654;
          </button>
        </div>
      )}

      {/* Sub-images */}
      <div className="p-4">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-4">
          {gallery.title || "Gallery Title"}
        </h1>

        {/* Description/Paragraph */}
        <p className="text-gray-600 text-center mb-6">
          {gallery.subject || "Explore our photo gallery to relive the moments captured beautifully. Click on the thumbnails below to view the images in full size."}
        </p>

        {/* Sub-images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {gallery.galleryPhotos.length > 1 ? (
            gallery.galleryPhotos.slice(1).map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setCurrentImageIndex(index + 1)} // Set the clicked image as the main image
              >
                <Image
                  src={photo.imageUrl || "/placeholder.svg"}
                  alt={photo.subject || "Gallery photo"} // Fallback alt text
                  fill
                  className="object-cover object-center"
                />
              </div>
            ))
          ) : (
            <p className="text-muted">No additional photos available.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default EventsPage;
