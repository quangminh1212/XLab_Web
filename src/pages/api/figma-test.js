// API endpoint để kiểm tra kết nối Figma
export default async function handler(req, res) {
  try {
    const apiKey = process.env.FIGMA_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Figma API key chưa được cấu hình' });
    }

    // Sử dụng một file Figma công khai để test
    const fileKey = 'FP8EJoQGN5PVkvzqlD7Qb5';
    
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': apiKey
      }
    });

    const responseStatus = response.status;
    let responseBody;
    
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = { error: 'Không thể đọc phản hồi JSON' };
    }

    return res.status(200).json({
      status: responseStatus,
      figmaResponse: responseBody,
      apiKeyFirstChars: apiKey.substring(0, 10) + '...',
      fileKey: fileKey
    });
  } catch (error) {
    console.error('Lỗi khi kiểm tra kết nối Figma:', error);
    return res.status(500).json({ 
      error: 'Lỗi server khi kết nối với Figma',
      message: error.message 
    });
  }
} 