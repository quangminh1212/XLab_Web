import { PrismaClient } from '@prisma/client'

// Khởi tạo Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Tạo biến global để dùng Prisma Client như singleton trong development
declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Sử dụng biến global trong development, hoặc tạo mới trong production
const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma 