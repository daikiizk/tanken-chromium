chrome.declarativeNetRequest.updateDynamicRules({
  addRules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: "X-Omnibox-Gemini",
            operation: "set",
            value: encodeURIComponent("マックグリドル🍔🥞とは？"),
          },
        ],
      },
      condition: {
        urlFilter: "https://gemini.google.com/prompt",
        resourceTypes: ["xmlhttprequest", "main_frame", "sub_frame"],
      },
    },
  ],
  removeRuleIds: [1], // 既存のルールを削除してから追加
});

// https://gyazo.com/01ed22a2954cc4a512d09cb416bea015
