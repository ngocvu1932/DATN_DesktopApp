import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, {useRef} from 'react';

const Bills: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;

    if (element === null) {
      console.error('Không tìm thấy dữ liệu để in.');
      return;
    }

    const canvas = await html2canvas(element);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const pdfData = pdf.output('datauristring').split(',')[1];
    const message = await window.electronAPI.savePdf(pdfData);
    alert(message);
  };

  return (
    <div ref={printRef} className="invoice-content p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">HÓA ĐƠN</h1>
      <div className="mb-4">
        <p className="font-semibold">
          Mã hóa đơn: <span className="font-normal">#123456</span>
        </p>
        <p className="font-semibold">
          Ngày: <span className="font-normal">30/10/2024</span>
        </p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Chi tiết hóa đơn:</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Tên sản phẩm</th>
            <th className="border border-gray-300 p-2">Số lượng</th>
            <th className="border border-gray-300 p-2">Giá</th>
            <th className="border border-gray-300 p-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">Sản phẩm 1</td>
            <td className="border border-gray-300 p-2">2</td>
            <td className="border border-gray-300 p-2">100.000 VND</td>
            <td className="border border-gray-300 p-2">200.000 VND</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">Sản phẩm 2</td>
            <td className="border border-gray-300 p-2">1</td>
            <td className="border border-gray-300 p-2">150.000 VND</td>
            <td className="border border-gray-300 p-2">150.000 VND</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex justify-between font-semibold">
        <p>Tổng cộng:</p>
        <p>350.000 VND</p>
      </div>
      <div className="mt-4 text-center text-gray-600">
        <p>Cảm ơn bạn đã mua hàng!</p>
      </div>
      <button onClick={handleDownloadPdf}>Xuất PDF</button>;
    </div>
  );
};

export default Bills;
