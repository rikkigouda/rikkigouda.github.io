export const perspectives = [
  {
    id: 'fatherhood', title: 'Being a dad', short: 'Paying attention to what matters.',
    question: 'Am I listening, or preparing my reply?',
    paragraphs: [
      'Fatherhood has changed my sense of what deserves attention. Patience, being present and forgiving quickly matter more to me than they once did.',
      'Being present sounds simple. It asks something quite specific: leave room for the other person to finish, resist turning every conversation into a solution, and notice when your attention has wandered. There is plenty to learn in that pause.',
    ],
    practice: 'A small check',
    prompts: ['What did I actually hear?', 'Did I leave room for an answer I did not expect?'],
  },
  {
    id: 'engineering', title: 'Engineering as a craft', short: 'Know what a change will disturb.',
    question: 'What has to keep working?',
    paragraphs: [
      'Before replacing a system, I want to understand what it does for the people who depend on it. The awkward part may be carrying a requirement that nobody has written down.',
      'A useful investigation follows one real task through the system. Where does information enter? Who corrects it? What happens when a step fails? Those answers give a proposed replacement something concrete to preserve, improve or deliberately retire.',
    ],
    practice: 'Before choosing a solution',
    prompts: ['Describe one task from start to finish.', 'Separate an observed problem from a suspected cause.', 'Name the behaviour the change must preserve.'],
  },
  {
    id: 'trading', title: 'Markets & trading', short: 'The decision and the outcome are different questions.',
    question: 'What could I reasonably have known at the time?',
    paragraphs: [
      'I trade CFDs and use technical analysis across multiple indices. I also work on automation and prediction markets, with quantitative, swing and day-trading approaches. Python and backtesting are part of that work.',
      'A backtest gives an idea a result under a particular set of conditions. To understand that result, the conditions need to be visible too: the period tested, the information available at each decision and the assumptions about costs. Those details are more useful to discuss here than a chart of returns on its own.',
    ],
    practice: 'Questions for a review',
    prompts: ['What period and conditions does this test cover?', 'Could each input have been known at the time?', 'Which costs and assumptions are included?'],
  },
  {
    id: 'learning', title: 'Applied AI', short: 'Connecting language models to working systems.',
    question: 'What happens after the model gives an answer?',
    paragraphs: [
      'I build and put systems based on large language models (LLMs) into production in enterprise environments. That includes custom Model Context Protocol (MCP) solutions, which connect AI tools to data and actions, and new ways for people to work with existing business systems.',
      'The work includes modernising platforms and engineering practices, with AI tools becoming part of how software is developed. The existing system still has responsibilities to fulfil. A new interface needs to respect its permissions, preserve the meaning of its data and make failures understandable to the people using it.',
      'Consider a tool that can update a business record. Finding the right record, checking permission, confirming the intended change and showing whether it succeeded are separate responsibilities. A convincing answer from a model does not establish that the change was correct. Those boundaries are part of the design.',
      'Reinforcement learning is a separate interest I dabble with. I am curious about how rewards shape behaviour, but it is not the focus of my production work described here.',
    ],
    practice: 'Before putting a tool into use',
    prompts: ['What can it read or change, and whose permissions apply?', 'Which actions need a person to confirm them?', 'How do we check the result against the underlying system?', 'What can the user do when the model or a connected service fails?'],
  },
  {
    id: 'values', title: 'Culture, ethics & values', short: 'Seen. Heard. Respected.',
    question: 'Can someone disagree without paying for it later?',
    paragraphs: [
      'SHR is my shorthand for seen, heard and respected. In a workplace, that means more than being invited to a meeting. People need time to explain a concern, a fair hearing and an answer about what happens next.',
      'Empathy does not require pretending to agree. Honesty does not excuse treating someone badly. I value being truthful even when others disagree, and speaking from facts rather than gossip. When something is uncertain, saying so is part of that honesty.',
    ],
    practice: 'In a difficult conversation',
    prompts: ['Describe what happened without guessing a motive.', 'Separate what you observed from what you were told.', 'Check that the person affected has had a chance to speak.'],
  },
  {
    id: 'good', title: 'What good looks like', short: 'Set the standard before judging the result.',
    question: 'What would count as enough?',
    paragraphs: [
      '“Better” needs a reference point. Faster for the person doing the work may mean more work for someone else. Cheaper to build may mean harder to maintain. A useful standard makes those costs visible.',
      'Before judging a result, describe who it should help, what should change for them and what would make the cost unacceptable. Include a stopping point. Without one, improving something can become a reason never to finish it.',
    ],
    practice: 'Write down the standard',
    prompts: ['Who should notice a useful difference?', 'How will we recognise that difference?', 'What cost or harm would rule the result out?', 'When is the work sufficient?'],
  },
];
