export default async function challenge(req:any, res: any) {
  try {
    const resp = await fetch('https://auth.twetch.app/api/v1/challenge');
    const result = await resp.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
}
