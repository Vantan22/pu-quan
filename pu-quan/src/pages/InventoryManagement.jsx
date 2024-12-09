import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Space,
  Tag,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { TabPane } = Tabs;

function InventoryManagement() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const columns = [
    { title: "Tên nguyên liệu", dataIndex: "name", key: "name" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <Space>
          <span>
            {quantity} {record.unit}
          </span>
          {quantity <= record.minQuantity && (
            <Tag color="error" icon={<WarningOutlined />}>
              Sắp hết
            </Tag>
          )}
        </Space>
      ),
    },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Tag
          color={record.quantity <= record.minQuantity ? "error" : "success"}
        >
          {record.quantity <= record.minQuantity ? "Cần nhập thêm" : "Đủ dùng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleAddStock(record)}
          >
            Nhập kho
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAddStock = (record) => {
    Modal.confirm({
      title: `Nhập thêm ${record.name}`,
      content: (
        <Form layout="vertical">
          <Form.Item label="Số lượng nhập thêm" name="addQuantity">
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      ),
      onOk: async (values) => {
        try {
          await updateInventory({
            ...record,
            quantity: record.quantity + values.addQuantity,
          });
          message.success("Đã cập nhật số lượng");
        } catch (error) {
          message.error("Có lỗi xảy ra");
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        await updateInventory({ ...editingItem, ...values });
        message.success("Đã cập nhật nguyên liệu");
      } else {
        await updateInventory({ id: Date.now(), ...values });
        message.success("Đã thêm nguyên liệu mới");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingItem(null);
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <div>
      <Card title="Quản lý kho">
        <Tabs defaultActiveKey="inventory">
          <TabPane tab="Tồn kho" key="inventory">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingItem(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
              className="mb-4"
            >
              Thêm nguyên liệu
            </Button>

            <Table columns={columns} dataSource={inventory} rowKey="id" />
          </TabPane>

          <TabPane tab="Lịch sử nhập kho" key="history">
            {/* Thêm bảng lịch sử nhập kho ở đây */}
          </TabPane>
        </Tabs>

        <Modal
          title={editingItem ? "Sửa nguyên liệu" : "Thêm nguyên liệu mới"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Tên nguyên liệu"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
              <Select>
                <Option value="kg">Kilogram (kg)</Option>
                <Option value="g">Gram (g)</Option>
                <Option value="l">Lít (l)</Option>
                <Option value="ml">Mililít (ml)</Option>
                <Option value="piece">Cái</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="minQuantity"
              label="Số lượng tối thiểu"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item className="text-right">
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  {editingItem ? "Cập nhật" : "Thêm mới"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default InventoryManagement;
