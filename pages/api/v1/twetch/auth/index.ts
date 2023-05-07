export default async function authenticate(req: any, res: any) {
  const params = req.query;
  const signature = decodeURIComponent(params.signature);
  const payload = {
    address: params.address,
    message: params.message,
    signature,
  };
  try {
    const resp = await fetch('https://auth.twetch.app/api/v1/authenticate', {
      method: 'post',
      body: JSON.stringify(payload),
      headers: { 'Content-type': 'application/json' },
    });
    const result = await resp.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
}
