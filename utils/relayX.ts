/**
 * Checks if the input is a string in the format of a RelayX Marketplace location such as: '99ad93845250b23859eceae8f5ca2e8ce953654c0b94b64e890f9c117c1233a6_o2'.
 * @param input - The input to be checked.
 * @returns The original input string if it is in the correct format, otherwise null.
 */
export function isRelayX(
  input: any
): { marketLocation: string; itemLocation: string | null } | null {
  // Check if input is a string
  if (typeof input !== "string") {
    return null;
  }

  const isRelayXMarketLocation = input.startsWith("https://relayx.com/market/");
  const isRelayXItem = input.startsWith("https://relayx.com/assets/");

  if (isRelayXMarketLocation) {
    return {
      marketLocation: input.substring(input.lastIndexOf("/") + 1),
      itemLocation: null,
    };
  } else if (isRelayXItem) {
    const assetsIndex = input.indexOf("assets/") + 7;
    const marketIndex = input.indexOf("/", assetsIndex);
    const relayXMarketLocation = input.substring(assetsIndex, marketIndex);
    const relayXItemLocation = input.substring(marketIndex + 1);
    return {
      marketLocation: relayXMarketLocation,
      itemLocation: relayXItemLocation,
    };
  } else {
    return null;
  }
}

