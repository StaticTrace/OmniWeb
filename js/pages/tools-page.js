import { initCore } from '../core.js';
import { init as initTextCounter }  from '../tools/text-counter.js';
import { init as initCalculator }   from '../tools/calculator.js';

// Side-effectful modules — register window handlers on import
import '../tools/password.js';
import '../tools/namegen.js';
import '../tools/json-formatter.js';

document.addEventListener('DOMContentLoaded', () => {
  initCore();
  initTextCounter();
  initCalculator();
});
