const PDFDocument = require("pdfkit");
const storeRepo = require("../repositories/store.repository");

const downloadStoreReport = async (req, res) => {
  try {
    const store = await storeRepo.getStoreById(parseInt(req.params.id));
    if (!store) return res.status(404).json({ error: "Store not found" });

    const books = await storeRepo.getStoreBooksWithDetails(store.id);

    const sortedBooks = [...books].sort((a, b) => b.price - a.price);
    const topBooks = sortedBooks.slice(0, 5);

    const authorCounts = {};
    for (let i = 0; i < books.length; i++) {
      const name = books[i].book.author.name;
      authorCounts[name] = (authorCounts[name] || 0) + 1;
    }

    const authorArray = [];
    for (const name in authorCounts) {
      authorArray.push({ name, count: authorCounts[name] });
    }

    authorArray.sort((a, b) => b.count - a.count);
    const topAuthors = authorArray.slice(0, 5);

    const date = new Date().toISOString().split('T')[0];
    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", `attachment; filename="${store.name}-Report-${date}.pdf"`);
    doc.pipe(res);

    doc.text(store.name).text("Inventory Report").moveDown();
    doc.text("Top 5 Priciest Books:");
    topBooks.forEach(b => doc.text(`${b.book.name} - $${b.price}`));

    doc.moveDown().text("Top 5 Prolific Authors:");
    topAuthors.forEach(author => {
      doc.text(`• ${author.name}: ${author.count} books`);
    });

    doc.end();

  } catch (e) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
};

module.exports = { downloadStoreReport };

