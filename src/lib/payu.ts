import crypto from "crypto";

interface PayUParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export const generatePayUHash = (
  {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
  }: PayUParams,
  salt: string
) => {
  // Hash Sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

export const verifyPayUHash = (params: any, salt: string, status: string) => {
  // Reverse Hash Sequence: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = `${salt}|${status}||||||${params.udf5 || ""}|${
    params.udf4 || ""
  }|${params.udf3 || ""}|${params.udf2 || ""}|${params.udf1 || ""}|${
    params.email
  }|${params.firstname}|${params.productinfo}|${params.amount}|${
    params.txnid
  }|${params.key}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");
  return calculatedHash === params.hash;
};
