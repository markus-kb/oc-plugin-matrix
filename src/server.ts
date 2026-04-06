import type { Plugin, PluginModule } from "@opencode-ai/plugin";

const server: Plugin = async () => {
  return {};
};

const plugin: PluginModule & { id: string } = {
  id: "matrix",
  server,
};

export default plugin;
