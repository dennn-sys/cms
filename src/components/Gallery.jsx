import { useState, useEffect, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function Gallery() {
  const photos = collection(db, "photos");
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  async function getPhotos() {
    try {
      const data = await getDocs(photos);
      setImages(data.docs.map((doc) => doc.data().imageUrl));
    } catch (error) {
      alert("Failed to fetch data. Please try again later.");
    }
  }

  useEffect(() => {
    getPhotos();
  }, []);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div
      id="photos"
      className="space-y-2 rounded-lg bg-background p-4 text-foreground shadow-md"
    >
      <h2 className=" text-xl font-bold">Photos</h2>
      <p className="pb-2 ">Here are some of my graphic design works.</p>
      <div className="grid grid-cols-4 gap-1 overflow-clip rounded-lg md:grid-cols-6 lg:grid-cols-3">
        {images.map((src, index) => (
          <img
            src={src}
            onClick={() => openImageViewer(index)}
            width="300"
            height="300"
            key={index}
            alt=""
            className="size-[155px] object-cover"
          />
        ))}

        {isViewerOpen && (
          <ImageViewer
            src={images}
            currentIndex={currentImage}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        )}
      </div>
    </div>
  );
}
