// import SpamRemover from '../src/SpamRemover.js';

(async () => {
  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'test') {
    console.log(process.env.TEST_TOKEN);
  }
  // const spamRemover = new SpamRemover();
  // await spamRemover.authenticate();
  // await spamRemover.run();
})();
