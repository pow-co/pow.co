require("dotenv").config();

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Scrypt, bsv } from "scrypt-ts";

type Data = {
  name: string;
};

Scrypt.init({
  apiKey: String(process.env.SCRYPT_API_KEY),
  network: bsv.Networks.livenet,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const address = req.query.address as string;

    const unspent = await Scrypt.bsvApi.listUnspent(new bsv.Address(address));

    console.log(unspent);

    res.status(200).json({ address, unspent });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error });
  }
}
