require("dotenv").config();

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Scrypt, bsv } from "scrypt-ts";

interface Unspent {
  txId: string;
  outputIndex: number;
  satoshis: number;
  script: string;
  address: string;
}

type AddressUnspent = {
  address: string;
  unspent: Unspent[];
};

type ErrorResponse = {
  error: string;
}

Scrypt.init({
  apiKey: String(process.env.SCRYPT_API_KEY),
  network: bsv.Networks.livenet,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressUnspent | ErrorResponse>
) {
  try {
    const address = String(req.query.address);

    const unspent = await Scrypt.bsvApi.listUnspent(new bsv.Address(address)) as Unspent[];

    console.log(unspent);

    res.status(200).json({ address, unspent });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({ error: error.message });
  }
}
