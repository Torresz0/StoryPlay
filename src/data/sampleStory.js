const sampleStory = {
  variables: {
    health: 10,
    gold: 3,
  },

  nodes: [
    {
      id: "1",
      type: "storyNode",
      position: { x: 80, y: 120 },
      data: {
        title: "Wake Up",
        content:
          "You wake up in a locked room.\nA phone glows on the floor beside the bed.",
        blockType: "narrative",
        choices: [
          {
            id: "c1",
            label: "Check phone",
            targetNodeId: "2",
          },
          {
            id: "c2",
            label: "Search desk",
            targetNodeId: "3",
          },
        ],
      },
    },
    {
      id: "2",
      type: "storyNode",
      position: { x: 430, y: 60 },
      data: {
        title: "Check Phone",
        content:
          "The screen flickers to life.\nA single unread message waits for you.",
        blockType: "chat",
        choices: [
          {
            id: "c3",
            label: "Put the phone away",
            targetNodeId: "1",
          },
        ],
      },
    },
    {
      id: "3",
      type: "storyNode",
      position: { x: 430, y: 260 },
      data: {
        title: "Search Desk",
        content:
          "Inside the desk drawer you find a bent coin, a paperclip, and a tiny brass key.",
        blockType: "timed",
        choices: [
          {
            id: "c4",
            label: "Use key on the door",
            targetNodeId: "4",
          },
        ],
      },
    },
    {
      id: "4",
      type: "storyNode",
      position: { x: 780, y: 160 },
      data: {
        title: "Escape",
        content:
          "The key turns. The door clicks open.\nCold hallway air rushes in.",
        blockType: "ending",
        choices: [],
      },
    },
  ],
};

export default sampleStory;