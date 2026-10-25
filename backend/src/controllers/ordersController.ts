import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

export async function getMyOrders(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true, shippingAddress: true },
    });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
}

export async function getOrderById(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id     = String(req.params['id']);
    const userId = req.user!.userId;
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: true, shippingAddress: true },
    });
    if (!order) return next(new AppError('Pedido no encontrado.', 404));
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
}

interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
}

interface CreateOrderBody {
  items: OrderItemInput[];
  shippingAddress: {
    recipientName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone?: string;
  };
  paymentIntentId?: string;
  notes?: string;
}

interface OrderItemCreate {
  productId:    string;
  productName:  string;
  productImage: string | null;
  variantId:    string | undefined;
  variantLabel: string | undefined;
  quantity:     number;
  unitPrice:    number;
  subtotal:     number;
}

export async function createOrder(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const body   = req.body as CreateOrderBody;

    let subtotal = 0;
    const orderItems: OrderItemCreate[] = [];

    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where:   { id: item.productId },
        include: {
          variants: true,
          images:   { where: { isPrimary: true }, take: 1 },
        },
      });

      if (!product) return next(new AppError(`Producto no encontrado: ${item.productId}`, 404));

      const variant    = item.variantId ? product.variants.find(v => v.id === item.variantId) : null;
      const serverPrice = product.price + (variant?.priceAdjustment ?? 0);
      const available   = variant ? variant.stock : product.stock;

      if (item.quantity > available) {
        return next(new AppError(
          `Stock insuficiente para "${product.name}". Disponible: ${available}.`, 422
        ));
      }

      subtotal += serverPrice * item.quantity;
      orderItems.push({
        productId:    product.id,
        productName:  product.name,
        productImage: product.images[0]?.url ?? null,
        variantId:    item.variantId,
        variantLabel: variant ? `${variant.name}: ${variant.value}` : undefined,
        quantity:     item.quantity,
        unitPrice:    serverPrice,
        subtotal:     serverPrice * item.quantity,
      });
    }

    const shipping    = subtotal >= 50 ? 0 : 4.99;
    const tax         = subtotal * 0.21;
    const total       = subtotal + shipping + tax;
    const orderNumber = `CI-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.$transaction(async tx => {
      const address = await tx.address.create({
        data: { userId, ...body.shippingAddress, isDefault: false },
      });

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status:           'confirmed',
          paymentStatus:    body.paymentIntentId ? 'paid' : 'pending',
          subtotal,
          tax,
          shipping,
          total,
          shippingAddressId: address.id,
          notes:             body.notes,
          items:             { create: orderItems },
        },
        include: { items: true, shippingAddress: true },
      });

      for (const item of body.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data:  { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data:  { stock: { decrement: item.quantity } },
          });
        }
      }
      return newOrder;
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
}

export async function cancelOrder(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id     = String(req.params['id']);
    const userId = req.user!.userId;

    const order = await prisma.order.findFirst({ where: { id, userId } });
    if (!order) return next(new AppError('Pedido no encontrado.', 404));

    if (!['pending', 'confirmed'].includes(order.status)) {
      return next(new AppError('No se puede cancelar un pedido en este estado.', 422));
    }

    const updated = await prisma.order.update({ where: { id }, data: { status: 'cancelled' } });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}
