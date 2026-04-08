const EPOCH = 1700000000000n
const MACHINE_ID = 1n

let lastTimestamp = 0n
let sequence = 0n

const MAX_SEQUENCE = 127n
function generateSnowflake(ts?: bigint): bigint {
  let timestamp = ts ?? BigInt(Date.now());

  if (timestamp === lastTimestamp) {
    sequence++;

    if (sequence > MAX_SEQUENCE) {
      while (timestamp <= lastTimestamp) {
        timestamp = BigInt(Date.now());
      }
      sequence = 0n;
    }
  } else {
    sequence = 0n;
  }

  lastTimestamp = timestamp;

  const id =
    ((timestamp - EPOCH) << 12n) |
    (MACHINE_ID << 7n) |
    sequence;

  return id;
}

export const generatePostId = (ts?: bigint) => generateSnowflake(ts);
export const generateUserId = (ts?: bigint) => generateSnowflake(ts);
export const generateCommentId = (ts?: bigint) => generateSnowflake(ts);
export const generateSubredditId = (ts?: bigint) => generateSnowflake(ts);