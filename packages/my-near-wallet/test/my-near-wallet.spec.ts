import type {
  Near,
  WalletConnection,
  ConnectedWalletAccount,
} from "near-api-js";
import type { AccountView } from "@near-js/types";
import { mock } from "jest-mock-extended";

// import { mockWallet } from "../../../core/src/lib/testUtils";
import { mockWallet } from "@meer-wallet-selector/core/src/lib/testUtils";
import type { MockWalletDependencies } from "@meer-wallet-selector/core/src/lib/testUtils";
import type { BrowserWallet } from "@meer-wallet-selector/core";

const createMyNearWallet = async (deps: MockWalletDependencies = {}) => {
  const walletConnection = mock<WalletConnection>();
  const account = mock<ConnectedWalletAccount>({
    connection: {
      signer: {
        getPublicKey: jest.fn().mockReturnValue(""),
      },
    },
  });

  jest.mock("near-api-js", () => {
    const module = jest.requireActual("near-api-js");
    return {
      ...module,
      connect: jest.fn().mockResolvedValue(mock<Near>()),
      WalletConnection: jest.fn().mockReturnValue(walletConnection),
    };
  });

  walletConnection.isSignedIn.calledWith().mockReturnValue(true);
  walletConnection.getAccountId
    .calledWith()
    .mockReturnValue("test-account.testnet");
  walletConnection.account.calledWith().mockReturnValue(account);
  // @ts-ignore
  // near-api-js marks this method as protected.
  // TODO: return value instead of null
  account.signAndSendTransaction.calledWith().mockReturnValue(null);
  account.state.calledWith().mockResolvedValue(
    mock<AccountView>({
      amount: "1000000000000000000000000",
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { setupMyNearWallet } = require("./my-near-wallet");
  const { wallet } = await mockWallet<BrowserWallet>(setupMyNearWallet(), deps);

  return {
    nearApiJs: require("near-api-js"),
    wallet,
    walletConnection,
    account,
  };
};

afterEach(() => {
  jest.resetModules();
});

describe("signIn", () => {
  it("sign into near wallet", async () => {
    const { wallet, nearApiJs } = await createMyNearWallet();

    await wallet.signIn({ contractId: "test.testnet" });

    expect(nearApiJs.connect).toHaveBeenCalled();
  });
});

describe("signOut", () => {
  it("sign out of near wallet", async () => {
    const { wallet, walletConnection } = await createMyNearWallet();

    await wallet.signIn({ contractId: "test.testnet" });
    await wallet.signOut();

    expect(walletConnection.signOut).toHaveBeenCalled();
  });
});

describe("getAccounts", () => {
  it("returns array of accounts", async () => {
    const { wallet, walletConnection } = await createMyNearWallet();

    await wallet.signIn({ contractId: "test.testnet" });
    const result = await wallet.getAccounts();

    expect(walletConnection.getAccountId).toHaveBeenCalled();
    expect(result).toEqual([
      { accountId: "test-account.testnet", publicKey: "" },
    ]);
  });
});

describe("signAndSendTransaction", () => {
  // TODO: Figure out why imports to core are returning undefined.
  it("signs and sends transaction", async () => {
    const { wallet, walletConnection, account } = await createMyNearWallet();

    await wallet.signIn({ contractId: "test.testnet" });
    const result = await wallet.signAndSendTransaction({
      receiverId: "guest-book.testnet",
      actions: [],
    });

    expect(walletConnection.account).toHaveBeenCalled();
    // near-api-js marks this method as protected.
    // @ts-ignore
    expect(account.signAndSendTransaction).toHaveBeenCalled();
    // @ts-ignore
    expect(account.signAndSendTransaction).toBeCalledWith({
      actions: [],
      receiverId: "guest-book.testnet",
    });
    expect(result).toEqual(null);
  });
});

describe("buildImportAccountsUrl", () => {
  it("returns import url", async () => {
    const { wallet } = await createMyNearWallet();

    expect(typeof wallet.buildImportAccountsUrl).toBe("function");

    // @ts-ignore
    expect(wallet?.buildImportAccountsUrl()).toEqual(
      "https://testnet.mynearwallet.com/batch-import"
    );
  });
});

describe("signMessage", () => {
  it("sign message", async () => {
    const { wallet } = await createMyNearWallet();

    const replace = window.location.replace;

    Object.defineProperty(window, "location", {
      value: { replace: jest.fn() },
    });

    const attributes = {
      message: "test message",
      nonce: Buffer.from("30990309-30990309-390A303-292090"),
      recipient: "test.app",
      callbackUrl: "https://test.app",
    };

    const result = await wallet.signMessage!(attributes);

    const nonceBase64 = attributes.nonce.toString("base64");
    const urlParams = `https://testnet.mynearwallet.com/sign-message?message=test+message&nonce=${encodeURIComponent(
      nonceBase64
    )}&recipient=test.app&callbackUrl=https%3A%2F%2Ftest.app`;

    expect(result).toBe(undefined);
    expect(window.location.replace).toHaveBeenCalledWith(urlParams);

    window.location.replace = replace;
  });
});
