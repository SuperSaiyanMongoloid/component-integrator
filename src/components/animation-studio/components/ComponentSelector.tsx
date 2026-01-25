import React from 'react';
import { cn } from '@/lib/utils';
import { COMPONENT_REGISTRY } from '../registry';
import { ToggleLeft, CheckSquare } from 'lucide-react';

interface ComponentSelectorProps {
  activeComponentId: string;
  onSelect: (componentId: string) => void;
  className?: string;
}

const ICONS: Record<string, React.ReactNode> = {
  'gooey-toggle': <ToggleLeft className="w-4 h-4" />,
  'gooey-checkbox': <CheckSquare className="w-4 h-4" />,
};

export function ComponentSelector({ 
  activeComponentId, 
  onSelect,
  className 
}: ComponentSelectorProps) {
  const components = Object.values(COMPONENT_REGISTRY);

  return (
    <div className={cn("flex gap-1", className)}>
      {components.map((component) => (
        <button
          key={component.id}
          onClick={() => onSelect(component.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
            activeComponentId === component.id
              ? "bg-neutral-700 text-neutral-100"
              : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
          )}
          title={component.description}
        >
          {ICONS[component.id]}
          <span className="hidden sm:inline">{component.name}</span>
        </button>
      ))}
    </div>
  );
}
