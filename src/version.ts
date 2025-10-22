import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { HttpClient } from "./http";

export class VersionChecker {
  private http = new HttpClient({
    baseUrl: "https://api.github.com",
    retry: {
      attempts: 4,
      backoff: "exponential",
      baseMs: 250,
    },
  });

  /**
   * Get the current package version from github release api
   */
  async currentVersion(): Promise<string> {
    const response = await this.http.request<{ name: string }>(
      "/repos/relatiocc/opencloud/releases/latest",
    );
    return response.name || "unknown";
  }

  /**
   * Get the installed version from lock files (pnpm-lock.yaml, package-lock.json, or yarn.lock)
   */
  getInstalledVersion(packageName: string): string | null {
    try {
      // Try pnpm-lock.yaml first
      const pnpmLockPath = join(process.cwd(), "pnpm-lock.yaml");
      if (existsSync(pnpmLockPath)) {
        const content = readFileSync(pnpmLockPath, "utf-8");
        // Look for the package in the lock file
        // Format: packageName@version or packageName: version
        const regex = new RegExp(
          `['"]?${packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"]?:\\s*\\n?\\s*(?:specifier:\\s*)?(?:version:\\s*)?['"]?([\\d.]+)`,
          "i",
        );
        const match = content.match(regex);
        if (match?.[1]) return match[1];
      }

      // Try package-lock.json
      const packageLockPath = join(process.cwd(), "package-lock.json");
      if (existsSync(packageLockPath)) {
        const packageLock = JSON.parse(readFileSync(packageLockPath, "utf-8"));

        // Check in packages
        if (packageLock.packages) {
          const pkg =
            packageLock.packages[`node_modules/${packageName}`] ||
            packageLock.packages[packageName];
          if (pkg?.version) return pkg.version;
        }

        // Check in dependencies (older format)
        if (packageLock.dependencies?.[packageName]?.version) {
          return packageLock.dependencies[packageName].version;
        }
      }

      // Try yarn.lock
      const yarnLockPath = join(process.cwd(), "yarn.lock");
      if (existsSync(yarnLockPath)) {
        const content = readFileSync(yarnLockPath, "utf-8");
        // Yarn format: "package@version", "package@^version":\n  version "actual-version"
        const regex = new RegExp(
          `["']${packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}@[^"']+["']:[\\s\\S]*?\\n\\s+version\\s+["']([\\d.]+)["']`,
          "i",
        );
        const match = content.match(regex);
        if (match?.[1]) return match[1];
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if a package is up to date by comparing package.json version with lock file version
   */
  async isUpToDate(packageName: string): Promise<{
    upToDate: boolean;
    currentVersion: string;
    installedVersion: string | null;
  }> {
    try {
      const pkgName = packageName;
      if (!pkgName)
        return {
          upToDate: false,
          currentVersion: "unknown",
          installedVersion: null,
        };

      const currentVersion = (await this.currentVersion()).slice(1); // Remove leading 'v' if present
      const installedVersion = this.getInstalledVersion(pkgName);

      if (!installedVersion || currentVersion === "unknown")
        return { upToDate: false, currentVersion, installedVersion };
      return {
        upToDate: currentVersion === installedVersion,
        currentVersion,
        installedVersion,
      };
    } catch {
      return {
        upToDate: false,
        currentVersion: "unknown",
        installedVersion: null,
      };
    }
  }
}
