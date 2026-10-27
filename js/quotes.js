/* ============================================
   QUOTES - philosophers, scientists, engineers & discipline/learning quotes
   (no politicians, religious figures or celebrities)
   - Refreshes every 24 hours
   - Non-repeating until all quotes are shown
   ============================================ */

const STORAGE_KEY = 'study-roadmap-quote-rotation-v3';
export const QUOTE_REFRESH_HOURS = 24;
const QUOTE_REFRESH_MS = QUOTE_REFRESH_HOURS * 60 * 60 * 1000;

const QUOTES = [
  // --- Stoics ---
  { author: 'Marcus Aurelius', quote: 'You have power over your mind, not outside events. Realize this, and you will find strength.' },
  { author: 'Marcus Aurelius', quote: 'The impediment to action advances action. What stands in the way becomes the way.' },
  { author: 'Marcus Aurelius', quote: 'Waste no more time arguing what a good person should be. Be one.' },
  { author: 'Marcus Aurelius', quote: 'Do every act of your life as though it were the very last act of your life.' },
  { author: 'Marcus Aurelius', quote: 'If it is not right, do not do it; if it is not true, do not say it.' },
  { author: 'Marcus Aurelius', quote: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.' },
  { author: 'Marcus Aurelius', quote: 'Confine yourself to the present.' },
  { author: 'Marcus Aurelius', quote: 'At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work — as a human being.' },
  { author: 'Marcus Aurelius', quote: 'The happiness of your life depends upon the quality of your thoughts.' },
  { author: 'Marcus Aurelius', quote: 'Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.' },
  { author: 'Seneca', quote: 'Luck is what happens when preparation meets opportunity.' },
  { author: 'Seneca', quote: 'We suffer more often in imagination than in reality.' },
  { author: 'Seneca', quote: 'Difficulties strengthen the mind, as labor does the body.' },
  { author: 'Seneca', quote: 'As long as you live, keep learning how to live.' },
  { author: 'Seneca', quote: 'Life is long if you know how to use it.' },
  { author: 'Seneca', quote: 'While we are postponing, life speeds by.' },
  { author: 'Seneca', quote: 'It is not that we have a short time to live, but that we waste a lot of it.' },
  { author: 'Seneca', quote: 'Begin at once to live, and count each separate day as a separate life.' },
  { author: 'Seneca', quote: 'If a man knows not to which port he sails, no wind is favorable.' },
  { author: 'Seneca', quote: 'Per aspera ad astra. (Through hardship to the stars.)' },
  { author: 'Epictetus', quote: 'No man is free who is not master of himself.' },
  { author: 'Epictetus', quote: 'It is not what happens to you, but how you react to it that matters.' },
  { author: 'Epictetus', quote: 'First say to yourself what you would be; and then do what you have to do.' },
  { author: 'Epictetus', quote: 'If you want to improve, be content to be thought foolish and stupid.' },
  { author: 'Epictetus', quote: 'Make the best use of what is in your power, and take the rest as it happens.' },
  { author: 'Epictetus', quote: 'No great thing is created suddenly.' },
  { author: 'Epictetus', quote: 'It is impossible for a man to learn what he thinks he already knows.' },
  { author: 'Epictetus', quote: 'Only the educated are free.' },
  { author: 'Epictetus', quote: 'Don\'t explain your philosophy. Embody it.' },

  // --- Greek Philosophers ---
  { author: 'Socrates', quote: 'The unexamined life is not worth living.' },
  { author: 'Socrates', quote: 'I know that I know nothing.' },
  { author: 'Socrates', quote: 'Wisdom begins in wonder.' },
  { author: 'Plato', quote: 'The beginning is the most important part of the work.' },
  { author: 'Plato', quote: 'Courage is knowing what not to fear.' },
  { author: 'Plato', quote: 'Knowledge which is acquired under compulsion obtains no hold on the mind.' },
  { author: 'Plato', quote: 'The first and greatest victory is to conquer yourself.' },
  { author: 'Aristotle', quote: 'The roots of education are bitter, but the fruit is sweet.' },
  { author: 'Aristotle', quote: 'Knowing yourself is the beginning of all wisdom.' },
  { author: 'Aristotle', quote: 'Pleasure in the job puts perfection in the work.' },
  { author: 'Aristotle', quote: 'It is the mark of an educated mind to be able to entertain a thought without accepting it.' },
  { author: 'Aristotle', quote: 'For the things we have to learn before we can do them, we learn by doing them.' },
  { author: 'Aristotle', quote: 'Well begun is half done.' },
  { author: 'Will Durant, on Aristotle', quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.' },
  { author: 'Heraclitus', quote: 'The only constant in life is change.' },
  { author: 'Heraclitus', quote: 'No man ever steps in the same river twice, for it\'s not the same river and he\'s not the same man.' },
  { author: 'Heraclitus', quote: 'Character is destiny.' },
  { author: 'Plutarch', quote: 'The mind is not a vessel to be filled but a fire to be kindled.' },
  { author: 'Plutarch', quote: 'What we achieve inwardly will change outer reality.' },

  // --- Eastern Philosophers & Strategists ---
  { author: 'Confucius', quote: 'It does not matter how slowly you go as long as you do not stop.' },
  { author: 'Confucius', quote: 'The man who moves a mountain begins by carrying away small stones.' },
  { author: 'Confucius', quote: 'Our greatest glory is not in never falling, but in rising every time we fall.' },
  { author: 'Confucius', quote: 'Study the past if you would define the future.' },
  { author: 'Confucius', quote: 'Learning without thought is labor lost; thought without learning is perilous.' },
  { author: 'Confucius', quote: 'Real knowledge is to know the extent of one\'s ignorance.' },
  { author: 'Confucius', quote: 'Wheresoever you go, go with all your heart.' },
  { author: 'Laozi', quote: 'A journey of a thousand miles begins with a single step.' },
  { author: 'Laozi', quote: 'Knowing others is intelligence; knowing yourself is true wisdom.' },
  { author: 'Laozi', quote: 'Mastering others is strength; mastering yourself is true power.' },
  { author: 'Laozi', quote: 'Nature does not hurry, yet everything is accomplished.' },
  { author: 'Laozi', quote: 'When I let go of what I am, I become what I might be.' },
  { author: 'Laozi', quote: 'Do the difficult things while they are easy and do the great things while they are small.' },
  { author: 'Xunzi', quote: 'Learning must never stop.' },
  { author: 'Xunzi', quote: 'Not hearing is not as good as hearing, hearing is not as good as seeing, seeing is not as good as knowing, knowing is not as good as acting.' },
  { author: 'Sun Tzu', quote: 'In the midst of chaos, there is also opportunity.' },
  { author: 'Sun Tzu', quote: 'Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.' },
  { author: 'Sun Tzu', quote: 'Opportunities multiply as they are seized.' },
  { author: 'Miyamoto Musashi', quote: 'Today is victory over yourself of yesterday; tomorrow is your victory over lesser men.' },
  { author: 'Miyamoto Musashi', quote: 'Do nothing which is of no use.' },

  // --- Scientists ---
  { author: 'Albert Einstein', quote: 'Imagination is more important than knowledge.' },
  { author: 'Albert Einstein', quote: 'A person who never made a mistake never tried anything new.' },
  { author: 'Albert Einstein', quote: 'If you can\'t explain it simply, you don\'t understand it well enough.' },
  { author: 'Albert Einstein', quote: 'Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.' },
  { author: 'Albert Einstein', quote: 'Life is like riding a bicycle. To keep your balance you must keep moving.' },
  { author: 'Albert Einstein', quote: 'It\'s not that I\'m so smart, it\'s just that I stay with problems longer.' },
  { author: 'Albert Einstein', quote: 'Logic will get you from A to B. Imagination will take you everywhere.' },
  { author: 'Isaac Newton', quote: 'If I have seen further, it is by standing on the shoulders of giants.' },
  { author: 'Isaac Newton', quote: 'If I have ever made any valuable discoveries, it has been due more to patient attention than to any other talent.' },
  { author: 'Isaac Newton', quote: 'Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.' },
  { author: 'Marie Curie', quote: 'Nothing in life is to be feared, it is only to be understood.' },
  { author: 'Marie Curie', quote: 'Be less curious about people and more curious about ideas.' },
  { author: 'Marie Curie', quote: 'I was taught that the way of progress was neither swift nor easy.' },
  { author: 'Marie Curie', quote: 'One never notices what has been done; one can only see what remains to be done.' },
  { author: 'Marie Curie', quote: 'Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.' },
  { author: 'Richard Feynman', quote: 'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.' },
  { author: 'Richard Feynman', quote: 'The first principle is that you must not fool yourself and you are the easiest person to fool.' },
  { author: 'Richard Feynman', quote: 'What I cannot create, I do not understand.' },
  { author: 'Richard Feynman', quote: 'I would rather have questions that can\'t be answered than answers that can\'t be questioned.' },
  { author: 'Richard Feynman', quote: 'There is a pleasure in recognizing old things from a new point of view.' },
  { author: 'Richard Feynman', quote: 'I was born not knowing and have had only a little time to change that here and there.' },
  { author: 'Stephen Hawking', quote: 'However difficult life may seem, there is always something you can do and succeed at.' },
  { author: 'Stephen Hawking', quote: 'Intelligence is the ability to adapt to change.' },
  { author: 'Stephen Hawking', quote: 'Remember to look up at the stars and not down at your feet.' },
  { author: 'Charles Darwin', quote: 'A man who dares to waste one hour of time has not discovered the value of life.' },
  { author: 'Nikola Tesla', quote: 'The present is theirs; the future, for which I really worked, is mine.' },
  { author: 'Carl Sagan', quote: 'Somewhere, something incredible is waiting to be known.' },
  { author: 'Carl Sagan', quote: 'The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.' },
  { author: 'Galileo Galilei', quote: 'You cannot teach a man anything; you can only help him discover it in himself.' },
  { author: 'Leonardo da Vinci', quote: 'Learning never exhausts the mind.' },
  { author: 'Leonardo da Vinci', quote: 'The noblest pleasure is the joy of understanding.' },
  { author: 'Leonardo da Vinci', quote: 'I have been impressed with the urgency of doing. Knowing is not enough; we must apply.' },
  { author: 'Leonardo da Vinci', quote: 'Simplicity is the ultimate sophistication.' },
  { author: 'Louis Pasteur', quote: 'Chance favors the prepared mind.' },
  { author: 'Louis Pasteur', quote: 'Let me tell you the secret that has led me to my goal: my strength lies solely in my tenacity.' },
  { author: 'Thomas Edison', quote: 'There is no substitute for hard work.' },
  { author: 'Thomas Edison', quote: 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.' },
  { author: 'Thomas Edison', quote: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.' },
  { author: 'Thomas Edison', quote: 'Genius is one percent inspiration, ninety-nine percent perspiration.' },
  { author: 'Santiago Ramón y Cajal', quote: 'Every man can, if he so desires, become the sculptor of his own brain.' },
  { author: 'Michael Faraday', quote: 'Nothing is too wonderful to be true, if it be consistent with the laws of nature.' },
  { author: 'James Clerk Maxwell', quote: 'Thoroughly conscious ignorance is the prelude to every real advance in science.' },
  { author: 'Niels Bohr', quote: 'An expert is a person who has found out by his own painful experience all the mistakes that one can make in a very narrow field.' },
  { author: 'Werner Heisenberg', quote: 'Not only is the universe stranger than we think, it is stranger than we can think.' },
  { author: 'Isaac Asimov', quote: 'The true delight is in the finding out rather than in the knowing.' },
  { author: 'Isaac Asimov', quote: 'Self-education is, I firmly believe, the only kind of education there is.' },

  // --- Mathematicians ---
  { author: 'Euclid', quote: 'There is no royal road to geometry.' },
  { author: 'Archimedes', quote: 'Give me a lever long enough and a fulcrum on which to place it, and I shall move the world.' },
  { author: 'Henri Poincaré', quote: 'It is through science that we prove, but through intuition that we discover.' },
  { author: 'Carl Friedrich Gauss', quote: 'It is not knowledge, but the act of learning, not possession but the act of getting there, which grants the greatest enjoyment.' },
  { author: 'David Hilbert', quote: 'We must know. We will know.' },
  { author: 'George Pólya', quote: 'If you can\'t solve a problem, then there is an easier problem you can solve: find it.' },
  { author: 'Paul Halmos', quote: 'The only way to learn mathematics is to do mathematics.' },
  { author: 'Sofia Kovalevskaya', quote: 'It is impossible to be a mathematician without being a poet in soul.' },

  // --- Modern Philosophers ---
  { author: 'Friedrich Nietzsche', quote: 'He who has a why to live can bear almost any how.' },
  { author: 'Friedrich Nietzsche', quote: 'That which does not kill us makes us stronger.' },
  { author: 'Friedrich Nietzsche', quote: 'No one can build you the bridge on which you, and only you, must cross the river of life.' },
  { author: 'Friedrich Nietzsche', quote: 'One must still have chaos in oneself to be able to give birth to a dancing star.' },
  { author: 'Arthur Schopenhauer', quote: 'Talent hits a target no one else can hit; genius hits a target no one else can see.' },
  { author: 'Immanuel Kant', quote: 'Science is organized knowledge. Wisdom is organized life.' },
  { author: 'Immanuel Kant', quote: 'Have the courage to use your own understanding.' },
  { author: 'René Descartes', quote: 'It is not enough to have a good mind; the main thing is to use it well.' },
  { author: 'René Descartes', quote: 'Divide each difficulty into as many parts as is feasible and necessary to resolve it.' },
  { author: 'Baruch Spinoza', quote: 'All things excellent are as difficult as they are rare.' },
  { author: 'Blaise Pascal', quote: 'All of humanity\'s problems stem from man\'s inability to sit quietly in a room alone.' },
  { author: 'Voltaire', quote: 'No problem can withstand the assault of sustained thinking.' },
  { author: 'Voltaire', quote: 'Judge a man by his questions rather than by his answers.' },
  { author: 'Voltaire', quote: 'The perfect is the enemy of the good.' },
  { author: 'Francis Bacon', quote: 'Knowledge is power.' },
  { author: 'Francis Bacon', quote: 'A wise man will make more opportunities than he finds.' },
  { author: 'Francis Bacon', quote: 'Reading maketh a full man; conference a ready man; and writing an exact man.' },
  { author: 'John Locke', quote: 'Reading furnishes the mind only with materials of knowledge; it is thinking that makes what we read ours.' },
  { author: 'David Hume', quote: 'The richest genius, like the most fertile soil, when uncultivated, shoots up into the rankest weeds.' },
  { author: 'Søren Kierkegaard', quote: 'Life can only be understood backwards; but it must be lived forwards.' },
  { author: 'Jean-Paul Sartre', quote: 'Man is nothing else but what he makes of himself.' },
  { author: 'Albert Camus', quote: 'The struggle itself towards the heights is enough to fill a man\'s heart.' },
  { author: 'Albert Camus', quote: 'In the depth of winter, I finally learned that within me there lay an invincible summer.' },
  { author: 'Bertrand Russell', quote: 'The good life is one inspired by love and guided by knowledge.' },
  { author: 'Bertrand Russell', quote: 'In all affairs it\'s a healthy thing now and then to hang a question mark on the things you have long taken for granted.' },
  { author: 'Bertrand Russell', quote: 'The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.' },
  { author: 'Ludwig Wittgenstein', quote: 'The limits of my language mean the limits of my world.' },
  { author: 'Karl Popper', quote: 'True ignorance is not the absence of knowledge, but the refusal to acquire it.' },
  { author: 'Ralph Waldo Emerson', quote: 'Do not go where the path may lead, go instead where there is no path and leave a trail.' },
  { author: 'Ralph Waldo Emerson', quote: 'Nothing great was ever achieved without enthusiasm.' },
  { author: 'Henry David Thoreau', quote: 'Go confidently in the direction of your dreams. Live the life you have imagined.' },
  { author: 'Henry David Thoreau', quote: 'Success usually comes to those who are too busy to be looking for it.' },
  { author: 'Henry David Thoreau', quote: 'You must live in the present, launch yourself on every wave, find your eternity in each moment.' },
  { author: 'Johann Wolfgang von Goethe', quote: 'Knowing is not enough; we must apply. Willing is not enough; we must do.' },
  { author: 'William James', quote: 'Act as if what you do makes a difference. It does.' },
  { author: 'William James', quote: 'Believe that life is worth living, and your belief will help create the fact.' },
  { author: 'John Dewey', quote: 'Education is not preparation for life; education is life itself.' },
  { author: 'John Dewey', quote: 'We do not learn from experience. We learn from reflecting on experience.' },
  { author: 'Alfred North Whitehead', quote: 'Education is the acquisition of the art of the utilisation of knowledge.' },
  { author: 'John Stuart Mill', quote: 'One person with a belief is equal to a force of ninety-nine who have only interests.' },
  { author: 'William of Ockham', quote: 'Entities should not be multiplied without necessity.' },
  { author: 'Ibn Sina', quote: 'The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes.' },
  { author: 'Viktor Frankl', quote: 'When we are no longer able to change a situation, we are challenged to change ourselves.' },
  { author: 'Viktor Frankl', quote: 'Between stimulus and response there is a space. In that space is our power to choose our response.' },

  // --- Computer Scientists & Engineers ---
  { author: 'Donald Knuth', quote: 'Premature optimization is the root of all evil.' },
  { author: 'Donald Knuth', quote: 'Science is what we understand well enough to explain to a computer. Art is everything else we do.' },
  { author: 'Edsger Dijkstra', quote: 'Simplicity is a prerequisite for reliability.' },
  { author: 'Edsger Dijkstra', quote: 'The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.' },
  { author: 'Alan Turing', quote: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.' },
  { author: 'Grace Hopper', quote: 'The most dangerous phrase in the language is, \'We\'ve always done it this way\'.' },
  { author: 'Grace Hopper', quote: 'A ship in port is safe, but that\'s not what ships are built for.' },
  { author: 'Linus Torvalds', quote: 'Talk is cheap. Show me the code.' },
  { author: 'Alan Kay', quote: 'The best way to predict the future is to invent it.' },
  { author: 'Brian Kernighan', quote: 'Debugging is twice as hard as writing the code in the first place. So if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.' },
  { author: 'Harold Abelson', quote: 'Programs must be written for people to read, and only incidentally for machines to execute.' },
  { author: 'Kent Beck', quote: 'Make it work, make it right, make it fast.' },
  { author: 'Ken Thompson', quote: 'When in doubt, use brute force.' },
  { author: 'Fred Brooks', quote: 'Plan to throw one away; you will, anyhow.' },
  { author: 'John Carmack', quote: 'Focused, hard work is the real key to success. Keep your eyes on the goal, and just keep taking the next step towards completing it.' },
  { author: 'Andrew Ng', quote: 'If you want to do interesting work, you have to be working on hard problems.' },
  { author: 'Marvin Minsky', quote: 'You don\'t understand anything until you learn it more than one way.' },
  { author: 'John McCarthy', quote: 'As soon as it works, no one calls it AI anymore.' },

  // --- Learning Science ---
  { author: 'Carol Dweck', quote: 'The passion for stretching yourself and sticking to it, even (or especially) when it\'s not going well, is the hallmark of the growth mindset.' },
  { author: 'Carol Dweck', quote: 'In a growth mindset, challenges are exciting rather than threatening.' },
  { author: 'Angela Duckworth', quote: 'Grit is living life like it\'s a marathon, not a sprint.' },
  { author: 'Angela Duckworth', quote: 'As much as talent counts, effort counts twice.' },
  { author: 'Josh Waitzkin', quote: 'The moment we believe that success is determined by an ingrained level of ability as opposed to resilience and hard work, we will be brittle in the face of adversity.' },
  { author: 'Abraham Maslow', quote: 'In any given moment we have two options: to step forward into growth or step back into safety.' },

  // --- Discipline & Craft ---
  { author: 'James Clear', quote: 'You do not rise to the level of your goals. You fall to the level of your systems.' },
  { author: 'James Clear', quote: 'Every action you take is a vote for the type of person you wish to become.' },
  { author: 'James Clear', quote: 'Success is the product of daily habits—not once-in-a-lifetime transformations.' },
  { author: 'James Clear', quote: 'Habits are the compound interest of self-improvement.' },
  { author: 'James Clear', quote: 'You don\'t have to be the victim of your environment. You can also be the architect of it.' },
  { author: 'Cal Newport', quote: 'If you don\'t produce, you won\'t thrive—no matter how skilled or talented you are.' },
  { author: 'Cal Newport', quote: 'Human beings, it seems, are at their best when immersed deeply in something challenging.' },
  { author: 'Cal Newport', quote: 'Clarity about what matters provides clarity about what does not.' },
  { author: 'Steve Martin', quote: 'Be so good they can\'t ignore you.' },
  { author: 'Malcolm Gladwell', quote: 'Practice isn\'t the thing you do once you\'re good. It\'s the thing you do that makes you good.' },
  { author: 'Ryan Holiday', quote: 'The obstacle is the way.' },
  { author: 'Ryan Holiday', quote: 'Each day, we wake with a finite amount of time and energy. How we use it matters.' },
  { author: 'Steven Pressfield', quote: 'Are you paralyzed with fear? That\'s a good sign. Fear is good. Like self-doubt, fear is an indicator. Fear tells us what we have to do.' },
  { author: 'Robert Greene', quote: 'The future belongs to those who learn more skills and combine them in creative ways.' },
  { author: 'Bruce Lee', quote: 'I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.' },
  { author: 'Bruce Lee', quote: 'Absorb what is useful, discard what is useless and add what is specifically your own.' },
  { author: 'David Goggins', quote: 'You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.' },
  { author: 'David Goggins', quote: 'Be uncommon amongst uncommon people.' },
  { author: 'Jocko Willink', quote: 'Discipline equals freedom.' },
  { author: 'Jim Rohn', quote: 'Formal education will make you a living; self-education will make you a fortune.' },
  { author: 'Jim Rohn', quote: 'Success is nothing more than a few simple disciplines, practiced every day.' },
  { author: 'Jim Rohn', quote: 'Don\'t wish it were easier; wish you were better. Don\'t wish for fewer problems; wish for more skills.' },
  { author: 'Zig Ziglar', quote: 'You don\'t have to be great to start, but you have to start to be great.' },
  { author: 'Stephen Covey', quote: 'The key is not to prioritize what\'s on your schedule, but to schedule your priorities.' },
  { author: 'Derek Sivers', quote: 'If information were the answer, then we\'d all be billionaires with perfect abs.' },

  // --- Persistence (classical & literary) ---
  { author: 'Ovid', quote: 'Dripping water hollows out stone, not through force but through persistence.' },
  { author: 'Horace', quote: 'Begin, be bold, and venture to be wise.' },
  { author: 'Publilius Syrus', quote: 'Anyone can hold the helm when the sea is calm.' },
  { author: 'Publilius Syrus', quote: 'It is a bad plan that admits of no modification.' },
  { author: 'Saadi', quote: 'Have patience. All things are difficult before they become easy.' },
  { author: 'Aristotle', quote: 'Patience is bitter, but its fruit is sweet.' },
  { author: 'Pythagoras', quote: 'Rest satisfied with doing well, and leave others to talk of you as they will.' },
  { author: 'Samuel Beckett', quote: 'Ever tried. Ever failed. No matter. Try again. Fail again. Fail better.' },
  { author: 'Jack London', quote: 'You can\'t wait for inspiration. You have to go after it with a club.' },
  { author: 'Henry Wadsworth Longfellow', quote: 'Great is the art of beginning, but greater is the art of ending.' },
  { author: 'Thomas Carlyle', quote: 'A man without a goal is like a ship without a rudder.' },
  { author: 'Aldous Huxley', quote: 'Facts do not cease to exist because they are ignored.' },
];

export const TOTAL_MOTIVATION_QUOTES = QUOTES.length;

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildShuffledQueue(excludeIndex = null) {
  const queue = shuffleInPlace(Array.from({ length: TOTAL_MOTIVATION_QUOTES }, (_, i) => i));
  if (
    excludeIndex !== null &&
    TOTAL_MOTIVATION_QUOTES > 1 &&
    queue[queue.length - 1] === excludeIndex
  ) {
    const swapWith = Math.floor(Math.random() * (queue.length - 1));
    [queue[queue.length - 1], queue[swapWith]] = [queue[swapWith], queue[queue.length - 1]];
  }
  return queue;
}

function createDefaultState() {
  return {
    currentIndex: -1,
    remainingIndices: buildShuffledQueue(),
    nextRefreshAt: 0,
  };
}

function sanitizeState(raw) {
  if (!raw || typeof raw !== 'object') return createDefaultState();

  const currentIndex = Number.isInteger(raw.currentIndex) ? raw.currentIndex : -1;
  const nextRefreshAt = Number.isFinite(raw.nextRefreshAt) ? raw.nextRefreshAt : 0;

  const remainingIndices = Array.isArray(raw.remainingIndices)
    ? raw.remainingIndices.filter(i => Number.isInteger(i) && i >= 0 && i < TOTAL_MOTIVATION_QUOTES)
    : [];

  return {
    currentIndex,
    nextRefreshAt,
    remainingIndices,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return sanitizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

function pickNextQuote(state, nowMs) {
  if (!Array.isArray(state.remainingIndices) || state.remainingIndices.length === 0) {
    state.remainingIndices = buildShuffledQueue(
      Number.isInteger(state.currentIndex) && state.currentIndex >= 0 ? state.currentIndex : null
    );
  }

  let nextIndex = state.remainingIndices.pop();
  if (nextIndex === state.currentIndex && state.remainingIndices.length > 0) {
    nextIndex = state.remainingIndices.pop();
  }

  if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= TOTAL_MOTIVATION_QUOTES) {
    nextIndex = 0;
  }

  state.currentIndex = nextIndex;
  state.nextRefreshAt = nowMs + QUOTE_REFRESH_MS;
}

function ensureState(nowMs = Date.now()) {
  const state = loadState();
  let changed = false;

  const currentValid = Number.isInteger(state.currentIndex)
    && state.currentIndex >= 0
    && state.currentIndex < TOTAL_MOTIVATION_QUOTES;

  if (!currentValid) {
    pickNextQuote(state, nowMs);
    changed = true;
  } else if (!Number.isFinite(state.nextRefreshAt) || nowMs >= state.nextRefreshAt) {
    pickNextQuote(state, nowMs);
    changed = true;
  }

  if (changed) saveState(state);
  return { state, changed };
}

export function getCurrentMotivationQuote(nowMs = Date.now()) {
  const { state } = ensureState(nowMs);
  const current = QUOTES[state.currentIndex] || QUOTES[0];
  return {
    ...current,
    nextRefreshAt: state.nextRefreshAt,
    total: TOTAL_MOTIVATION_QUOTES,
  };
}

export function rotateQuoteIfDue(nowMs = Date.now()) {
  const { changed } = ensureState(nowMs);
  return changed;
}
