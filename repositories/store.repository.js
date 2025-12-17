const prisma = require("../db/prisma");

const getStoreById = async (id) => {
  return await prisma.store.findUnique({ where: { id } });
};

const getStoreBooksWithDetails = async (storeId) => {
  return await prisma.storeBook.findMany({ where: { storeId }, include: { book: { include: { author: true } } } });
};

module.exports = {
  getStoreById,
  getStoreBooksWithDetails,
};
