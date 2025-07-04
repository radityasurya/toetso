import React, { useState, useEffect } from 'react';
import { ArrowUpDown, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Question } from '../../../../types';

interface OrderingInputProps {
  question: Question;
  userAnswer?: string[];
  onAnswerChange: (answer: string[]) => void;
  disabled?: boolean;
  showHints?: boolean;
}

const OrderingInput: React.FC<OrderingInputProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  disabled = false,
  showHints = true
}) => {
  // For ordering questions, we need to initialize the items if not already set
  const [orderingItems, setOrderingItems] = useState<string[]>(() => {
    if (question.correctOrder && (!userAnswer || userAnswer.length === 0)) {
      // Create a shuffled copy of the correct order for initial display
      return [...question.correctOrder].sort(() => Math.random() - 0.5);
    }
    return userAnswer || [];
  });

  // Initialize ordering items if they're empty but question has correctOrder
  useEffect(() => {
    if (question.correctOrder && 
        (!orderingItems || orderingItems.length === 0)) {
      const shuffledItems = [...question.correctOrder].sort(() => Math.random() - 0.5);
      setOrderingItems(shuffledItems);
      onAnswerChange(shuffledItems);
    }
  }, [question, orderingItems, onAnswerChange]);

  const onDragEnd = (result: any) => {
    if (!result.destination || disabled) return;
    
    const items = Array.from(orderingItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setOrderingItems(items);
    onAnswerChange(items);
  };

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 mb-4">
          <ArrowUpDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Arrange items in the correct order</span>
        </div>
        
        <div className="space-y-2">
          {showHints && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop the items to arrange them in the correct order.
            </p>
          )}
          
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="ordering-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {orderingItems.map((item, index) => (
                    <Draggable 
                      key={`item-${index}`} 
                      draggableId={`item-${index}`} 
                      index={index}
                      isDragDisabled={disabled}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center space-x-3 p-4 border rounded-lg bg-white dark:bg-gray-800 ${
                            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-move hover:border-blue-400 dark:hover:border-blue-500'
                          } ${snapshot.isDragging ? 'shadow-lg border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-700 dark:text-blue-300 font-medium">
                            {index + 1}
                          </div>
                          <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{item}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default OrderingInput;