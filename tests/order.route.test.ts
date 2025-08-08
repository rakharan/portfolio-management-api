import Fastify from 'fastify';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@helpers/prehandler/AuthValidate', () => ({
  AuthValidate: vi.fn(async (request: any) => {
    request.user = { id: 1, client_id: 1, group_id: 1 };
  })
}));

vi.mock('@application/service/Order', () => ({
  default: {
    CreateOrderApp: vi.fn().mockResolvedValue({
      message: 'Order submitted successfully for execution.',
      order_id: 1,
      status: 'SUBMITTED'
    })
  }
}));

import OrderRoute from '@adapters/inbound/http/routes/Order';
import OrderAppService from '@application/service/Order';

describe('Order Route', () => {
  it('should create an order successfully', async () => {
    const app = Fastify();
    await app.register(OrderRoute, { prefix: '/api/v1/order' });

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/order/',
      headers: { authorization: 'Bearer token' },
      payload: {
        portfolio_id: 1,
        asset_id: 1,
        side: 'BUY',
        order_type: 'LIMIT',
        quantity: 10,
        price: 100,
        broker_order_id: 99
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: {
        message: 'Order submitted successfully for execution.',
        order_id: 1,
        status: 'SUBMITTED'
      }
    });
    expect(OrderAppService.CreateOrderApp).toHaveBeenCalledOnce();
  });
});
