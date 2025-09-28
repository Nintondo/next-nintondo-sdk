"use client";

import { useNintondo } from "nintondo-sdk/react";
import type { NetworkType } from "nintondo-sdk/types";

import { useEffect, useState } from "react";

const NETWORKS: NetworkType[] = [
  "bellsMainnet",
  "bellsTestnet",
  "dogeMainnet",
  "dogeTestnet",
  "pepeMainnet",
  "pepeTestnet",
];

interface UserInfo {
  utxosCount: number;
}

export default function Home() {
  const [network, setNetwork] = useState<NetworkType>(NETWORKS[0]);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [address, setAddress] = useState<string>();

  const { nintondo } = useNintondo();

  useEffect(() => {
    if (address) {
      (async () => {
        const utxos = await nintondo?.api.getUtxos(address);
        setUserInfo({
          utxosCount: utxos?.length ?? 0,
        });
      })();
    }
  }, [address, nintondo]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        Wallet injected: {typeof nintondo !== "undefined" ? "true" : "false"}
      </div>
      <div>Connected address: {address}</div>
      <div>Utxos count: {userInfo?.utxosCount}</div>
      <select
        onChange={(e) => {
          setNetwork(e.target.value as NetworkType);
        }}
      >
        {NETWORKS.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => {
          nintondo?.provider.connect(network).then(setAddress);
        }}
      >
        Connect
      </button>
    </div>
  );
}
