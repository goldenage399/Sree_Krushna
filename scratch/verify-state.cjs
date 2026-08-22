const path = require('path');
const ms = require(path.join(__dirname, '..', 'public', 'js', 'marriage-state.js'));
console.log('Total canonical tasks in marriage-state:', ms.tasks.length);
ms.stages.forEach(s => {
  const count = ms.tasks.filter(t => t.stage === s.id).length;
  const completed = ms.tasks.filter(t => t.stage === s.id && (t.status === 'Completed' || t.done)).length;
  console.log(`${s.id} (${s.name}): ${count} tasks, ${completed} completed (0%)`);
});
