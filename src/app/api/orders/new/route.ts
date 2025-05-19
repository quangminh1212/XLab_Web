import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Order } from '@/models/OrderModel';

const dataFilePath = path.join(process.cwd(), 'src/data/orders.json');

function getOrders(): Order[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading orders data:', error);
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving orders data:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orders = getOrders();
    const newOrder: Order = {
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString()
    };
    orders.push(newOrder);
    saveOrders(orders);
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error adding order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 