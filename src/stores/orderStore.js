import { map } from 'nanostores';

// Estado inicial del pedido
export const order = map({
  items: [],
  customer: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
});

// Función para agregar un producto al pedido
export function addProduct(product, size, quantity) {
  const currentItems = order.get().items;
  const uniqueId = `${product.id}-${size}`;
  const existingItemIndex = currentItems.findIndex(item => item.uniqueId === uniqueId);

  if (existingItemIndex > -1) {
    // Si el item (mismo producto y misma talla) ya existe, actualiza la cantidad
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex].quantity += quantity;
    order.setKey('items', updatedItems);
  } else {
    // Si no existe, lo añade como un nuevo item
    const newItem = { 
      ...product, 
      size, 
      quantity, 
      uniqueId 
    };
    order.setKey('items', [...currentItems, newItem]);
  }
}

// Función para eliminar un producto del pedido
export function removeProduct(uniqueId) {
  const currentItems = order.get().items;
  const updatedItems = currentItems.filter(item => item.uniqueId !== uniqueId);
  order.setKey('items', updatedItems);
}

// Función para actualizar los datos del cliente
export function updateCustomerField(field, value) {
    const currentCustomer = order.get().customer;
    order.setKey('customer', { ...currentCustomer, [field]: value });
}