import type * as SCHEMA from "@ctrlplane/db/schema";
import type { ResourceCondition } from "@ctrlplane/validators/resources";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IconExternalLink } from "@tabler/icons-react";
import * as LZString from "lz-string";

import { Button } from "@ctrlplane/ui/button";
import { Label } from "@ctrlplane/ui/label";

import { urls } from "~/app/urls";
import { ResourceIcon } from "../ResourceIcon";

type ResourceListProps = {
  resources: SCHEMA.Resource[];
  count: number;
  filter: ResourceCondition;
};

export const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  count,
  filter,
}) => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const resourcesUrl = urls.workspace(workspaceSlug).resources().baseUrl();

  return (
    <div className="space-y-4">
      <Label>Resources ({count})</Label>
      <div className="space-y-2">
        {resources.map((resource) => (
          <div className="flex items-center gap-2" key={resource.id}>
            <ResourceIcon version={resource.version} kind={resource.kind} />
            <div className="flex flex-col">
              <span className="overflow-hidden text-nowrap text-sm">
                {resource.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {resource.version}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm">
        <Link
          href={`${resourcesUrl}?${new URLSearchParams({
            filter: LZString.compressToEncodedURIComponent(
              JSON.stringify(filter),
            ),
          })}`}
          className="flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconExternalLink className="h-4 w-4" />
          View Resources
        </Link>
      </Button>
    </div>
  );
};
