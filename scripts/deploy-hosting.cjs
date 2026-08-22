const { execSync } = require('child_process');
console.log('Deploying hosting to Firebase...');
try {
  execSync('firebase.cmd deploy --only hosting --non-interactive', { stdio: 'inherit', shell: true });
  console.log('Firebase deployment succeeded!');
} catch (e) {
  console.error('Firebase deployment failed:', e.message);
  process.exit(1);
}
