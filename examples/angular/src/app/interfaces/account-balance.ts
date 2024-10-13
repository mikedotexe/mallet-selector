import type { providers } from "meer-api-js";

export interface GetAccountBalanceProps {
  provider: providers.Provider;
  accountId: string;
}
