const upsertStore = async (tx, { name, address }) => {
  return await tx.store.upsert({
    where: { name_address: { name, address } },
    create: { name, address },
    update: {},
  });
};

const upsertAuthor = async (tx, { name }) => {
  return await tx.author.upsert({
    where: { name },
    create: { name },
    update: {},
  });
};

const findBookByNameAndAuthor = async (tx, { name, authorId }) => {
  return await tx.book.findFirst({ where: { name, authorId } });
};

const createBook = async (tx, { name, pages, authorId }) => {
  return await tx.book.create({ data: { name, pages, authorId } });
};

const upsertStoreBook = async (tx, { storeId, bookId, price }) => {
  return await tx.storeBook.upsert({
    where: { storeId_bookId: { storeId, bookId } },
    create: { storeId, bookId, price, copies: 1 },
    update: { copies: { increment: 1 }, price },
  });
};

module.exports = {
  upsertStore,
  upsertAuthor,
  findBookByNameAndAuthor,
  createBook,
  upsertStoreBook,
};
