const receiptsData = [
  // Chapter 1: The Late Night Project (March 12-14)
  {
    id: "r1",
    type: "music",
    timestamp: "2026-03-12T01:14:00Z",
    content: { title: "Nightcall", artist: "Kavinsky", albumArt: "🎵" },
    tags: ["late-night", "focus"]
  },
  {
    id: "r2",
    type: "search",
    timestamp: "2026-03-12T01:45:00Z",
    content: { query: "how to fix memory leak in canvas react" },
    tags: ["late-night", "coding"]
  },
  {
    id: "r3",
    type: "purchase",
    timestamp: "2026-03-12T02:30:00Z",
    content: { item: "Venti Cold Brew", amount: "$5.25", location: "Starbucks 24/7" },
    tags: ["late-night", "caffeine"]
  },
  {
    id: "r4",
    type: "message",
    timestamp: "2026-03-12T03:15:00Z",
    content: { sender: "You", text: "I'm never using this library again. It's 3 AM.", recipient: "Alex" },
    tags: ["late-night", "frustration"]
  },
  {
    id: "r5",
    type: "note",
    timestamp: "2026-03-12T04:00:00Z",
    content: { text: "Finally fixed. Note to self: always clean up event listeners." },
    tags: ["coding", "relief"]
  },

  // Chapter 2: The Spontaneous Trip (April 4-6)
  {
    id: "r6",
    type: "search",
    timestamp: "2026-04-03T18:20:00Z",
    content: { query: "cheap weekend flights to tokyo" },
    tags: ["travel", "spontaneous"]
  },
  {
    id: "r7",
    type: "purchase",
    timestamp: "2026-04-03T19:05:00Z",
    content: { item: "Roundtrip Ticket: HND", amount: "$320.00", location: "Skyline Airlines" },
    tags: ["travel", "big-purchase"]
  },
  {
    id: "r8",
    type: "place",
    timestamp: "2026-04-04T10:30:00Z",
    content: { name: "Shibuya Crossing", city: "Tokyo, Japan" },
    tags: ["travel", "location"]
  },
  {
    id: "r9",
    type: "photo",
    timestamp: "2026-04-04T10:35:00Z",
    content: { description: "Blurry photo of crowds in the rain", emoji: "📸" },
    tags: ["travel", "memory", "rain"]
  },
  {
    id: "r10",
    type: "music",
    timestamp: "2026-04-04T11:00:00Z",
    content: { title: "Lost in Translation", artist: "Lofi Beats", albumArt: "🎧" },
    tags: ["travel", "mood"]
  },
  {
    id: "r11",
    type: "purchase",
    timestamp: "2026-04-04T13:00:00Z",
    content: { item: "Ichiran Ramen", amount: "¥980", location: "Shibuya" },
    tags: ["travel", "food"]
  },

  // Chapter 3: A Quiet Sunday (May 10)
  {
    id: "r12",
    type: "music",
    timestamp: "2026-05-10T09:00:00Z",
    content: { title: "Sunday Morning", artist: "The Velvet Underground", albumArt: "🌅" },
    tags: ["weekend", "chill"]
  },
  {
    id: "r13",
    type: "place",
    timestamp: "2026-05-10T10:30:00Z",
    content: { name: "Local Botanical Garden", city: "Hometown" },
    tags: ["weekend", "nature"]
  },
  {
    id: "r14",
    type: "photo",
    timestamp: "2026-05-10T11:15:00Z",
    content: { description: "Close up of a monstera leaf", emoji: "🌿" },
    tags: ["nature", "photography"]
  },
  {
    id: "r15",
    type: "purchase",
    timestamp: "2026-05-10T12:00:00Z",
    content: { item: "Used Book: 'The Secret Life of Plants'", amount: "$12.00", location: "Corner Bookstore" },
    tags: ["reading", "hobby"]
  },
  {
    id: "r16",
    type: "note",
    timestamp: "2026-05-10T15:00:00Z",
    content: { text: "Maybe I should start a garden." },
    tags: ["thought", "future"]
  }
];

export default receiptsData;
