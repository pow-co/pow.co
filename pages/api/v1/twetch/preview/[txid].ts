import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { txid } = req.query;

  // Perform the API request to twetch.app using the provided txid
  try {
    const response = await axios.get(
      `https://cloud-functions.twetch.app/api/t/${txid}/unfurl`, {
        responseType: "arraybuffer"
      }
    );
    const base64data = Buffer.from(response.data, 'binary').toString('base64');
    const dataUrl = `data:image/png;base64,${base64data}`;
    
    const data = response.data;
    //const binaryData = Buffer.from(data, 'binary')
    //const base64Data = binaryData.toString("base64")
    res.status(200).json(dataUrl);
    
  } catch (error) {
    // Handle any other errors that may occur
    res.status(500).json({ error: `An error occurred ${error}` });
  }
}
