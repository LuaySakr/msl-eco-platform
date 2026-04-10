const { spawn } = require('child_process');
const path = require('path');

// Load repo root `.env` so PREFERRED matches `PORT` (CRA) before we spawn the child.
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Must match react-scripts/scripts/start.js + WebpackDevServerUtils.choosePort:
// CRA uses detect-port-alt(defaultPort, HOST). A naive net listen can disagree
// on Windows (multi-host bind). Under non-TTY (e.g. concurrently), if CRA's
// detect picks a different port than DEFAULT_PORT, it aborts instead of switching.
const detect = require('detect-port-alt');

// Prefer explicit PREFERRED_PORT, then shell PORT (matches root `.env`), then 2468.
const PREFERRED = parseInt(
  process.env.PREFERRED_PORT || process.env.PORT || '2468',
  10
);
const HOST = process.env.HOST || '0.0.0.0';

async function main() {
  const port = await detect(PREFERRED, HOST);
  if (port !== PREFERRED) {
    console.log(
      `Port ${PREFERRED} is in use; starting the dev server on ${port} instead.`
    );
  }

  const root = path.join(__dirname, '..');
  const reactScriptsBin = path.join(
    root,
    'node_modules',
    'react-scripts',
    'bin',
    'react-scripts.js'
  );

  const { PORT: _dropParentPort, ...restEnv } = process.env;
  const env = {
    ...restEnv,
    NODE_OPTIONS: '--no-deprecation',
    PORT: String(port),
  };

  const child = spawn(process.execPath, [reactScriptsBin, 'start'], {
    env,
    cwd: root,
    stdio: 'inherit',
  });

  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
