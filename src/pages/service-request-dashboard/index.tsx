import React, { useState } from "react";
import { Table, Tooltip, Modal, Image, Radio, Card } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

export const serviceRequests = [
    {
        id: 5,
        code: "SN00000004",
        currentStatus: 2,
        checkInTime: "2024-10-28T15:23:09.000Z",
        completedTime: null,
        userId: 1,
        createdAt: "2024-10-28T15:23:09.000Z",
        updatedAt: "2024-10-28T15:23:09.000Z",
        isRemoved: false,
        branchId: null,
        employee: {
            id: 3,
            code: "NV000003",
            name: "name 1"
        },
        appointment: {
            id: 1,
            code: "AP000000",
            customerId: 2
        },
        statusHistory: [
            {
                id: 4,
                status: 2,
                note: "note trang thai 2",
                userId: 1,
                createdAt: "2024-10-28T15:23:10.000Z",
                updatedAt: "2024-10-28T15:23:10.000Z",
                isRemoved: false,
                serviceRequestId: 5,
                serviceRequestImages: [
                    {
                        id: 5,
                        imageUrl: "https://res.cloudinary.com/djlhcj7t8/image/upload/v1730142968/serviceRequestImage/3e0f7564-3a26-492d-94b9-622cecb9740e1730142964767.png",
                        description: "Hinh anh 1",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:16:08.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:16:08.000Z",
                        updatedAt: "2024-10-28T19:16:08.000Z"
                    },
                    {
                        id: 4,
                        imageUrl: "https://res.cloudinary.com/djlhcj7t8/image/upload/v1730142954/serviceRequestImage/e511199c-4ce9-4b02-8dea-9582ed23faea1730142951337.png",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                ]
            },
            {
                id: 4,
                status: 3,
                note: "note trang thai 3",
                userId: 1,
                createdAt: "2024-10-28T15:23:10.000Z",
                updatedAt: "2024-10-28T15:23:10.000Z",
                isRemoved: false,
                serviceRequestId: 5,
                serviceRequestImages: [
                    {
                        id: 99,
                        imageUrl: "https://res.cloudinary.com/djlhcj7t8/image/upload/v1730142968/serviceRequestImage/3e0f7564-3a26-492d-94b9-622cecb9740e1730142964767.png",
                        description: "Hinh anh 1",
                        status: 3,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:16:08.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:16:08.000Z",
                        updatedAt: "2024-10-28T19:16:08.000Z"
                    },
                    {
                        id: 100,
                        imageUrl: "https://res.cloudinary.com/djlhcj7t8/image/upload/v1730142954/serviceRequestImage/e511199c-4ce9-4b02-8dea-9582ed23faea1730142951337.png",
                        description: "da xong",
                        status: 3,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                ]
            }
        ],
        customer: {
            id: 2,
            code: "KH000002",
            name: "khach hang 2",
            phone: null,
            email: null
        }
    },
    {
        id: 4,
        code: "SN00000003",
        currentStatus: 1,
        checkInTime: "2024-10-28T15:18:42.000Z",
        completedTime: null,
        userId: 1,
        createdAt: "2024-10-28T15:18:42.000Z",
        updatedAt: "2024-11-02T14:58:30.000Z",
        isRemoved: false,
        branchId: 1,
        employee: {
            id: 3,
            code: "NV000003",
            name: "name 1"
        },
        appointment: {
            id: 6,
            code: "AP000002",
            customerId: 1
        },
        statusHistory: [
            {
                id: 14,
                status: 1,
                note: "note trang thai 1",
                userId: null,
                createdAt: "2024-11-02T14:58:04.000Z",
                updatedAt: "2024-11-02T14:58:31.000Z",
                isRemoved: false,
                serviceRequestId: 4,
                serviceRequestImages: []
            },
            {
                id: 13,
                status: 0,
                note: "xin chao11111113232",
                userId: null,
                createdAt: "2024-11-02T14:57:49.000Z",
                updatedAt: "2024-11-02T14:57:49.000Z",
                isRemoved: false,
                serviceRequestId: 4,
                serviceRequestImages: []
            },
            {
                id: 3,
                status: 3,
                note: null,
                userId: 1,
                createdAt: "2024-10-28T15:18:43.000Z",
                updatedAt: "2024-10-28T15:18:43.000Z",
                isRemoved: false,
                serviceRequestId: 4,
                serviceRequestImages: []
            }
        ],
        customer: {
            id: 1,
            code: "KH000001",
            name: "khach hang 1",
            phone: null,
            email: null
        }
    },
    {
        id: 3,
        code: "SN00000002",
        currentStatus: 3,
        checkInTime: "2024-10-26T13:16:16.000Z",
        completedTime: null,
        userId: 1,
        createdAt: "2024-10-26T13:16:16.000Z",
        updatedAt: "2024-10-26T13:16:16.000Z",
        isRemoved: false,
        branchId: 1,
        employee: {
            id: 3,
            code: "NV000003",
            name: "name 1"
        },
        appointment: {
            id: 6,
            code: "AP000002",
            customerId: 1
        },
        statusHistory: [
            {
                id: 2,
                status: 3,
                note: null,
                userId: 1,
                createdAt: "2024-10-26T13:16:16.000Z",
                updatedAt: "2024-10-26T13:16:16.000Z",
                isRemoved: false,
                serviceRequestId: 3,
                serviceRequestImages: []
            }
        ],
        customer: {
            id: 1,
            code: "KH000001",
            name: "khach hang 1",
            phone: null,
            email: null
        }
    },
    {
        id: 2,
        code: "SN00000001",
        currentStatus: 2,
        checkInTime: "2024-10-26T13:08:56.000Z",
        completedTime: null,
        userId: 1,
        createdAt: "2024-10-26T13:08:56.000Z",
        updatedAt: "2024-10-26T13:08:56.000Z",
        isRemoved: false,
        branchId: 1,
        employee: {
            id: 3,
            code: "NV000003",
            name: "name 1"
        },
        appointment: {
            id: 6,
            code: "AP000002",
            customerId: 1
        },
        statusHistory: [
            {
                id: 1,
                status: 2,
                note: null,
                userId: 1,
                createdAt: "2024-10-26T13:08:56.000Z",
                updatedAt: "2024-10-26T13:08:56.000Z",
                isRemoved: false,
                serviceRequestId: 2,
                serviceRequestImages: []
            }
        ],
        customer: {
            id: 1,
            code: "KH000001",
            name: "khach hang 1",
            phone: null,
            email: null
        }
    }
];

const statusOptions = [
    { value: 0, label: "Đang chờ", tooltip: "Yêu cầu đang chờ xử lý" },
    { value: 1, label: "Đang phục vụ", tooltip: "Đang được phục vụ" },
    { value: 2, label: "Đã xong", tooltip: "Yêu cầu đã hoàn thành" },
    { value: 3, label: "Thất bại", tooltip: "Yêu cầu thất bại" },
];

const ServiceRequestList: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [serviceRequestDetail, setServiceRequestDetail] = useState<any>(null);
    const navigate = useNavigate();

    const handleViewDetails = (record: any) => {
        // setSelectedRequest(record);
        // setIsModalOpen(true);
        navigate(`/service-request-detail`, { state: { record } });
    };

    const columns = [
        {
            title: "Ngày tạo",
            // dataIndex: "createdAt",
            // render ngay
            dataIndex: ["createdAt"],
            render: (createdAt: string) => (
                <p>{new Date(createdAt).toLocaleString()}</p>
            ),
            key: "createdAt",
            width: 200,
        },
        {
            title: "Mã yêu cầu",
            dataIndex: "code",
            key: "code",
            width: 200,
        },
        {
            title: "Mã lịch hẹn",
            dataIndex: ["appointment", "code"],
            key: "appointmentCode",
            width: 200,
        },
        {
            title: "Khách hàng",
            dataIndex: ["customer", "name"],
            key: "customerName",
            width: 150,
        },
        {
            title: "Nhân viên",
            dataIndex: ["employee", "name"],
            key: "employeeName",
            width: 150,
        },
        {
            title: 'Trạng thái hiện tại',
            dataIndex: 'currentStatus',
            key: 'currentStatus',
        },
        {
            title: "Trạng thái",
            key: "status",
            width: 200,
            render: (record: any) => (
                <Radio.Group value={record.currentStatus}>
                    {statusOptions.map((option) => (
                        <Tooltip title={option.tooltip} key={option.value}>
                            <Radio value={option.value} />
                        </Tooltip>
                    ))}
                </Radio.Group>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            fixed: "right",
            width: 150,
            render: (record: any) => (
                <div className="flex gap-2">
                    <Tooltip title="Sửa">
                        <EditOutlined
                            style={{ fontSize: "18px", cursor: "pointer" }}
                            onClick={() => {
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            style={{ fontSize: "18px", cursor: "pointer" }}
                            onClick={() => handleViewDetails(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 bg-white shadow-md">
            <h1 className="font-semibold text-lg mb-5">Danh sách yêu cầu dịch vụ</h1>
            {/* <Card title="Danh sách yêu cầu dịch vụ" className="mb-4" bordered={false} extra={<a href="#">Xem tất cả</a>}> */}

            {/* </Card> */}
            <Table
                columns={columns as any}
                dataSource={serviceRequests}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default ServiceRequestList;
