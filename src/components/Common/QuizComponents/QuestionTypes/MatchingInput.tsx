import React, { useState, useEffect } from 'react';
import { MoveHorizontal, X, GripVertical } from 'lucide-react';
import { Question } from '../../../../types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface MatchingInputProps {
  question: Question;
  userAnswer?: { [key: string]: string };
  onAnswerChange: (answer: { [key: string]: string }) => void;
  disabled?: boolean;
  showHints?: boolean;
}

const MatchingInput: React.FC<MatchingInputProps> = ({
  question,
  userAnswer = {},
  onAnswerChange,
  disabled = false,
  showHints = true
}) => {
  const [matchedPairs, setMatchedPairs] = useState<{ left: string; right: string }[]>([]);
  const [availableRightItems, setAvailableRightItems] = useState<string[]>([]);
  
  // Initialize the component with any existing answers
  useEffect(() => {
    if (question.matchingPairs) {
      // Set up available right items
      const allRightItems = question.matchingPairs.map(pair => pair.right);
      
      // Filter out already matched items
      const matched = Object.entries(userAnswer).map(([left, right]) => ({ left, right }));
      setMatchedPairs(matched);
      
      const usedRightItems = Object.values(userAnswer);
      const available = allRightItems.filter(item => !usedRightItems.includes(item));
      setAvailableRightItems(available);
    }
  }, [question.matchingPairs, userAnswer]);

  const handleDragEnd = (result: any) => {
    if (disabled) return;
    
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Handle dropping from available items to matched pairs
    if (source.droppableId === 'available-items' && destination.droppableId.startsWith('left-item-')) {
      const leftItem = destination.droppableId.replace('left-item-', '');
      const rightItem = availableRightItems[source.index];
      
      // Update the matched pairs
      const newUserAnswer = { ...userAnswer, [leftItem]: rightItem };
      
      // Remove the right item from available items
      const newAvailableItems = availableRightItems.filter((_, index) => index !== source.index);
      
      setAvailableRightItems(newAvailableItems);
      onAnswerChange(newUserAnswer);
    }
  };

  const handleRemovePair = (leftItem: string) => {
    if (disabled) return;
    
    // Get the right item that was matched
    const rightItem = userAnswer[leftItem];
    
    // Remove the pair from userAnswer
    const newUserAnswer = { ...userAnswer };
    delete newUserAnswer[leftItem];
    
    // Add the right item back to available items
    if (rightItem) {
      setAvailableRightItems([...availableRightItems, rightItem]);
    }
    
    onAnswerChange(newUserAnswer);
  };

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 mb-4">
          <MoveHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Drag items to match</span>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Items to match */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items</h4>
              {question.matchingPairs?.map((pair, index) => {
                const isMatched = userAnswer[pair.left] !== undefined;
                const matchedRight = userAnswer[pair.left];
                
                return (
                  <div key={`left-${index}`} className="relative">
                    <Droppable 
                      droppableId={`left-item-${pair.left}`} 
                      isDropDisabled={isMatched || disabled}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-3 rounded-lg transition-colors min-h-[50px] flex items-center justify-between ${
                            snapshot.isDraggingOver 
                              ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                              : isMatched 
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700' 
                                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <span className="font-medium">{pair.left}</span>
                          {isMatched && (
                            <div className="flex items-center">
                              <span className="text-green-600 dark:text-green-400 text-sm mr-2">
                                {matchedRight}
                              </span>
                              <button
                                onClick={() => handleRemovePair(pair.left)}
                                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                disabled={disabled}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
            
            {/* Right Column - Available matches */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Drag from here</h4>
              <Droppable droppableId="available-items">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[200px] p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    {availableRightItems.map((rightItem, index) => (
                      <Draggable
                        key={rightItem}
                        draggableId={rightItem}
                        index={index}
                        isDragDisabled={disabled}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg flex items-center justify-between ${
                              snapshot.isDragging
                                ? 'bg-blue-100 dark:bg-blue-900/30 shadow-lg border border-blue-300 dark:border-blue-700'
                                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            <span>{rightItem}</span>
                            <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {availableRightItems.length === 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        {Object.keys(userAnswer).length === (question.matchingPairs?.length || 0) 
                          ? "All items matched!" 
                          : "No more items available"}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
        
        {showHints && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">How to match:</span> Drag items from the right column and drop them onto the matching items on the left. Click the X to remove a match.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingInput;