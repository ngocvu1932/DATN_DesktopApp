import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import './index.css';
import {IOrder} from '../../models/order';
import {formatPrice} from '../../utils/formatPrice';
import {toast} from 'react-toastify';

interface IBillsProps {
  data: IOrder;
  onClosed?: () => void;
}

const Bills = forwardRef((props: IBillsProps, ref) => {
  const printRef = useRef<HTMLDivElement>(null);
  const {data, onClosed} = props;
  const toDay = new Date();

  const handleDownloadPdf = async () => {
    const nameFile = `Khach-hang-${data.id ?? 0}_${toDay.toLocaleString('vi-VN').replaceAll(/[/z: ]/g, '')}.pdf`;
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
    const res = await window.electronAPI.savePdf(pdfData, nameFile);

    if (res.status == 200) {
      toast.success(`Xuất hóa đơn thành công!`, {autoClose: 2000});
      // alert(res.message);
      await window.electronAPI.showAlertDialog(res.message ?? '');
      onClosed && onClosed();
    } else {
      toast.error(`Có lỗi khi xuất hóa đơn!`, {autoClose: 2000});
      onClosed && onClosed();
    }
  };

  useImperativeHandle(ref, () => ({
    exportInvoice: handleDownloadPdf,
  }));

  return (
    <div ref={printRef} className=" w-full p-4 bg-white shadow-2xl rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center font-source-code mt-3">GLAMOUR BEAUTY SPA</h1>
      <div className="mb-4">
        <p className="font-medium">
          Mã hóa đơn:{' '}
          <span className="font-normal">
            {toDay.toLocaleString('vi-VN').replaceAll(/[/z: ]/g, '')}#{data.id}
          </span>
        </p>
        <p className="font-medium">
          Ngày xuất hóa đơn: <span className="font-normal">{toDay.toLocaleString('vi-VI')}</span>
        </p>

        <p className="font-medium">
          Tên khách hàng: <span className="font-bold">Khách hàng {data.id}</span>
        </p>
        <p className="font-medium">
          Tên nhân viên: <span className="font-bold">Nhân viên {data.customerId}</span>
        </p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Chi tiết dịch vụ:</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">STT</th>
            <th className="border border-gray-300 p-2">Tên dịch vụ</th>
            <th className="border border-gray-300 p-2">Số lượng</th>
            <th className="border border-gray-300 p-2">Giá</th>
            <th className="border border-gray-300 p-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {props.data.orderDetails.map((orderDetail, index) => {
            return (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center">{index + 1}</div>
                </td>
                <td className="border border-gray-300 p-2">{orderDetail.serviceName}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-end">{orderDetail.quantity}</div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-end">{formatPrice(orderDetail.price.toString())}</div>
                </td>
                <td className="border border-gray-300 p-2">
                  {' '}
                  <div className="flex justify-end">{formatPrice(orderDetail.totalAmount.toString())}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between font-semibold">
        <p>Tổng cộng:</p>
        <p className="font-bold">{formatPrice(data.totalAmount.toString())}</p>
      </div>
      <div className="mt-4 text-center text-gray-600">
        <p>Cảm ơn bạn đã mua hàng!</p>
      </div>
    </div>
  );
});

export default Bills;
