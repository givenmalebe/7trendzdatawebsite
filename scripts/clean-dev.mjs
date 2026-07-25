import { rmSync } from "node:fs"
import { execSync } from "node:child_process"

const projectRoot = process.cwd()

rmSync(`${projectRoot}/.next`, { recursive: true, force: true })
console.log("Removed .next cache")

if (process.platform === "win32") {
  for (const port of [3000, 3001, 3002]) {
    try {
      const out = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      })
      const pids = new Set(
        out
          .split("\n")
          .map((line) => line.trim().split(/\s+/).pop())
          .filter((pid) => pid && /^\d+$/.test(pid)),
      )
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" })
          console.log(`Stopped process ${pid} on port ${port}`)
        } catch {
          /* already stopped */
        }
      }
    } catch {
      /* no process on port */
    }
  }
}
