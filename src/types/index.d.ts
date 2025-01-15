interface GalleryPhoto {
    id: number;
    imageUrl: string;
    subject: string;
  }

interface Event {
    id: number;
    title: string;
    coverImageUrl: string;
    subject: string;
    photosCount: number;
    galleryPhotos: GalleryPhoto[];
  }