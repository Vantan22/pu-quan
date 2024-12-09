import { useState } from 'react'
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
  Spin,
  Upload
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useMenu, useCreateMenuItem, useUpdateMenuItem } from '../hooks/useMenu'

const { Option } = Select

function MenuManagement() {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [imageUrl, setImageUrl] = useState('')

  const { data: menu, isLoading } = useMenu()
  const createMenuItem = useCreateMenuItem()
  const updateMenuItem = useUpdateMenuItem()

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: 100,
      render: (image) => (
        image ? <img src={image} alt="food" className="w-16 h-16 object-cover rounded" /> : null
      )
    },
    { title: 'Tên món', dataIndex: 'name', key: 'name' },
    { 
      title: 'Giá', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => `${price.toLocaleString()}đ` 
    },
    { 
      title: 'Danh mục', 
      dataIndex: 'category', 
      key: 'category',
      render: (category) => {
        const categories = {
          main: 'Món chính',
          drink: 'Đồ uống',
          dessert: 'Tráng miệng'
        }
        return categories[category] || category
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang bán' : 'Ngừng bán'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  const handleEdit = (record) => {
    setEditingItem(record)
    setImageUrl(record.image)
    form.setFieldsValue({
      ...record,
      price: record.price / 1000 // Chuyển đổi từ đồng sang nghìn đồng
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: 'Bạn có chắc chắn muốn xóa món ăn này?',
      onOk: () => {
        // Thêm mutation xóa ở đây
        message.success('Đã xóa món ăn')
      }
    })
  }

  const handleSubmit = (values) => {
    const data = {
      ...values,
      price: values.price * 1000, // Chuyển đổi từ nghìn đồng sang đồng
      image: imageUrl
    }

    if (editingItem) {
      updateMenuItem.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            setIsModalVisible(false)
            form.resetFields()
            setEditingItem(null)
            setImageUrl('')
          }
        }
      )
    } else {
      createMenuItem.mutate(data, {
        onSuccess: () => {
          setIsModalVisible(false)
          form.resetFields()
          setImageUrl('')
        }
      })
    }
  }

  const uploadProps = {
    name: 'file',
    action: `${import.meta.env.VITE_API_URL}/upload`,
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        setImageUrl(info.file.response.url)
        message.success('Tải ảnh lên thành công')
      } else if (info.file.status === 'error') {
        message.error('Tải ảnh lên thất bại')
      }
    },
  }

  if (isLoading) {
    return <Spin size="large" />
  }

  return (
    <Card 
      title="Quản lý menu"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null)
            form.resetFields()
            setImageUrl('')
            setIsModalVisible(true)
          }}
        >
          Thêm món mới
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={menu}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingItem ? "Sửa món ăn" : "Thêm món mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setImageUrl('')
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên món"
            rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (nghìn đồng)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select>
              <Option value="main">Món chính</Option>
              <Option value="drink">Đồ uống</Option>
              <Option value="dessert">Tráng miệng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="active">Đang bán</Option>
              <Option value="inactive">Ngừng bán</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="preview" 
                className="mt-2 w-32 h-32 object-cover rounded" 
              />
            )}
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false)
                form.resetFields()
                setImageUrl('')
              }}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createMenuItem.isLoading || updateMenuItem.isLoading}
              >
                {editingItem ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default MenuManagement 
