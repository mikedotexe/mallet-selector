import * as nearAPI from "meer-api-js";
import type { AddKeyPermission, Action } from "@meer-wallet-selector/core";
const { transactions } = nearAPI;
import { publicKeyFrom } from "@meer-js/crypto"

const getAccessKey = (permission: AddKeyPermission) => {
  if (permission === "FullAccess") {
    return transactions.fullAccessKey();
  }

  const { receiverId, methodNames = [] } = permission;
  const allowance = permission.allowance
    ? BigInt(permission.allowance)
    : undefined;

  return transactions.functionCallAccessKey(receiverId, methodNames, allowance);
};

export const createAction = (action: Action) => {
  switch (action.type) {
    case "CreateAccount":
      return transactions.createAccount();
    case "DeployContract": {
      const { code } = action.params;

      return transactions.deployContract(code);
    }
    case "FunctionCall": {
      const { methodName, args, gas, deposit } = action.params;

      console.log('alohaws action', action)

      return transactions.functionCall(
        methodName,
        args,
        BigInt(gas),
        BigInt(deposit)
      );
    }
    case "Transfer": {
      const { deposit } = action.params;

      return transactions.transfer(BigInt(deposit));
    }
    case "Stake": {
      const { stake, publicKey } = action.params;
      const pubKey = publicKeyFrom(publicKey);

      return transactions.stake(BigInt(stake), pubKey);
    }
    case "AddKey": {
      const { publicKey, accessKey } = action.params;
      const pubKey = publicKeyFrom(publicKey);

      return transactions.addKey(
        pubKey,
        // TODO: Use accessKey.nonce? meer-api-js seems to think 0 is fine?
        getAccessKey(accessKey.permission)
      );
    }
    case "DeleteKey": {
      const { publicKey } = action.params;
      const pubKey = publicKeyFrom(publicKey);

      return transactions.deleteKey(pubKey);
    }
    case "DeleteAccount": {
      const { beneficiaryId } = action.params;

      return transactions.deleteAccount(beneficiaryId);
    }
    default:
      throw new Error("Invalid action type");
  }
};
