import { useState } from 'react'
import { Card, Row, Col, Button, Typography, Tag, Space, message, Spin } from 'antd'
import { CheckOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useOrders, useUpdateOrder } from '../hooks/useOrder'

const { Title, Text } = Typography

function KitchenDisplay() {
  const { data: pendingOrders, isLoading } = useOrders({ 
    status: ['pending', 'processing'] 
  })
  const updateOrder = useUpdateOrder()

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrder.mutateAsync({ orderId, data: { status } })
      message.success('Đã cập nhật trạng thái')
    } catch (error) {
      message.error('Có lỗi xảy ra')
    }
  }

  if (isLoading) {
    return <Spin size="large" />
  }

  return (
    <div>
      <Title level={2}>Màn hình bếp</Title>
      <Row gutter={[16, 16]}>
        {pendingOrders?.map(order => (
          <Col key={order.id} xs={24} sm={12} lg={8}>
            <Card
              title={
                <Space>
                  <span>Bàn {order.tableId}</span>
                  <Tag color={order.status === 'pending' ? 'gold' : 'processing'}>
                    {order.status === 'pending' ? (
                      <><ClockCircleOutlined /> Chờ chế biến</>
                    ) : (
                      <><CheckOutlined /> Đang chế biến</>
                    )}
                  </Tag>
                </Space>
              }
              extra={
                <Text type="secondary">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </Text>
              }
            >
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <Space>
                      <span className="font-bold">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </Space>
                    <Tag color={item.status === 'pending' ? 'default' : 'success'}>
                      {item.status === 'pending' ? 'Chờ' : 'Xong'}
                    </Tag>
                  </div>
                ))}

                <div className="pt-4 border-t mt-4">
                  <Space className="w-full justify-end">
                    {order.status === 'pending' ? (
                      <Button
                        type="primary"
                        onClick={() => handleStatusChange(order.id, 'processing')}
                      >
                        Bắt đầu chế biến
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => handleStatusChange(order.id, 'completed')}
                      >
                        Hoàn thành
                      </Button>
                    )}
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default KitchenDisplay 
