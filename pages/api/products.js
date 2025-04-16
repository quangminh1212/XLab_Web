export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { productName, description, price, image } = req.body;
            // TODO: Add logic to save the product to a database if needed
            res.status(200).json({ message: 'Product added successfully', product: req.body });
        } catch (error) {
            res.status(500).json({ message: 'Error adding product', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 