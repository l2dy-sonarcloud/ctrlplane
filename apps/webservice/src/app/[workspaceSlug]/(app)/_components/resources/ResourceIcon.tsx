import {
  SiGit,
  SiKubernetes,
  SiTerraform,
} from "@icons-pack/react-simple-icons";
import {
  IconCloud,
  IconCube,
  IconServer,
  IconTerminal,
  IconUserDollar,
  IconUsersGroup,
} from "@tabler/icons-react";

export const ResourceIcon: React.FC<{ version: string; kind?: string }> = ({
  version,
  kind,
}) => {
  if (kind?.toLowerCase().includes("shared"))
    return <IconUsersGroup className="h-4 w-4 shrink-0 text-blue-300" />;
  if (kind?.toLowerCase().includes("customer"))
    return <IconUserDollar className="h-4 w-4 shrink-0 text-amber-500" />;
  if (version.includes("kubernetes"))
    return <SiKubernetes className="h-4 w-4 shrink-0 text-blue-300" />;
  if (version.includes("vm") || version.includes("compute"))
    return <IconServer className="h-4 w-4 shrink-0 text-cyan-300" />;
  if (version.includes("terraform"))
    return <SiTerraform className="h-4 w-4 shrink-0 text-purple-300" />;
  if (version.includes("ctrlplane.access"))
    return <IconTerminal className="h-4 w-4 shrink-0 text-neutral-300" />;
  if (kind?.toLowerCase().includes("git"))
    return <SiGit className="h-4 w-4 shrink-0 text-red-300" />;
  if (kind?.toLowerCase().includes("cloud"))
    return <IconCloud className="h-4 w-4 shrink-0 text-white" />;

  return <IconCube className="h-4 w-4 shrink-0 text-neutral-300" />;
};
