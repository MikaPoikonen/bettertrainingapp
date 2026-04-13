import mysql from 'mysql2/promise';
import 'dotenv/config';

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
};

let pool;

const createPool = () => mysql.createPool(connectionConfig);

const getPool = () => {
  if (!pool) {
    pool = createPool();
  }

  return pool;
};

const shouldReconnect = (error) => {
  const reconnectCodes = new Set([
    'ECONNRESET',
    'EPIPE',
    'PROTOCOL_CONNECTION_LOST',
    'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
    'PROTOCOL_ENQUEUE_AFTER_QUIT',
  ]);

  return (
    reconnectCodes.has(error?.code) ||
    error?.message?.includes('closed state') ||
    error?.message?.includes('Pool is closed')
  );
};

const resetPool = async () => {
  if (pool) {
    try {
      await pool.end();
    } catch {
      // Ignore shutdown failures while rebuilding the pool.
    }
  }

  pool = createPool();
  return pool;
};

const runWithReconnect = async (method, sql, params) => {
  try {
    return await getPool()[method](sql, params);
  } catch (error) {
    if (!shouldReconnect(error)) {
      throw error;
    }

    console.warn(`database reconnect after ${error.code || error.message}`);
    await resetPool();
    return getPool()[method](sql, params);
  }
};

const database = {
  execute(sql, params) {
    return runWithReconnect('execute', sql, params);
  },
  query(sql, params) {
    return runWithReconnect('query', sql, params);
  },
  async end() {
    if (!pool) {
      return;
    }

    const currentPool = pool;
    pool = undefined;
    await currentPool.end();
  },
};

export default database;
