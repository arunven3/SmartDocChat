import { pipeline } from '@xenova/transformers';

const main = async () => {
  const pipe = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  );
  console.log('✅ Model downloaded and ready!');
};

main();