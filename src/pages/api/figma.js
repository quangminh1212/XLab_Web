export default async function handler(req, res) {
  const { fileKey } = req.query;
  
  if (!fileKey) {
    return res.status(400).json({ error: 'Thiếu fileKey' });
  }

  try {
    // Lấy API key từ biến môi trường
    const apiKey = process.env.FIGMA_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Figma API key chưa được cấu hình' });
    }

    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': apiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `Lỗi từ Figma API: ${errorData.err || response.statusText}` 
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Lỗi khi truy cập Figma API:', error);
    res.status(500).json({ error: `Lỗi server: ${error.message}` });
  }
} 