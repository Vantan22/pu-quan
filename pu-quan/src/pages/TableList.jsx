import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Badge,
  Typography,
  Modal,
  Button,
  message,
} from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useTables, useUpdateTableStatus } from "@/hooks/useTable";
import { useLoading } from '@/contexts/LoadingContext'
import { useEffect } from 'react'

const { Title } = Typography;

const statusColors = {
  empty: "green",
  occupied: "red",
  cleaning: "gold",
};

const statusText = {
  empty: "Trống",
  occupied: "Có khách",
  cleaning: "Đang dọn dẹp",
};

// Mock data for testing
const mockTables = [
  {
    id: 1,
    name: "Bàn 1",
    status: "empty",
  },
  {
    id: 2,
    name: "Bàn 2",
    status: "occupied",
    startTime: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Bàn 3",
    status: "cleaning",
  },
];

function TableList() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading()
  const { data: tables = mockTables, isLoading } = useTables();
  const updateTableStatus = useUpdateTableStatus();

  useEffect(() => {
    if (isLoading) {
      showLoading('Đang tải danh sách bàn...')
    } else {
      hideLoading()
    }
  }, [isLoading])

  const handleTableClick = async (table) => {
    if (table.status === "empty") {
      Modal.confirm({
        title: `Mở bàn ${table.name}?`,
        content: "Xác nhận có khách ngồi vào bàn này?",
        onOk: async () => {
          try {
            showLoading('Đang cập nhật trạng thái bàn...')
            await updateTableStatus.mutateAsync(
              { tableId: table.id, status: "occupied" },
              {
                onSuccess: () => navigate(`/table/${table.id}`),
              }
            );
          } finally {
            hideLoading()
          }
        },
      });
    } else if (table.status === "occupied") {
      navigate(`/table/${table.id}`);
    } else {
      message.info("Bàn đang được dọn dẹp");
    }
  };

  return (
    <div>
      <Title className="bg-white p-4" level={2}>
        Sơ đồ bàn
      </Title>
      <Row gutter={[16, 16]} className="">
        {tables.map((table) => (
          <Col
            key={table.id}
            xs={12}
            sm={8}
            md={6}
            lg={4}
            className="flex justify-center"
          >
            <Badge.Ribbon
              text={statusText[table.status]}
              color={statusColors[table.status]}
              className="w-full"
            >
              <Card
                hoverable
                onClick={() => handleTableClick(table)}
                className="text-center w-[160px]"
                styles={{
                  body: {
                    padding: "12px",
                    height: "160px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <TableOutlined style={{ fontSize: "24px" }} />
                  <Title level={4} className="my-2 mb-0">
                    {table.name}
                  </Title>
                  {table.status === "occupied" && table.startTime && (
                    <div className="text-sm text-gray-500">
                      Bắt đầu: {new Date(table.startTime).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default TableList;
