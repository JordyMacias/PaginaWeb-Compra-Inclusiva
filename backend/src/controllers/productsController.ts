import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

export async function getProducts(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const q = req.query;
    const page        = Math.max(1, parseInt(String(q['page'] ?? '1')));
    const pageSizeNum = Math.min(50, Math.max(1, parseInt(String(q['pageSize'] ?? '12'))));
    const skip        = (page - 1) * pageSizeNum;
    const search      = q['search']   ? String(q['search'])   : undefined;
    const categoryId  = q['categoryId'] ? String(q['categoryId']) : undefined;
    const minPrice    = q['minPrice']  ? parseFloat(String(q['minPrice']))  : undefined;
    const maxPrice    = q['maxPrice']  ? parseFloat(String(q['maxPrice']))  : undefined;
    const inStock     = q['inStock']   === 'true';
    const featured    = q['featured']  === 'true';
    const sortBy      = String(q['sortBy'] ?? 'created_at');

    const where: Record<string, unknown> = {};

    if (search) {
      where['OR'] = [
        { name:        { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where['categoryId'] = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where['price'] = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }
    if (inStock)  where['stock']    = { gt: 0 };
    if (featured) where['featured'] = true;

    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sortBy === 'name')       orderBy = { name: 'asc' };
    if (sortBy === 'price_asc')  orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'rating')     orderBy = { rating: 'desc' };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where, orderBy, skip, take: pageSizeNum,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images:   { orderBy: { order: 'asc' } },
          variants: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        data: products,
        meta: { total, page, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) },
      },
    });
  } catch (err) { next(err); }
}

export async function getProductBySlug(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const slug = String(req.params['slug']);
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images:   { orderBy: { order: 'asc' } },
        variants: true,
      },
    });
    if (!product) return next(new AppError('Producto no encontrado.', 404));
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function getCategories(
  _req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
}
