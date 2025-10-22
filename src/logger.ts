import { colors } from "./constants";

export class Logger {
  private format(level: string, color: string, message: string) {
    return `${color}${colors.bright}[OPENCLOUD] [${level}]:${colors.reset} ${message}`;
  }

  log(message: string) {
    console.log(this.format("LOG", colors.cyan, message));
  }

  error(message: string) {
    console.error(this.format("ERROR", colors.red, message));
  }

  warn(message: string) {
    console.warn(this.format("WARN", colors.yellow, message));
  }
}
