import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { toSlug } from '../utils/slug';

// =====================================================
// CONTROLADOR DE ADMINISTRACIÓN
// =====================================================

// ─── Productos ───────────────────────────────────────

export async function adminGetProducts(
  _req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images:   { orderBy: { order: 'asc' } },
        variants: true,
      },
    });
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
}

export async function adminCreateProduct(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      name: string; slug?: string; description: string;
      shortDescription?: string; price: number; compareAtPrice?: number;
      stock: number; sku?: string; categoryId: string; tags?: string;
      featured?: boolean; imageUrl?: string; imageAlt?: string;
    };

    const slug = body.slug?.trim() || toSlug(body.name);
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) return next(new AppError('Categoría no encontrada.', 404));

    const tagArray = body.tags
      ? body.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const product = await prisma.product.create({
      data: {
        name:             body.name,
        slug,
        description:      body.description,
        shortDescription: body.shortDescription ?? null,
        price:            Number(body.price),
        compareAtPrice:   body.compareAtPrice ? Number(body.compareAtPrice) : null,
        stock:            Number(body.stock),
        sku:              body.sku ?? null,
        categoryId:       body.categoryId,
        tags:             tagArray,
        featured:         Boolean(body.featured),
        ...(body.imageUrl ? {
          images: {
            create: [{
              url:       body.imageUrl,
              alt:       body.imageAlt ?? body.name,
              isPrimary: true,
              order:     0,
            }],
          },
        } : {}),
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images:   { orderBy: { order: 'asc' } },
        variants: true,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function adminUpdateProduct(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params['id']);
    const body = req.body as {
      name: string; slug?: string; description: string;
      shortDescription?: string; price: number; compareAtPrice?: number;
      stock: number; sku?: string; categoryId: string; tags?: string;
      featured?: boolean; imageUrl?: string; imageAlt?: string;
    };

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Producto no encontrado.', 404));

    const slug = body.slug?.trim() || toSlug(body.name);
    const tagArray = body.tags
      ? body.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    if (body.imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name:             body.name,
        slug,
        description:      body.description,
        shortDescription: body.shortDescription ?? null,
        price:            Number(body.price),
        compareAtPrice:   body.compareAtPrice ? Number(body.compareAtPrice) : null,
        stock:            Number(body.stock),
        sku:              body.sku ?? null,
        categoryId:       body.categoryId,
        tags:             tagArray,
        featured:         Boolean(body.featured),
        ...(body.imageUrl ? {
          images: {
            create: [{
              url:       body.imageUrl,
              alt:       body.imageAlt ?? body.name,
              isPrimary: true,
              order:     0,
            }],
          },
        } : {}),
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images:   { orderBy: { order: 'asc' } },
        variants: true,
      },
    });

    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function adminDeleteProduct(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params['id']);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return next(new AppError('Producto no encontrado.', 404));
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, data: null, message: 'Producto eliminado.' });
  } catch (err) { next(err); }
}

// ─── Pedidos ─────────────────────────────────────────

export async function adminGetOrders(
  _req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items:           true,
        shippingAddress: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const mapped = orders.map(o => ({
      id:              o.id,
      orderNumber:     o.orderNumber,
      userId:          o.userId,
      userName:        o.user.name,
      userEmail:       o.user.email,
      status:          o.status,
      paymentStatus:   o.paymentStatus,
      subtotal:        o.subtotal,
      tax:             o.tax,
      shipping:        o.shipping,
      total:           o.total,
      notes:           o.notes,
      createdAt:       o.createdAt,
      updatedAt:       o.updatedAt,
      items:           o.items,
      shippingAddress: o.shippingAddress,
    }));

    res.json({ success: true, data: mapped });
  } catch (err) { next(err); }
}

export async function adminUpdateOrderStatus(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params['id']);
    const { status } = req.body as { status: string };

    const valid = [
      'pending','confirmed','processing','shipped','delivered','cancelled','refunded',
    ];
    if (!valid.includes(status)) return next(new AppError('Estado no válido.', 422));

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return next(new AppError('Pedido no encontrado.', 404));

    const updated = await prisma.order.update({
      where: { id },
      data:  { status },
      include: {
        items:           true,
        shippingAddress: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const { user: orderUser, ...orderData } = updated;
    res.json({
      success: true,
      data: { ...orderData, userName: orderUser.name, userEmail: orderUser.email },
    });
  } catch (err) { next(err); }
}

// ─── Estadísticas del dashboard ──────────────────────

export async function adminGetStats(
  _req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      revenueResult,
      recentOrders,
      lowStock,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'paid' },
        _sum:  { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.product.findMany({
        where:   { stock: { lte: 5 } },
        select:  { id: true, name: true, stock: true },
        orderBy: { stock: 'asc' },
        take:    5,
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue:     revenueResult._sum.total ?? 0,
        recentOrders:     recentOrders.map(o => ({
          ...o,
          userName:  o.user.name,
          userEmail: o.user.email,
        })),
        lowStockProducts: lowStock,
      },
    });
  } catch (err) { next(err); }
}
