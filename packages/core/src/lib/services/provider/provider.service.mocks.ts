import type { QueryResponseKind } from "@meer-js/types";

export const createQueryResponseMock = (): QueryResponseKind => ({
  block_height: 0,
  block_hash: "",
});

export const createViewAccessKeyResponseMock = () => ({
  ...createQueryResponseMock(),
  nonce: 0,
  permission: "FullAccess",
});
