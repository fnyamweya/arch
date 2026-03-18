import { execFileSync } from "node:child_process";

const ports = [
    3000,
    3001,
    3002,
    8787,
    8788,
    8789,
    8790,
    8791,
    8792,
    8793,
    8794,
    8795,
    8796,
    9230,
    9231,
    9232,
    9233,
    9234,
    9235,
    9236,
    9237,
    9238,
    9239,
];

const repoRoot = "/workspaces/arch";
const processMatchers = [
    "turbo run dev",
    "pnpm dev",
    "next dev",
    "wrangler dev",
    "workerd",
    "esbuild",
];

function sleep(milliseconds) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function findMatchingPids() {
    try {
        const output = execFileSync("ps", ["-eo", "pid=,args="], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        });

        return output
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .flatMap((line) => {
                const firstSpace = line.indexOf(" ");
                if (firstSpace === -1) {
                    return [];
                }

                const pid = Number.parseInt(line.slice(0, firstSpace), 10);
                const command = line.slice(firstSpace + 1);

                if (!Number.isInteger(pid) || pid === process.pid || pid === process.ppid) {
                    return [];
                }

                if (!command.includes(repoRoot)) {
                    return [];
                }

                return processMatchers.some((matcher) => command.includes(matcher)) ? [pid] : [];
            });
    } catch {
        return [];
    }
}

function findListeningPids(port) {
    try {
        const output = execFileSync(
            "lsof",
            ["-ti", `tcp:${port}`, "-sTCP:LISTEN"],
            {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
            }
        ).trim();

        if (!output) {
            return [];
        }

        return output
            .split("\n")
            .map((value) => Number.parseInt(value, 10))
            .filter((value) => Number.isInteger(value));
    } catch {
        return [];
    }
}

const stalePids = new Set();

for (const pid of findMatchingPids()) {
    stalePids.add(pid);
}

for (const port of ports) {
    for (const pid of findListeningPids(port)) {
        stalePids.add(pid);
    }
}

for (const pid of stalePids) {
    try {
        process.kill(pid, "SIGKILL");
    } catch {
        // Process already exited between lookup and kill.
    }
}

if (stalePids.size > 0) {
    sleep(750);
}

const stubbornPids = new Set();

for (const port of ports) {
    for (const pid of findListeningPids(port)) {
        stubbornPids.add(pid);
    }
}

for (const pid of stubbornPids) {
    try {
        process.kill(pid, "SIGKILL");
    } catch {
        // Process already exited between lookup and kill.
    }
}

if (stalePids.size > 0 || stubbornPids.size > 0) {
    console.log(
        `Cleared stale repo dev processes: ${stalePids.size} initial, ${stubbornPids.size} stubborn listener(s).`
    );
}