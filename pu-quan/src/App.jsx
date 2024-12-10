import { Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import Layout from '@/components/Layout'
import LoadingScreen from '@/components/LoadingScreen'
import TableList from '@/pages/TableList'
import TableOrder from '@/pages/TableOrder'
import MenuManagement from '@/pages/MenuManagement'
import KitchenDisplay from '@/pages/KitchenDisplay'
import InventoryManagement from '@/pages/InventoryManagement'

function App() {

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >

        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<TableList />} />
          <Route path="table/:tableId" element={<TableOrder />} />
          <Route path="menu-management" element={<MenuManagement />} />
          <Route path="kitchen" element={<KitchenDisplay />} />
          <Route path="inventory" element={<InventoryManagement />} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}

export default App
