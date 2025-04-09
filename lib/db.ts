// Database utility functions for NavTrail

import { PrismaClient } from "@prisma/client"

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

/**
 * User database operations
 */
export const userDB = {
  getById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    })
  },

  getByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  create: async (userData: any) => {
    return prisma.user.create({
      data: userData,
    })
  },

  update: async (id: string, userData: any) => {
    return prisma.user.update({
      where: { id },
      data: userData,
    })
  },

  delete: async (id: string) => {
    return prisma.user.delete({
      where: { id },
    })
  },
}

/**
 * Trip database operations
 */
export const tripDB = {
  getById: async (id: string) => {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        activities: true,
      },
    })
  },

  getByUserId: async (userId: string) => {
    return prisma.trip.findMany({
      where: { userId },
      include: {
        activities: true,
      },
    })
  },

  create: async (tripData: any) => {
    return prisma.trip.create({
      data: tripData,
      include: {
        activities: true,
      },
    })
  },

  update: async (id: string, tripData: any) => {
    return prisma.trip.update({
      where: { id },
      data: tripData,
      include: {
        activities: true,
      },
    })
  },

  delete: async (id: string) => {
    return prisma.trip.delete({
      where: { id },
    })
  },
}

/**
 * Route database operations
 */
export const routeDB = {
  getById: async (id: string) => {
    return prisma.route.findUnique({
      where: { id },
    })
  },

  getByUserId: async (userId: string) => {
    return prisma.route.findMany({
      where: { userId },
    })
  },

  create: async (routeData: any) => {
    return prisma.route.create({
      data: routeData,
    })
  },

  update: async (id: string, routeData: any) => {
    return prisma.route.update({
      where: { id },
      data: routeData,
    })
  },

  delete: async (id: string) => {
    return prisma.route.delete({
      where: { id },
    })
  },
}

/**
 * Place database operations
 */
export const placeDB = {
  getById: async (id: string) => {
    return prisma.place.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    })
  },

  search: async (query: string) => {
    return prisma.place.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        reviews: true,
      },
    })
  },

  getNearby: async (lat: number, lng: number, radius: number) => {
    // This is a simplified version - in a real app, you'd use PostGIS or similar
    return prisma.place.findMany({
      include: {
        reviews: true,
      },
    })
  },
}

