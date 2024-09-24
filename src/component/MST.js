import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button, message, Typography, ConfigProvider, Spin, Select, Empty } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, SecurityScanOutlined, FileTextOutlined, FrownOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const MST = React.memo(() => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showCompanyFields, setShowCompanyFields] = useState(false);
    const [ALoading, setALoading] = useState(false);

    const fetchCompanyInfo = useCallback(async (A) => {
        if (!/^\d{10}$/.test(A)) {
            return;
        }

        setALoading(true);
        try {
            const response = await axios.get(`https://esgoo.net/api-mst/${A}.htm`);
            const { data } = response.data;
            if (data) {
                form.setFieldsValue({
                    company_name: data.ten,
                    address: data.dc
                });
                setShowCompanyFields(true);
            } else {
                message.warning('Không tìm thấy thông tin công ty. Vui lòng nhập thông tin thủ công.');
                setShowCompanyFields(true);
            }
        } catch (error) {
            console.error('Error fetching company info:', error);
            message.error('Không tìm thấy thông tin công ty !');
            setShowCompanyFields(true);
        } finally {
            setALoading(false);
        }
    }, [form]);

    const onFinish = useCallback((values) => {
        setLoading(true);
        // Viết API POST về Thái SƠn
        setTimeout(() => {
            console.log('Form values:', values);
            message.success('Gửi thông tin thành công');
            setLoading(false);
            setCurrentStep(1);
        }, 1000);
    }, []);

    const formContainerStyle = {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    };

    const titleStyle = {
        fontSize: '23px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'left',
    };

    const Header = React.memo(() => (
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <Title style={titleStyle}>THÔNG TIN XUẤT HÓA ĐƠN</Title>
            <p style={{ lineHeight: 1.4, fontSize: 15 }}>Hóa đơn điện tử có mã xác thực của cơ quan thuế sẽ gởi về qua email</p>
        </div>
    ));

    const Step1 = React.memo(() => {
        const [A, setA] = useState('');

        useEffect(() => {
            if (A.length === 10) {
                fetchCompanyInfo(A);
            }
        }, [A]);

        return (
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name="restaurant"
                    rules={[{ required: true, message: 'Vui lòng chọn nhà hàng' }]}
                >
                    <Select
                        defaultValue="Chọn nhà hàng"
                        options={[
                            {
                                value: 'Test1',
                                label: 'Test1',
                            },
                            {
                                value: 'Test2',
                                label: 'Test2',
                            },
                        ]}
                        showSearch
                        notFoundContent={
                            <Empty
                                image={<FrownOutlined style={{ fontSize: 60, marginBottom: 0 }}/>}
                                description="Không tìm thấy nhà hàng"
                            />
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="bill_number"
                    rules={[{ required: true, message: 'Vui lòng nhập số bill' }]}
                >
                    <Input prefix={<FileTextOutlined />} placeholder="Nhập số bill" />
                </Form.Item>

                <Form.Item name="phone">
                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="tax_code"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã số thuế' },
                        { pattern: /^\d{10}$/, message: 'Mã số thuế không đúng định dạng' }
                    ]}
                >
                    <Input
                        prefix={<SecurityScanOutlined />}
                        placeholder="Nhập mã số thuế"
                        onChange={(e) => setA(e.target.value)}
                        suffix={ALoading ? <Spin size="small" /> : null}
                    />
                </Form.Item>

                {showCompanyFields && (
                    <>
                        <Form.Item
                            name="company_name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                        >
                            <Input
                                placeholder="Nhập tên công ty"
                            />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input.TextArea
                                prefix={<EnvironmentOutlined />}
                                placeholder="Địa chỉ"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                style={{ flex: 1 }}
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" type='email' />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%', height: '40px' }}
                    >
                        Gửi thông tin
                    </Button>
                </Form.Item>
            </Form>
        );
    });

    const Step2 = React.memo(() => (
        <div>
            <div>
                <Title style={titleStyle}>HÓA ĐƠN ĐANG ĐƯỢC XỬ LÝ</Title>
            </div>
            <Paragraph style={{ fontSize: 16 }}>
                Hóa đơn điện tử có mã xác thực của cơ quan thuế sẽ gửi về qua email.
            </Paragraph>
            <Paragraph style={{ fontSize: 16 }}>
                Nếu bạn cần thêm thông tin hay hỗ trợ, xin liên hệ tới số điện thoại:<a href="tel:02871087088" style={{ color: '#ae8f3d' }}> 02871 087 088</a>
            </Paragraph>
            <Button onClick={() => setCurrentStep(0)} style={{ marginTop: '0', paddingLeft: 0 }} type='link'>
                ← Nhập bill khác
            </Button>
        </div>
    ));

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#ae8f3d',
                },
                components: {
                    Button: {
                        colorPrimary: '#ae8f3d',
                        algorithm: true,
                    },
                    Input: {
                        borderRadius: 4,
                    },
                    Select: {
                        borderRadius: 4,
                    },
                },
            }}
        >
            <div className='header' >Phần Header Update</div>
            <div style={formContainerStyle}>
                {currentStep === 0 ? (
                    <>
                        <Header />
                        <Step1 />
                        <p style={{ color: 'red', fontSize: 13 }}>* Vui lòng kiểm tra thông tin chính xác trước khi gửi thông tin</p>
                    </>
                ) : (
                    <Step2 />
                )}
            </div>
        </ConfigProvider>
    );
});

export default MST;