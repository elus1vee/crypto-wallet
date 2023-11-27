import "@ethersproject/shims";
import "@walletconnect/react-native-compat";

import { Core } from "@walletconnect/core";
import { ICore } from "@walletconnect/types";
import { IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";

export let web3wallet: IWeb3Wallet;
export let core: ICore;
export let currentETHAddress: string;

import { useCallback, useEffect, useState } from "react";
import { createOrRestoreEIP155Wallet } from "./EIP155Wallet";

async function createWeb3Wallet() {
  // Here we create / restore an EIP155 wallet
  const { eip155Addresses } = await createOrRestoreEIP155Wallet();
  currentETHAddress = eip155Addresses[0];

  // HardCoding it here for ease of tutorial
  // Paste your project ID here
  const ENV_PROJECT_ID = "1d9e71bf840e9520f9975774492a0153";
  const core = new Core({
    projectId: ENV_PROJECT_ID,
  });

  // Edit the metadata to your preference
  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "Web3Wallet React Native Tutorial",
      description: "ReactNative Web3Wallet",
      url: "https://walletconnect.com/",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  });
}

// Initialize the Web3Wallet
export default function useInitialization() {
  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    try {
      await createWeb3Wallet();
      setInitialized(true);
    } catch (err: unknown) {
      console.log("Error for initializing", err);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
}

export async function web3WalletPair(params: { uri: string }) {
  return await web3wallet.core.pairing.pair({ uri: params.uri });
}
