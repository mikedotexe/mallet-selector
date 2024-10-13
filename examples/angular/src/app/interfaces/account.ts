import type { AccountView } from "@meer-js/types";

export type Account = AccountView & {
  account_id: string | null;
};
