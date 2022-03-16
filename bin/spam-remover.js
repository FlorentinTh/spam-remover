import SpamRemover from '../src/SpamRemover.js';

(async () => {
  const spamRemover = new SpamRemover();
  await spamRemover.authenticate();
  await spamRemover.run();
})();
