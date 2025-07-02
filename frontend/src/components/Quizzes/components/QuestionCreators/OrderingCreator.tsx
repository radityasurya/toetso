import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface OrderingCreatorProps {
  correctOrder: string[];
  onCorrectOrderChange: (correctOrder: string[]) => void;
}

const OrderingCreator: React.FC<OrderingCreatorProps> = ({
  correctOrder,
  onCorrectOrderChange
}) => {
  const handleItemChange = (index: number, value: string) => {
    const newOrder = [...correctOrder];
    newOrder[index] = value;
    onCorrectOrderChange(newOrder);
  };

  const addItem = () => {
    onCorrectOrderChange([...correctOrder, '']);
  };

  const removeItem = (index: number) => {
    if (correctOrder.length > 1) {
      onCorrectOrderChange(correctOrder.filter((_, i) => i !== index));
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(correctOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onCorrectOrderChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
          Items to Order *
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          title="Add another item"
        >
          <Plus className="w-3 h-3" />
          <span>Add Item</span>
        </button>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        Add items in the correct order. Students will see these items shuffled.
      </p>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="ordering-items-creator">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {correctOrder.map((item, index) => (
                <Draggable 
                  key={`item-${index}`} 
                  draggableId={`item-${index}`} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center space-x-2 p-2 border rounded-lg bg-white dark:bg-gray-800 ${
                        snapshot.isDragging ? 'shadow-lg border-green-500' : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-move" />
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={`Item ${index + 1}`}
                        required
                      />
                      {correctOrder.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Drag and drop items to reorder them. The order shown here will be the correct answer.
      </p>
    </div>
  );
};

export default OrderingCreator;