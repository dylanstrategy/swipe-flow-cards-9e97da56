
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Priority } from '@/pages/Discovery';

interface PriorityRankerProps {
  priorities: Priority[];
  onPrioritiesChange: (priorities: Priority[]) => void;
}

const PriorityRanker = ({ priorities, onPrioritiesChange }: PriorityRankerProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handlePrioritySelect = (priorityId: string) => {
    const updatedPriorities = priorities.map(p => {
      if (p.id === priorityId) {
        if (p.rank) {
          // Remove rank if already selected
          return { ...p, rank: undefined };
        } else {
          // Add rank (find next available rank 1-3)
          const rankedPriorities = priorities.filter(pr => pr.rank).length;
          if (rankedPriorities < 3) {
            return { ...p, rank: rankedPriorities + 1 };
          }
        }
      }
      return p;
    });

    // Reorder ranks to be sequential
    const rankedItems = updatedPriorities.filter(p => p.rank).sort((a, b) => (a.rank || 0) - (b.rank || 0));
    rankedItems.forEach((item, index) => {
      item.rank = index + 1;
    });

    onPrioritiesChange(updatedPriorities);
  };

  const handleDragStart = (e: React.DragEvent, priorityId: string) => {
    setDraggedItem(priorityId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedPriority = priorities.find(p => p.id === draggedItem);
    const targetPriority = priorities.find(p => p.id === targetId);

    if (!draggedPriority || !targetPriority || !draggedPriority.rank || !targetPriority.rank) {
      setDraggedItem(null);
      return;
    }

    const updatedPriorities = priorities.map(p => {
      if (p.id === draggedItem) {
        return { ...p, rank: targetPriority.rank };
      }
      if (p.id === targetId) {
        return { ...p, rank: draggedPriority.rank };
      }
      return p;
    });

    onPrioritiesChange(updatedPriorities);
    setDraggedItem(null);
  };

  const getRankDisplay = (rank?: number) => {
    if (!rank) return '';
    const labels = ['1st', '2nd', '3rd'];
    return labels[rank - 1] || '';
  };

  // Sort priorities: ranked items first (by rank), then unranked
  const sortedPriorities = [...priorities].sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank && !b.rank) return -1;
    if (!a.rank && b.rank) return 1;
    return 0;
  });

  return (
    <div className="space-y-2">
      {sortedPriorities.map((priority) => (
        <div
          key={priority.id}
          draggable={!!priority.rank}
          onDragStart={(e) => handleDragStart(e, priority.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, priority.id)}
          onClick={() => handlePrioritySelect(priority.id)}
          className={cn(
            "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between",
            priority.rank 
              ? "border-blue-500 bg-blue-50 shadow-sm" 
              : "border-gray-200 bg-white hover:border-gray-300",
            priority.rank && "hover:shadow-md",
            draggedItem === priority.id && "opacity-50 scale-95"
          )}
        >
          <span className={cn(
            "font-medium",
            priority.rank ? "text-blue-900" : "text-gray-700"
          )}>
            {priority.label}
          </span>
          
          {priority.rank && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
                {getRankDisplay(priority.rank)}
              </span>
              <span className="text-blue-600 text-sm">⋮⋮</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PriorityRanker;
