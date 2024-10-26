import type {Signer} from "@meer-js/signers";
import type {SignedTransaction} from "@meer-js/transactions";
import {createTransaction, signTransaction} from "@meer-js/transactions";
import {baseDecode} from "@meer-js/utils";
import {JsonRpcProvider} from "@meer-js/providers";
import type {Network, Transaction} from "@meer-wallet-selector/core/src";
import type {AccessKeyViewRaw} from "@meer-js/types";
import {createAction} from "./create-action";

export const signTransactions = async (
  transactions: Array<Transaction>,
  signer: Signer,
  network: Network
) => {
  const provider = new JsonRpcProvider({
    url: network.nodeUrl,
  });

  const signedTransactions: Array<SignedTransaction> = [];

  for (let i = 0; i < transactions.length; i++) {
    const publicKey = await signer.getPublicKey(
      transactions[i].signerId,
      network.networkId
    );

    const [block, accessKey] = await Promise.all([
      provider.block({ finality: "final" }),
      provider.query<AccessKeyViewRaw>({
        request_type: "view_access_key",
        finality: "final",
        account_id: transactions[i].signerId,
        public_key: publicKey.toString(),
      }),
    ]);

    const actions = transactions[i].actions.map((action) =>
      createAction(action)
    );

    const transaction = createTransaction(
      transactions[i].signerId,
      publicKey,
      transactions[i].receiverId,
      accessKey.nonce + i + 1,
      actions,
      baseDecode(block.header.hash)
    );

    const response = await signTransaction(
      transaction,
      signer,
      transactions[i].signerId,
      network.networkId
    );

    signedTransactions.push(response[1]);
  }

  return signedTransactions;
};
