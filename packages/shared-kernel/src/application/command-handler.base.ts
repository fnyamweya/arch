import type { Command } from "./command.base";

export interface CommandHandler<TCommand extends Command<Record<string, unknown>>, TResult> {
  execute(command: TCommand): Promise<TResult>;
}
