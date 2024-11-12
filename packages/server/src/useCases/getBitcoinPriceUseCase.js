export async function getBitcoinPriceUseCase() {
  try {
    const response = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice/BTC.json",
    );
    const data = await response.json();
    return data.bpi.USD.rate_float;
  } catch (error) {
    console.error("Failed to fetch Bitcoin price", error);
    throw error;
  }
}
