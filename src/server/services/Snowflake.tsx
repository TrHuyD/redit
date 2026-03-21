const EPOCH = 1700000000000n
const MACHINE_ID = 1n

let lastTimestamp = 0n
let sequence = 0n

const MAX_SEQUENCE = 127n

function generateSnowflake(): bigint {
  let timestamp = BigInt(Date.now())

  if (timestamp === lastTimestamp) {
    sequence++

    if (sequence > MAX_SEQUENCE) {
      while (timestamp <= lastTimestamp) {
        timestamp = BigInt(Date.now())
      }
      sequence = 0n
    }
  } else {
    sequence = 0n
  }

  lastTimestamp = timestamp

  const id =
    ((timestamp - EPOCH) << 12n) |
    (MACHINE_ID << 7n) |
    sequence

  return id
}
export const generatePostId = () => generateSnowflake()
export const generateUserId = () => generateSnowflake()
export const generateCommentId = () => generateSnowflake()
export const generateSubredditId = () => generateSnowflake()