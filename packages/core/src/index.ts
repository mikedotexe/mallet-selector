export type {
  WalletSelector,
  WalletSelectorParams,
  WalletSelectorEvents,
  WalletSelectorStore,
} from "./lib/wallet-selector.types";
export { setupWalletSelector } from "./lib/wallet-selector.js";

export type { Network, NetworkId } from "./lib/options.types";
export type {
  Subscription,
  StorageService,
  JsonStorageService,
  EventEmitterService,
} from "./lib/services";

export { EventEmitter } from "./lib/services";

export type { Optional } from "./lib/utils.types";

export type {
  WalletSelectorState,
  ContractState,
  ModuleState,
  AccountState,
} from "./lib/store.types";

export type {
  WalletModuleFactory,
  WalletModule,
  WalletBehaviourFactory,
  WalletBehaviourOptions,
  Wallet,
  WalletType,
  WalletMetadata,
  WalletEvents,
  SignInParams,
  BrowserWalletMetadata,
  BrowserWalletBehaviour,
  BrowserWallet,
  InjectedWalletMetadata,
  InjectedWalletBehaviour,
  InjectedWallet,
  InstantLinkWalletMetadata,
  InstantLinkWalletBehaviour,
  InstantLinkWallet,
  HardwareWalletMetadata,
  HardwareWalletSignInParams,
  HardwareWalletBehaviour,
  HardwareWallet,
  HardwareWalletAccount,
  BridgeWalletMetadata,
  BridgeWalletBehaviour,
  BridgeWallet,
  VerifiedOwner,
  VerifyOwnerParams,
  Account,
  Transaction,
  Action,
  ActionType,
  CreateAccountAction,
  DeployContractAction,
  FunctionCallAction,
  TransferAction,
  StakeAction,
  AddKeyAction,
  DeleteKeyAction,
  DeleteAccountAction,
  AddKeyPermission,
  AccountImportData,
  SignedMessage,
  SignMessageParams,
} from "./lib/wallet";

// i dunno man, why
export type { FinalExecutionOutcome } from "@meer-js/types";

export {
  waitFor,
  getActiveAccount,
  isCurrentBrowserSupported,
  verifyFullKeyBelongsToUser,
  verifySignature,
  serializeNep413,
} from "./lib/helpers";

export { translate, allowOnlyLanguage } from "./lib/translate/translate";
