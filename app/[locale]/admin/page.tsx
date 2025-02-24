"use client";
import { motion } from "framer-motion";
import { 
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ChartPieIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: "مكتمل" | "قيد التوصيل" | "معلق";
}

interface Product {
  name: string;
  sales: number;
  revenue: string;
}

const DashboardPage = () => {
  const salesChartOptions: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Noto Sans Arabic, sans-serif",

      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    },
    colors: ["#4F46E5"],
    xaxis: {
      categories: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
      labels: {
        style: {
          fontFamily: "Noto Sans Arabic",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Noto Sans Arabic",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontFamily: "Noto Sans Arabic",
      },
    },
    legend: {
      fontFamily: "Noto Sans Arabic",
      position: "top",
      horizontalAlign: "right",
    },
  };

  const salesChartSeries = [{
    name: "المبيعات",
    data: [30, 40, 35, 50, 49, 60],
  }];

  const ordersChartOptions: ApexOptions = {
    ...salesChartOptions,
    colors: ["#10B981"],
  };

  const ordersChartSeries = [{
    name: "الطلبات",
    data: [15, 25, 20, 30, 27, 35],
  }];

  const recentOrders: Order[] = [
    { id: "#1234", customer: "محمد أحمد", amount: "٥٩٩ ر.س", status: "مكتمل" },
    { id: "#1235", customer: "علي حسن", amount: "٣٩٩ ر.س", status: "قيد التوصيل" },
    { id: "#1236", customer: "فاطمة عمر", amount: "٨٩٩ ر.س", status: "معلق" },
  ];

  const topProducts: Product[] = [
    { name: "حذاء رياضي", sales: 142, revenue: "٥٤٬٣٢١ ر.س" },
    { name: "سماعات لاسلكية", sales: 98, revenue: "٣٢٬١٥٤ ر.س" },
    { name: "ساعة ذكية", sales: 75, revenue: "٢٧٬٨٩٩ ر.س" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              لوحة التحكم
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="إجمالي المبيعات"
            value="٢٣٤٬٥٦٧ ر.س"
            icon={CurrencyDollarIcon}
            color="bg-indigo-100 dark:bg-indigo-900"
          />
          <StatCard
            title="الطلبات الجديدة"
            value="١٬٢٣٤"
            icon={ShoppingBagIcon}
            color="bg-green-100 dark:bg-green-900"
          />
          <StatCard
            title="المنتجات"
            value="٤٥٦"
            icon={ChartPieIcon}
            color="bg-blue-100 dark:bg-blue-900"
          />
          <StatCard
            title="العملاء الجدد"
            value="٧٨"
            icon={UserGroupIcon}
            color="bg-purple-100 dark:bg-purple-900"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                إحصائيات المبيعات
              </h3>
              <ArrowTrendingUpIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <Chart
              options={salesChartOptions}
              series={salesChartSeries}
              type="area"
              height={300}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                تطور الطلبات
              </h3>
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <Chart
              options={ordersChartOptions}
              series={ordersChartSeries}
              type="area"
              height={300}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrdersTable orders={recentOrders} />
          <TopProductsList products={topProducts} />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`${color} p-6 rounded-xl shadow-sm transition-all duration-300`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-300 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
          {value}
        </p>
      </div>
      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
        <Icon className="w-6 h-6 text-current" />
      </div>
    </div>
  </motion.div>
);

const RecentOrdersTable = ({ orders }: { orders: Order[] }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
  >
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      الطلبات الأخيرة
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-gray-500 dark:text-gray-400 border-b">
            <th className="text-right pb-3">رقم الطلب</th>
            <th className="text-right pb-3">العميل</th>
            <th className="text-right pb-3">المبلغ</th>
            <th className="text-right pb-3">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-b-0">
              <td className="py-3 text-gray-800 dark:text-gray-200">{order.id}</td>
              <td className="py-3 text-gray-800 dark:text-gray-200">{order.customer}</td>
              <td className="py-3 text-gray-800 dark:text-gray-200">{order.amount}</td>
              <td className="py-3">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    order.status === "مكتمل"
                      ? "bg-green-100 text-green-800"
                      : order.status === "قيد التوصيل"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const TopProductsList = ({ products }: { products: Product[] }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
  >
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      المنتجات الأكثر مبيعاً
    </h3>
    <div className="space-y-4">
      {products.map((product, index) => (
        <div
          key={product.name}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-300">{index + 1}.</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {product.name}
            </span>
          </div>
          <div className="text-right">
            <p className="text-gray-800 dark:text-white">{product.sales} مبيع</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.revenue}
            </p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default DashboardPage;