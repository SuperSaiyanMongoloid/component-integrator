import { useState } from 'react';
import { Toggle, GooeyFilter } from '@/components/ui/liquid-toggle';

const variants = [
  { name: 'Default', variant: 'default' as const, description: 'Primary action toggle' },
  { name: 'Success', variant: 'success' as const, description: 'Positive confirmation' },
  { name: 'Warning', variant: 'warning' as const, description: 'Caution indicator' },
  { name: 'Danger', variant: 'danger' as const, description: 'Critical action' },
];

function ToggleCard({ 
  name, 
  variant, 
  description 
}: { 
  name: string; 
  variant: 'default' | 'success' | 'warning' | 'danger';
  description: string;
}) {
  const [checked, setChecked] = useState(false);
  
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Toggle 
        variant={variant}
        checked={checked}
        onCheckedChange={setChecked}
      />
    </div>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <GooeyFilter />
      
      {/* Hero Section */}
      <div className="container max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Liquid Toggle
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A smooth, gooey toggle component with satisfying liquid animations
          </p>
        </div>

        {/* Toggle Variants Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {variants.map((item) => (
            <ToggleCard 
              key={item.variant}
              name={item.name}
              variant={item.variant}
              description={item.description}
            />
          ))}
        </div>

        {/* Usage Example */}
        <div className="mt-16 p-8 rounded-2xl bg-muted/50 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Usage</h2>
          <pre className="text-sm text-muted-foreground overflow-x-auto">
            <code>{`import { Toggle, GooeyFilter } from '@/components/ui/liquid-toggle'

// Add GooeyFilter once in your app
<GooeyFilter />

// Use the Toggle component
<Toggle 
  variant="success"
  checked={checked}
  onCheckedChange={setChecked}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Index;
