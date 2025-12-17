const Papa = require("papaparse");
const prisma = require("../db/prisma");
const inventoryRepo = require("../repositories/inventory.repository");

const validateRow = (row) => {
  const { store_name, store_address, book_name, author_name, price } = row;
  if (!store_name || !store_address || !book_name || !author_name || !price) {
    throw new Error("Missing fields");
  }
};

const uploadInventory = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const parsed = Papa.parse(req.file.buffer.toString(), {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/ /g, "_"),
    });

    if (parsed.errors.length) return res.status(400).json({ error: "CSV error" });

    let processed = 0;
    for (const row of parsed.data) {
      validateRow(row);
      await prisma.$transaction(async (tx) => {
        const { store_name, store_address, book_name, pages, author_name, price } = row;

        const store = await inventoryRepo.upsertStore(tx, { name: store_name, address: store_address });
        const author = await inventoryRepo.upsertAuthor(tx, { name: author_name });

        let book = await inventoryRepo.findBookByNameAndAuthor(tx, { name: book_name, authorId: author.id });
        if (!book) {
          book = await inventoryRepo.createBook(tx, { name: book_name, pages: parseInt(pages), authorId: author.id });
        }

        await inventoryRepo.upsertStoreBook(tx, { storeId: store.id, bookId: book.id, price: parseFloat(price) });

        processed++;
      });
    }
    res.json({ success: true, processed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { uploadInventory };

