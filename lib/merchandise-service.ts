import { databases, ID } from '@/lib/appwrite';

export interface MerchandiseItem {
  id: string;
  name: string;
  description: string;
  category: 'tshirt' | 'badge' | 'certificate' | 'mug' | 'other';
  price: number;
  quantity: number;
  imageUrl: string;
  sizes?: string[]; // For T-shirts
  colors?: string[];
  eventId?: string;
  isAvailable: boolean;
}

export interface MerchandiseOrder {
  id: string;
  userId: string;
  items: Array<{ itemId: string; quantity: number; size?: string; color?: string }>;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  deliveryDate?: Date;
}

/**
 * Get merchandise catalog
 */
export async function getMerchandiseCatalog(
  category?: string
): Promise<MerchandiseItem[]> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const filters = category ? [`category == "${category}"`] : [];
    const results = await databases.listDocuments(
      databaseId,
      'merchandise',
      filters,
      100
    );

    return results.documents.map((item) => ({
      id: item.$id,
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      sizes: item.sizes,
      colors: item.colors,
      eventId: item.eventId,
      isAvailable: item.quantity > 0,
    }));
  } catch (error) {
    console.error('Error fetching merchandise catalog:', error);
    throw error;
  }
}

/**
 * Create merchandise order
 */
export async function createMerchandiseOrder(
  userId: string,
  items: Array<{ itemId: string; quantity: number; size?: string; color?: string }>,
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }
): Promise<MerchandiseOrder> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const merchItem = await databases.getDocument(
        databaseId,
        'merchandise',
        item.itemId
      );
      totalAmount += merchItem.price * item.quantity;
    }

    // Create order
    const order = await databases.createDocument(
      databaseId,
      'merchandise_orders',
      ID.unique(),
      {
        userId,
        items,
        totalAmount,
        shippingAddress,
        status: 'pending',
        createdAt: new Date(),
      }
    );

    // Update inventory
    for (const item of items) {
      const merchItem = await databases.getDocument(
        databaseId,
        'merchandise',
        item.itemId
      );
      await databases.updateDocument(
        databaseId,
        'merchandise',
        item.itemId,
        {
          quantity: merchItem.quantity - item.quantity,
        }
      );
    }

    return {
      id: order.$id,
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      createdAt: new Date(order.createdAt),
    };
  } catch (error) {
    console.error('Error creating merchandise order:', error);
    throw error;
  }
}

/**
 * Track merchandise order
 */
export async function trackMerchandiseOrder(orderId: string): Promise<MerchandiseOrder | null> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const order = await databases.getDocument(
      databaseId,
      'merchandise_orders',
      orderId
    );

    return {
      id: order.$id,
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      status: order.status,
      createdAt: new Date(order.createdAt),
      deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
    };
  } catch (error) {
    console.error('Error tracking order:', error);
    return null;
  }
}

/**
 * Update merchandise inventory
 */
export async function updateMerchandiseInventory(
  itemId: string,
  newQuantity: number
): Promise<void> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    await databases.updateDocument(
      databaseId,
      'merchandise',
      itemId,
      {
        quantity: newQuantity,
      }
    );
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
}

/**
 * Get sales analytics
 */
export async function getMerchandiseSalesAnalytics(): Promise<{
  totalSales: number;
  totalRevenue: number;
  topSellingItems: Array<{ name: string; sold: number }>;
  byCategory: Record<string, number>;
  shippingCosts: number;
}> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const orders = await databases.listDocuments(
      databaseId,
      'merchandise_orders',
      [],
      10000
    );

    let totalRevenue = 0;
    let totalSales = 0;
    const itemsSold: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const order of orders.documents) {
      if (order.status === 'delivered' || order.status === 'shipped') {
        totalRevenue += order.totalAmount;
        for (const item of order.items) {
          totalSales += item.quantity;
          itemsSold[item.itemId] = (itemsSold[item.itemId] || 0) + item.quantity;
        }
      }
    }

    return {
      totalSales,
      totalRevenue,
      topSellingItems: Object.entries(itemsSold)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([itemId, sold]) => ({ name: itemId, sold })),
      byCategory,
      shippingCosts: 0, // Calculate based on orders
    };
  } catch (error) {
    console.error('Error fetching merchandise analytics:', error);
    throw error;
  }
}
