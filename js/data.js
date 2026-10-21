// Test questions. Each question: [text, [options], indexOfCorrectOption]
// To add or edit questions, change only this file.
const CHAPTERS = [
  { title: 'Our Green Planet', emoji: '🌍', subtitle: 'Plants, animals and why nature matters',
    questions: [
      ['What do plants give us to breathe?', ['Smoke', 'Oxygen', 'Dust'], 1],
      ['Where do many animals live?', ['In their natural homes like forests', 'Only in zoos', 'In our classrooms'], 0],
      ['What happens when we cut too many trees?', ['Animals lose homes', 'Nothing', 'Air gets cleaner'], 0],
      ['Which of these is a living thing?', ['Rock', 'Tree', 'Plastic bottle'], 1]
    ] },
  { title: 'Reduce, Reuse, Recycle', emoji: '♻️', subtitle: 'Less waste, more fun',
    questions: [
      ['What does "reuse" mean?', ['Throw away', 'Use something again', 'Buy a new one'], 1],
      ['Where should we throw garbage?', ['On the road', 'In a dustbin', 'In a river'], 1],
      ['Which can be recycled?', ['Paper', 'Banana peel in a bag', 'Dirty tissue'], 0],
      ['Which is a good way to reduce waste?', ['Carry a cloth bag', 'Use many plastic bags', 'Waste food'], 0]
    ] },
  { title: 'Save Water and Energy', emoji: '💧', subtitle: 'Every drop and every switch counts',
    questions: [
      ['What should you do while brushing teeth?', ['Leave the tap running', 'Turn the tap off', 'Play with water'], 1],
      ['What should you do when leaving a room?', ['Switch off lights and fans', 'Leave them on', 'Open all windows'], 0],
      ['A leaking tap should be...', ['Ignored', 'Reported and fixed', 'Left forever'], 1],
      ['Which saves fuel?', ['Walking to a nearby shop', 'Taking a car every time', 'Idling the engine'], 0]
    ] },
  { title: 'Being a Good Citizen', emoji: '🤝', subtitle: 'Civic sense starts with you',
    questions: [
      ['What should you do while waiting your turn?', ['Push ahead', 'Stand in line', 'Shout'], 1],
      ['Who should get a seat first on a bus?', ['Elders and people who need it', 'Only the fastest', 'Nobody'], 0],
      ['Public parks belong to...', ['Only the gardener', 'Everyone', 'Nobody'], 1],
      ['Which is a polite word?', ['Thank you', 'Go away', 'Move'], 0]
    ] },
  { title: 'Caring for Our Community', emoji: '🏘️', subtitle: 'Clean streets and safe roads',
    questions: [
      ['Where should you cross the road?', ['Anywhere', 'At the zebra crossing', 'Between parked cars'], 1],
      ['A red traffic light means...', ['Go', 'Stop', 'Run'], 1],
      ['If you see litter in a park, you should...', ['Pick it up and bin it', 'Kick it away', 'Ignore it'], 0],
      ['Which helps your community?', ['Planting a tree', 'Breaking benches', 'Making noise late at night'], 0]
    ] }
];

// Badge levels, checked from the top. "min" is the share of correct answers (0 to 1).
const BADGES = [
  { min: 0.85, emoji: '🏆', name: 'Green Star Champion', text: 'You really care for our planet.' },
  { min: 0.6,  emoji: '🌟', name: 'Eco Explorer',        text: 'You are doing wonderfully.' },
  { min: 0,    emoji: '🌱', name: 'Green Sprout',        text: 'Keep reading and try the tests again.' }
];
