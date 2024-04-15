let rainha = [
  {
    name: "Supervisor",
    namespace: "Supervisor",
    script: 'main.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Supervisor/"
  },
  {
    name: "Shield",
    namespace: "Shield",
    script: 'main.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Shield/"
  },
  {
    name: "Welcome",
    namespace: "Welcome",
    script: 'main.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Welcome/"
  },
]
module.exports = { apps: rainha }