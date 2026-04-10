const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnvIfPresent(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    dotenv.config({ path: filePath });
  }
}

const cwd = process.cwd();
// Repo root `.env` when the server is started from `backend/` (e.g. `cd backend && npm start`)
loadEnvIfPresent(path.join(cwd, '..', '.env'));
loadEnvIfPresent(path.join(cwd, '.env'));

const nodeEnv = process.env.NODE_ENV || 'development';
loadEnvIfPresent(path.join(cwd, '..', `${nodeEnv}.env`));
loadEnvIfPresent(path.join(cwd, `${nodeEnv}.env`));

module.exports = {
  // Database removed - using mock data service instead
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'change-this-secret-key-in-production',
  SESSION_EXPIRES_IN: process.env.SESSION_EXPIRES_IN || '24h',
  imageUrl: process.env.IMAGE_URL || '',
  contractAddress: process.env.CONTRACT_ADDRESS || '0x98Ff86eD5B0dDd3C85115845A90A6066C25bedf9',
  clientDepositAddress: process.env.CLIENT_DEPOSIT_ADDRESS || '0xEfcd2e9ca6483147A25a106C654a6E557eb8f916',
  // Use BACKEND_PORT only — root `.env` sets `PORT` for Create React App; sharing it
  // made the API and webpack dev server fight for the same port (e.g. 2468).
  port: parseInt(process.env.BACKEND_PORT || '1357', 10),
  nodeEnv,
  blockedAddresses: (process.env.BLOCKED_ADDRESSES || '0x91db0dbd7ee9ea405852f65f044739c90cd076d5').split(',').filter(Boolean),
  /** Wallet decryption key; override via EKEY in production */
  ekey: process.env.EKEY || 'local-dev-only-change-EKEY-in-production',
};
