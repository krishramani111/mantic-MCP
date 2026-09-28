import type { MauticApiClient } from '../api/client.js';
import type { ToolDefinition, ToolResult } from '../types/index.js';

import * as contacts from './contacts.js';
import * as campaigns from './campaigns.js';
import * as emails from './emails.js';
import * as forms from './forms.js';
import * as segments from './segments.js';
import * as content from './content.js';
import * as business from './business.js';
import * as advanced from './advanced.js';
import * as integration from './integration.js';
import * as projects from './projects.js';

const modules = [
  contacts,
  campaigns,
  emails,
  forms,
  segments,
  content,
  business,
  advanced,
  integration,
  projects,
];

const enabledToolNames = new Set([
  'create_contact',
  'update_contact',
  'get_contact',
  'search_contacts',
  'list_segments',
  'create_segment',
  'get_segment_contacts',
  'list_contact_fields',
  'create_contact_field',
  'list_tags',
  'create_tag',
  'add_contact_tags',
]);

export const allToolDefinitions: ToolDefinition[] = modules
  .flatMap(m => m.toolDefinitions)
  .filter(tool => enabledToolNames.has(tool.name));

const allHandlers: Record<string, (client: MauticApiClient, args: any) => Promise<ToolResult>> = {};
for (const mod of modules) {
  Object.assign(allHandlers, mod.toolHandlers);
}

export async function dispatchTool(
  toolName: string,
  client: MauticApiClient,
  args: any,
): Promise<ToolResult> {
  if (!enabledToolNames.has(toolName)) {
    return {
      content: [{ type: 'text', text: `Tool not enabled: ${toolName}` }],
      isError: true,
    };
  }

  const handler = allHandlers[toolName];
  if (!handler) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
      isError: true,
    };
  }
  return handler(client, args);
}
