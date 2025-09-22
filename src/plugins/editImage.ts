import { Plugin, PluginContext, PluginResult } from "./type";
import { generateImageCommon } from "./generateImage";

const toolDefinition = {
  type: "function" as const,
  name: "editImage",
  description: "Edit the previously generated image based on a text prompt.",
  parameters: {
    type: "object" as const,
    properties: {
      prompt: {
        type: "string",
        description:
          "Description of the edits to be made to the image in English",
      },
    },
    required: ["prompt"],
  },
};

const editImage = async (
  context: PluginContext,
  args: Record<string, any>,
): Promise<PluginResult> => {
  const prompt = args.prompt as string;
  console.log("******** Edit image", prompt);
  return generateImageCommon(context, prompt, true);
};

export const plugin: Plugin = {
  toolDefinition,
  execute: editImage,
  generatingMessage: "Editing image...",
  isEnabled: () => true,
};
