import { useState, useEffect } from 'preact/hooks';

export default function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div style={{ height: '400px', backgroundColor: '#333', display: 'grid', placeItems: 'center', color: '#eee' }}>Sin Imágenes</div>;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const styles = {
    carousel: {
      position: 'relative',
      height: '450px',
      overflow: 'hidden',
      borderRadius: '5px',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
      transition: 'opacity 0.5s ease-in-out',
      borderRadius: '5px',
    },
    activeImage: {
      opacity: 1,
    },
    controlButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.5)',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      cursor: 'pointer',
      zIndex: 10,
      opacity: 0.7,
      transition: 'opacity 0.3s ease',
    },
    controlButtonHover: {
      opacity: 1,
    },
    prevButton: {
      left: '10px',
      borderRadius: '5px',
    },
    nextButton: {
      right: '10px',
      borderRadius: '5px',
    },
  };

  return (
    <div style={styles.carousel}>
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={`Imagen ${index + 1} del producto`}
          style={index === currentIndex ? { ...styles.image, ...styles.activeImage } : styles.image}
        />
      ))}
      <button
        style={{ ...styles.controlButton, ...styles.prevButton }}
        onClick={goToPrevious}
      >
        &#10094;
      </button>
      <button
        style={{ ...styles.controlButton, ...styles.nextButton }}
        onClick={goToNext}
      >
        &#10095;
      </button>
    </div>
  );
}