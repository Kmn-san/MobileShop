import { orderApi } from "../lib/api.js"
import { formatDate } from "../lib/utils.js"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const OrdersPage = () => {
  const queryClient = useQueryClient()
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll
  })
  const orders = ordersData?.orders || []

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] })
    }
  })

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus })
  }
  return (
    <div className="space-y-6">
      {/* HEADER  */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-base-content/70">Manage customer orders</p>
      </div>

      {/* ORDERS TABLE  */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No orders yet</p>
              <p className="text-sm">Orders will appear here once customers make purchases</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(order => {
                    const totalQuantity = order.orderItems.reduce(
                      (sum, item) => sum + item.quantity, 0)
                    return (
                      <tr key={order._id}>
                        {/* ORDER ID  */}
                        <td>
                          <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                        </td>
                        {/* ADDRESS  */}
                        <td>
                          <div className="font-medium">{order.shippingAddress.fullName}</div>
                          <div className="font-text-sm opacity-60">
                            {order.shippingAddress.city},{order.shippingAddress.state}
                          </div>
                        </td>
                        {/* TOTAL QUANTITY  */}
                        <td>
                          <div className="font-medium">{totalQuantity} items</div>
                          <div className="text-sm opacity-60">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 &&
                              ` +${order.orderItems.length - 1} more`}
                          </div>
                        </td>
                        {/* TOTAL PRICE  */}
                        <td>
                          <span className="font-semibold">RM {order.totalPrice.toFixed(2)}</span>
                        </td>
                        {/* STATUS  */}
                        <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="select select-sm" disabled={updateStatusMutation.isPending}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        {/* DATE */}
                        <td>
                          <span className="text-sm opacity-60">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    )

                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage