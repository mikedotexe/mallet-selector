import type { HereInitializeOptions } from "@here-wallet/core";
import type {
  WalletBehaviourFactory,
  InjectedWallet,
} from "@meer-wallet-selector/core";

export type SelectorInit = WalletBehaviourFactory<
  InjectedWallet,
  { walletOptions?: HereInitializeOptions }
>;
