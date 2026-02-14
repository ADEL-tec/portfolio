import { useState } from "react";

function WorkGallery({ gallery }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openZoom = (index) => {
    console.log("clicked");
    setCurrentIndex(index);
    setSelectedImage(gallery[index]);
  };

  const closeZoom = () => {
    setSelectedImage(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % gallery.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(gallery[nextIndex]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(gallery[prevIndex]);
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 lg:px-12">
      <p className="font-medium text-purple-400 px-10 py-1.5 rounded-full bg-purple-950 border border-purple-800 w-max mx-auto">
        Gallery
      </p>
      <h1 className="text-3xl font-semibold text-center mt-4">
        Explore App Screenshot
      </h1>
      <p className="text-sm text-slate dark:text-white/80 text-center mt-2 max-w-lg mx-auto">
        Click on any screenshot to view it in full size. Use the navigation
        arrows to browse through the gallery and see more details of each
        screen.
      </p>
      <div className="flex flex-wrap items-center justify-center mt-10 mx-auto gap-4">
        {gallery.map((image, index) => (
          <div key={image} className="relative group">
            <img
              className="max-w-56 h-80 object-cover rounded-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              src={image}
              alt="image"
            />
            <div
              className="absolute cursor-pointer inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
              onClick={() => openZoom(index)}
            >
              <span className="text-white text-sm">Click to zoom</span>
            </div>
          </div>
        ))}
      </div>
      {/* Zoom Modal with Navigation */}
      {selectedImage && (
        <div
          className="fixed inset-0  bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={closeZoom}
        >
          {/* Close button */}
          <button
            onClick={closeZoom}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-all z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous button */}
          <button
            onClick={prevImage}
            className="absolute left-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image */}
          <div className="relative max-w-7xl max-h-[90vh] px-12">
            <img
              src={selectedImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {gallery.length}
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={nextImage}
            className="absolute right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkGallery;
