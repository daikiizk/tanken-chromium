chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // カスタムヘッダーを追加
    details.requestHeaders.push({
      name: "X-Omnibox-Gemini",
      value: encodeURIComponent("マックグリドル🍔🥞とは？"),
    });

    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://gemini.google.com/prompt"] },
  ["blocking", "requestHeaders"]
);
