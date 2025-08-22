import { useStore } from '@nanostores/preact';
import { order, removeProduct, updateCustomerField } from '../../stores/orderStore.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function OrderManager() {
  const $order = useStore(order);
  const total = $order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    updateCustomerField(e.target.name, e.target.value);
  };
  
  const generateWhatsAppLink = () => {
    if ($order.items.length === 0) return '#';
    
    let text = '¡Hola, Ascend! Quisiera solicitar un presupuesto para el siguiente pedido:\n\n';
    $order.items.forEach(item => {
      text += `*Producto:* ${item.name}\n`;
      text += `*Talla:* ${item.size}\n`;
      text += `*Cantidad:* ${item.quantity}\n`;
      text += `*Subtotal:* $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    text += `*Total del Pedido: $${total.toFixed(2)}*\n\n`;
    
    text += `*Mis Datos de Contacto:*\n`;
    text += `*Nombre:* ${$order.customer.name || 'No especificado'}\n`;
    text += `*Dirección:* ${$order.customer.address || 'No especificado'}\n`;
    text += `*Teléfono:* ${$order.customer.phone || 'No especificado'}\n`;
    text += `*Email:* ${$order.customer.email || 'No especificado'}`;
    
    return `https://wa.me/5493564575862?text=${encodeURIComponent(text)}`;
  };

  const exportToPDF = () => {
      const input = document.getElementById('pdf-export-content');
      // Aumentamos la escala para mejor calidad
      html2canvas(input, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          // Usamos formato A4: 210mm de ancho
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
          const pdfHeight = (pdfWidth - 20) / ratio;

          // Aquí podrías agregar el logo
          // pdf.addImage(logoBase64, 'PNG', 10, 10, 50, 20);
          pdf.setFontSize(22);
          pdf.setTextColor('#203850');
          pdf.text('Resumen de Pedido - ASCEND', 10, 20);
          pdf.setFontSize(12);
          pdf.setTextColor('#485C70');
          pdf.text('VIRTUS ET EXIMIA', 10, 28);
          
          pdf.addImage(imgData, 'PNG', 10, 40, pdfWidth - 20, pdfHeight);
          pdf.save('pedido-ascend.pdf');
      });
  };

  return (
    <section id="order-section">
      <h2>Resumen del Pedido</h2>
      {$order.items.length === 0 ? (
        <p>Aún no has agregado productos a tu pedido.</p>
      ) : (
        <div id="pdf-export-content">
          <div>
            {$order.items.map(item => (
              <div key={item.uniqueId} className="order-item">
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-meta">Talla: {item.size} | Cantidad: {item.quantity}</p>
                </div>
                <div className="item-actions">
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                    <button className="remove-btn" onClick={() => removeProduct(item.uniqueId)} title="Eliminar item">×</button>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            Total: ${total.toFixed(2)}
          </div>
          <div className="customer-form">
            <h3>Tus Datos para el Envío</h3>
            <input type="text" name="name" placeholder="Nombre Completo" onInput={handleInputChange} />
            <input type="text" name="phone" placeholder="Teléfono (WhatsApp)" onInput={handleInputChange} />
            <input type="email" name="email" placeholder="Email" onInput={handleInputChange} />
            <input type="text" name="address" placeholder="Dirección de Envío" onInput={handleInputChange} />
          </div>
        </div>
      )}
      <div className="order-actions">
        <button onClick={exportToPDF} disabled={$order.items.length === 0}>Exportar a PDF</button>
        <a href={generateWhatsAppLink()} className="button" target="_blank" rel="noopener noreferrer" style={$order.items.length === 0 ? {pointerEvents: 'none', opacity: 0.5} : {}}>
            Solicitar por WhatsApp
        </a>
      </div>
    </section>
  );
}