import { useState } from 'preact/hooks';
import { addProduct } from '../../stores/orderStore.js';

export default function AddToOrderControls({ product }) {
  const [quantities, setQuantities] = useState(
    product.availableSizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
  );
  const [feedback, setFeedback] = useState('');

  const handleQuantityChange = (size, quantity) => {
    const newQuantity = Math.max(0, parseInt(quantity, 10) || 0);
    setQuantities(prev => ({ ...prev, [size]: newQuantity }));
  };

  const handleAddToCart = () => {
    let itemsAdded = 0;
    let feedbackMessage = 'Agregado: ';

    for (const size in quantities) {
      if (quantities.hasOwnProperty(size) && quantities?.[size] > 0) {
        addProduct(product, size, quantities?.[size]);
        itemsAdded++;
        feedbackMessage += `${quantities?.[size]} x ${product.name} (Talla: ${size}), `;
      }
    }

    if (itemsAdded > 0) {
      setFeedback(feedbackMessage.slice(0, -2) + '.');
      setQuantities(product.availableSizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}));
    } else {
      setFeedback('Selecciona la cantidad por talla.');
    }

    setTimeout(() => setFeedback(''), 3000);
  };

  const styles = {
    sizeSelector: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '1rem',
    },
    sizeItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.8rem',
      border: `1px solid var(--color-border)`,
      borderRadius: '8px',
      backgroundColor: 'rgba(var(--color-surface-rgb), 0.85)', // Fondo semitransparente
      backdropFilter: 'blur(10px)', // Efecto de desenfoque
    },
    sizeLabel: {
      fontSize: '0.95rem',
      marginBottom: '0.4rem',
      color: 'var(--color-text)',
      fontWeight: 'bold',
    },
    quantityInput: {
      width: '60px',
      padding: '0.5rem',
      borderRadius: '5px',
      border: `1px solid var(--color-accent)`,
      textAlign: 'center',
      color: 'var(--color-text)',
      backgroundColor: 'rgba(var(--color-background-rgb), 0.7)', // Fondo semitransparente
    },
    addButton: {
      padding: '0.8rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-background)',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      marginTop: '1.2rem',
    },
    feedback: {
      marginTop: '1rem',
      fontSize: '0.9rem',
      color: 'var(--color-accent)',
      fontStyle: 'italic',
    },
  };

  return (
    <div>
      <div style={styles.sizeSelector}>
        {product.availableSizes.map(size => (
          <div key={size} style={styles.sizeItem}>
            <label htmlFor={`quantity-${product.id}-${size}`} style={styles.sizeLabel}>
            <span>Talle: </span>  {size}
            </label>
            <input
              id={`quantity-${product.id}-${size}`}
              type="number"
              min="0"
              value={quantities?.[size] || ''}
              onChange={(e) => handleQuantityChange(size, e.target.value)}
              style={styles.quantityInput}
            />
          </div>
        ))}
      </div>
      <button onClick={handleAddToCart} style={styles.addButton}>
        Agregar Seleccionados
      </button>
      {feedback && <p style={styles.feedback}>{feedback}</p>}
    </div>
  );
}