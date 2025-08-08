import { OrderParamsDto } from "@domain/model/params";
import { OrderStatus } from "@domain/model/request/OrderRequest";
import { AppDataSource } from "@infrastructure/mysql/connection";
import moment from "moment"
import { ResultSetHeader } from "mysql2"

export default class OrderRepository {
    private static get db() {
        if (!AppDataSource.isInitialized) {
            throw new Error('Database connection not initialized');
        }
        return AppDataSource;
    }

    static async DBCreateOrder(order: OrderParamsDto.CreateOrderParams, query_runner?: any): Promise<ResultSetHeader> {
        const sql = `INSERT INTO orders (
                portfolio_id, asset_id, client_id, group_id, side, order_type,
                quantity, price, stop_loss, take_profit, status, order_value,
                broker_order_id, filled_quantity, average_fill_price, close_price, fees,
                notes, expires_at, created_at, updated_at, closed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        return await this.db.query(
            sql,
            [
                order.portfolio_id,
                order.asset_id,
                order.client_id,
                order.group_id ?? null,
                order.side,
                order.order_type,
                order.quantity,
                order.price ?? null,
                order.stop_loss ?? null,
                order.take_profit ?? null,
                order.status,
                order.order_value ?? null,
                order.broker_order_id ?? null,
                order.filled_quantity ?? 0,
                order.average_fill_price ?? null,
                order.close_price ?? null,
                order.fees ?? 0,
                order.notes ?? null,
                order.expires_at ?? null,
                order.created_at,
                order.updated_at,
                order.closed_at ?? null,
            ],
            query_runner
        );
    }

    static async DBGetDailyTradingVolume(portfolio_id: number, asset_id: number, query_runner?: any): Promise<any[]> {
        return await this.db.query(
            `SELECT SUM(quantity) AS daily_volume FROM orders WHERE portfolio_id = ? AND asset_id = ? AND DATE(CONVERT_TZ(created_at, '+00:00', @@session.time_zone)) = CURDATE()`,
            [portfolio_id, asset_id],
            query_runner
        );
    }

    static async DBUpdateOrderStatus(id: number, status: OrderStatus, query_runner?: any): Promise<ResultSetHeader> {
        return await this.db.query(
            `UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`,
            [status, moment.utc().format("YYYY-MM-DD HH:mm:ss"), id],
            query_runner
        );
    }

    static async DBGetOrderById(order_id: number, query_runner?: any): Promise<any> {
        const result = await this.db.query(
            `SELECT * FROM orders WHERE id = ?`,
            [order_id],
            query_runner
        );
        return result.length > 0 ? result[0] : null;
    }
}