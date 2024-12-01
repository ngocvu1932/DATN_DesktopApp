import React, { useEffect, useState } from 'react';
import { Form, Radio, Table, Modal, Card, Descriptions, Timeline } from 'antd';
import 'tailwindcss/tailwind.css';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useLocation, useParams } from 'react-router-dom';
import { serviceRequestFindById } from '../../api/service-request';

interface ServiceRequestImage {
    id: number;
    imageUrl: string;
    description: string;
    status: number;
    customerId: number;
    employeeId: number;
    uploadedAt: string;
    isRemoved: boolean;
    serviceRequestStatusHistoryId: number;
    createdAt: string;
    updatedAt: string;
}

interface StatusHistory {
    id: number;
    status: number;
    note: string | null;
    userId: number | null;
    createdAt: string;
    updatedAt: string;
    isRemoved: boolean;
    serviceRequestId: number;
    serviceRequestImages: ServiceRequestImage[];
}

interface ServiceRequestDetailProps {
    serviceRequestId: number | undefined;
}

const ServiceRequestDetail: React.FC<ServiceRequestDetailProps> = ({ serviceRequestId }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectedImageDescription, setSelectedImageDescription] = useState<string>('');
    const [isAllImagesModalVisible, setIsAllImagesModalVisible] = useState(false);
    const [request, setData] = useState<any>();
    const [selectedStatusIndex, setSelectedStatusIndex] = useState<number>(0);


    useEffect(() => {
        if (serviceRequestId != undefined) {
            serviceRequestFindById(serviceRequestId).then((response) => {
                console.log("111111", response);

                if (response?.statusCode == 200) {
                    setData(response.data);
                }
            })
        }
    }, [serviceRequestId]);

    const showModal = (imageUrl: string, description: string) => {
        setSelectedImageUrl(imageUrl);
        setSelectedImageDescription(description)
        setIsModalVisible(true);
    };

    const showAllImagesModal = (images: ServiceRequestImage[]) => {
        setSelectedStatusIndex(images[0].status);
        setIsAllImagesModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsAllImagesModalVisible(false)
    };

    const onFinish = (values: any) => {
        console.log('Received values:', values);
    };

    return (

        <div>
            {request && (
                <div key={request.id}>
                    <div>
                        <Card title="Thông tin yêu cầu dịch vụ  " bordered={false}>
                            <Descriptions column={2}>
                                <Descriptions.Item label="Mã yêu cầu">{request.code}</Descriptions.Item>
                                <Descriptions.Item label="Mã lịch hẹn">{request.appointment.code}</Descriptions.Item>
                                <Descriptions.Item label="Khách hàng">{request.customer.name}</Descriptions.Item>
                                <Descriptions.Item label="Nhân viên">{request.employee.name}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian check-in">{new Date(request.checkInTime).toLocaleString()}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái hiện tại">{request.currentStatus}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian tạo">{new Date(request.createdAt).toLocaleString()}</Descriptions.Item>
                            </Descriptions>

                        </Card>
                    </div>

                    <div>
                        <Card title="Lịch sử liệu trình" bordered={false} style={{ marginTop: '20px' }}>

                            <Table
                                scroll={{ y: 250 }}
                                onScroll={(e) => {
                                    if (e.currentTarget.scrollTop + e.currentTarget.clientHeight === e.currentTarget.scrollHeight) {
                                        console.log('Cuộn xuống dưới cùng');

                                    }
                                }}
                                dataSource={request.statusHistory}
                                columns={[
                                    {
                                        title: 'Trạng thái',
                                        dataIndex: 'status',
                                        key: 'status',
                                    },
                                    {
                                        title: 'Ngày cập nhật',
                                        dataIndex: 'createdAt',
                                        // key: 'createdAt',
                                        render: (createdAt: string) => (
                                            <p>{new Date(createdAt).toLocaleString()}</p>
                                        ),
                                    },
                                    {
                                        title: 'Ghi chú',
                                        dataIndex: 'note',
                                        key: 'note',
                                    },
                                    {
                                        title: 'Hình ảnh',
                                        dataIndex: 'serviceRequestImages',
                                        key: 'images',
                                        render: (images: ServiceRequestImage[]) => (
                                            <div className="flex gap-2">
                                                {images.slice(0, 4).map((image) => (
                                                    <div
                                                        key={image.id}
                                                        onClick={() => showModal(image.imageUrl, image.description)}  // Truyền mô tả khi nhấn vào ảnh
                                                        className="cursor-pointer"
                                                    >
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={image.description}
                                                            className="w-20 h-20 object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {images.length > 4 && (
                                                    <button
                                                        className="text-blue-500 cursor-pointer"
                                                        onClick={() => showAllImagesModal(images)}
                                                    >
                                                        Xem tất cả...
                                                    </button>
                                                )}
                                            </div>
                                        ),
                                    }
                                ]}
                                rowKey="id"
                            />
                        </Card>
                    </div>
                    <Modal
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        <div className="text-center">
                            <img
                                src={selectedImageUrl || ''}
                                alt="Phóng to"
                                className="w-full h-auto object-contain"
                            />
                            <p className="mt-4 text-center">{selectedImageDescription}</p>
                        </div>
                    </Modal>
                    <Modal
                        visible={isAllImagesModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={1000}
                    >
                        <div className="flex gap-4 flex-wrap">
                            {request?.statusHistory?.[selectedStatusIndex]?.serviceRequestImages?.length > 0 ? (
                                request.statusHistory[selectedStatusIndex].serviceRequestImages.map((image: any) => (
                                    <div key={image.id} className="w-1/3 p-2 cursor-pointer">
                                        <img
                                            src={image.imageUrl}
                                            alt={image.description}
                                            className="w-full h-48 object-cover"
                                            onClick={() => showModal(image.imageUrl, image.description)}
                                        />
                                        <p className="text-center mt-2">{image.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center w-full">Không có hình ảnh nào.</p>
                            )}
                        </div>
                    </Modal>


                    {/* <Modal
                        visible={isAllImagesModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={1000}
                    >
                        <div className="flex gap-4 flex-wrap">
                            {request.statusHistory[0]?.serviceRequestImages.map((image: any) => (
                                <div key={image.id} className="w-1/3 p-2 cursor-pointer">
                                    <img
                                        src={image.imageUrl}
                                        alt={image.description}
                                        className="w-full h-48 object-cover"
                                        onClick={() => showModal(image.imageUrl, image.description)}
                                    />
                                    <p className="text-center mt-2">{image.description}</p>
                                </div>
                            ))}
                        </div>
                    </Modal> */}
                </div>
            )}
        </div>
    );
};


export default ServiceRequestDetail;