import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Typography, 
  InputNumber, 
  Space, 
  Table,
  message,
  Modal,
  Tabs,
  Tag,
  Spin 
} from 'antd'
import { 
  PlusOutlined, 
  PrinterOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons'
import { useMenu } from '../hooks/useMenu'
import { useTableOrders, useCreateOrder, useUpdateOrder } from '../hooks/useOrder'
import { useUpdateTableStatus } from '../hooks/useTable'

const { Title } = Typography

function TableOrder() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Queries & Mutations
  const { data: menu, isLoading: menuLoading } = useMenu()
  const { data: orders, isLoading: ordersLoading } = useTableOrders(tableId)
  const createOrder = useCreateOrder()
  const updateOrder = useUpdateOrder()
  const updateTableStatus = useUpdateTableStatus()

  const handleAddItem = (item) => {
    Modal.confirm({
      title: `Thêm ${item.name}?`,
      content: `Giá: ${item.price.toLocaleString()}đ`,
      onOk: () => {
        createOrder.mutate({
          tableId,
          items: [{
            ...item,
            quantity: 1,
            status: 'pending'
          }]
        })
      }
    })
  }

  const handleUpdateQuantity = (orderId, itemId, quantity) => {
    if (quantity === 0) {
      Modal.confirm({
        title: 'Xác nhận xóa?',
        content: 'Bạn có chắc chắn muốn xóa món này?',
        onOk: () => {
          updateOrder.mutate({
            orderId,
            data: {
              items: orders.find(o => o.id === orderId).items.filter(i => i.id !== itemId)
            }
          })
        }
      })
    } else {
      updateOrder.mutate({
        orderId,
        data: {
          items: orders.find(o => o.id === orderId).items.map(i => 
            i.id === itemId ? { ...i, quantity } : i
          )
        }
      })
    }
  }

  const handlePayment = () => {
    Modal.confirm({
      title: 'Xác nhận thanh toán?',
      content: 'Bàn sẽ chuyển sang trạng thái dọn dẹp sau khi thanh toán',
      onOk: async () => {
        try {
          await updateTableStatus.mutateAsync({ tableId, status: 'cleaning' })
          navigate(`/payment/${tableId}`)
        } catch (error) {
          message.error('Có lỗi xảy ra')
        }
      }
    })
  }

  const categories = [
    { key: 'all', label: 'Tất cả' },
    { key: 'main', label: 'Món chính' },
    { key: 'drink', label: 'Đồ uống' },
    { key: 'dessert', label: 'Tráng miệng' }
  ]

  const filteredMenu = selectedCategory === 'all' 
    ? menu 
    : menu?.filter(item => item.category === selectedCategory)

  const orderColumns = [
    { title: 'Tên món', dataIndex: 'name' },
    { 
      title: 'Đơn giá', 
      dataIndex: 'price',
      render: price => `${price.toLocaleString()}đ`
    },
    { 
      title: 'Số lượng', 
      dataIndex: 'quantity',
      width: 120,
      render: (quantity, record) => (
        <InputNumber
          min={0}
          value={quantity}
          onChange={(value) => handleUpdateQuantity(record.orderId, record.id, value)}
        />
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: status => (
        <Tag 
          icon={status === 'pending' ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
          color={status === 'pending' ? 'warning' : 'success'}
        >
          {status === 'pending' ? 'Chờ xử lý' : 'Đang chế biến'}
        </Tag>
      )
    },
    {
      title: 'Thành tiền',
      render: record => `${(record.price * record.quantity).toLocaleString()}đ`
    }
  ]

  if (menuLoading || ordersLoading) {
    return <Spin size="large" />
  }

  const currentOrders = orders?.flatMap(order => 
    order.items.map(item => ({
      ...item,
      orderId: order.id,
      key: `${order.id}-${item.id}`
    }))
  ) || []

  const total = currentOrders.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space className="w-full justify-between">
          <Title level={2}>Bàn {tableId}</Title>
          <Button 
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePayment}
          >
            Thanh toán
          </Button>
        </Space>
      </Col>

      <Col span={14}>
        <Card title="Menu">
          <Space className="mb-4">
            {categories.map(cat => (
              <Button
                key={cat.key}
                type={selectedCategory === cat.key ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </Button>
            ))}
          </Space>

          <Row gutter={[16, 16]}>
            {filteredMenu?.map(item => (
              <Col key={item.id} span={12}>
                <Card 
                  hoverable 
                  onClick={() => handleAddItem(item)}
                  className="text-center"
                >
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <Space direction="vertical" className="w-full">
                    <Title level={4}>{item.name}</Title>
                    <div>{item.price.toLocaleString()}đ</div>
                    <Button type="primary" icon={<PlusOutlined />}>
                      Thêm món
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>

      <Col span={10}>
        <Card title="Đơn hàng hiện tại">
          <Table
            dataSource={currentOrders}
            columns={orderColumns}
            pagination={false}
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={4}>
                    <strong>Tổng cộng</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <strong>{total.toLocaleString()}đ</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default TableOrder 
