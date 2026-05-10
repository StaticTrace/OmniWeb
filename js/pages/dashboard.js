import { initCore } from '../core.js';
import { init as initTime }       from '../widgets/time.js';
import { init as initWeather }    from '../widgets/weather.js';
import { init as initFocus }      from '../widgets/focus.js';
import { init as initTodo }       from '../widgets/todo.js';
import { init as initQuickLinks } from '../widgets/quick-links.js';
import { init as initAnalytics }  from '../widgets/analytics.js';
import { init as initGitHub }     from '../widgets/github.js';
import { init as initJournal }    from '../widgets/journal.js';
import { init as initHabit }      from '../widgets/habit.js';
import { init as initPomodoro }   from '../widgets/pomodoro.js';
import { init as initSteam }      from '../widgets/steam.js';

document.addEventListener('DOMContentLoaded', () => {
  initCore();
  initTime();
  initWeather();
  initFocus();
  initTodo();
  initQuickLinks();
  initAnalytics();
  initGitHub();
  initJournal();
  initHabit();
  initPomodoro();
  initSteam();
});
