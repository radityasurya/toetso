import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronUp, ChevronDown, X, GripVertical, Shuffle, List, CheckSquare, Type, AlignLeft, MoveHorizontal, ArrowUpDown } from 'lucide-react';
import { Question } from '../../../types';

interface SelectedQuestionListProps {
  selectedQuestions: Question[];
  onRemoveQuestion: (id: string) => void;
  onReorderQuestions: (newOrder: Question[]) => void;
  onMoveQuestion: (id: string, direction: 'up' | 'down') => void;
}

const SelectedQuestionList: React.FC<SelectedQuestionListProps> = ({
  selectedQuestions,
  onRemoveQuestion,
  onReorderQuestions,
  onMoveQuestion
}) => {
  const navigate = useNavigate();
  const [isShuffling, setIsShuffling] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return List;
      case 'multiple-answer': return CheckSquare;
      case 'fill-in-blank': return Type;
      case 'long-answer': return AlignLeft;
      case 'matching': return MoveHorizontal;
      case 'ordering': return ArrowUpDown;
      default: return List;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'multiple-answer': return 'Multiple Answer';
      case 'fill-in-blank': return 'Fill in Blank';
      case 'long-answer': return 'Long Answer';
      case 'matching': return 'Matching';
      case 'ordering': return 'Ordering';
      default: return 'Multiple Choice';
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderQuestions(items);
  };

  const handleShuffleQuestions = () => {
    if (selectedQuestions.length < 2) return;
    
    setIsShuffling(true);
    
    // Shuffle with animation delay for better UX
    setTimeout(() => {
      const shuffled = [...selectedQuestions].sort(() => Math.random() - 0.5);
      onReorderQuestions(shuffled);
      setIsShuffling(false);
    }, 500);
  };

  const toggleQuestionExpand = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const canShuffle = selectedQuestions.length >= 2;

  return (
    <div className="space-y-3">
      {selectedQuestions.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Selected Questions ({selectedQuestions.length})
          </h3>
          {canShuffle && (
            <button
              onClick={handleShuffleQuestions}
              disabled={isShuffling}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                isShuffling
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                  : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30'
              }`}
              title="Shuffle questions"
            >
              <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
              <span className="text-sm">{isShuffling ? 'Shuffling...' : 'Shuffle'}</span>
            </button>
          )}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="selected-questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-minimal"
            >
              {selectedQuestions.map((question, index) => {
                const TypeIcon = getQuestionTypeIcon(question.type);
                const isExpanded = expandedQuestions.has(question.id);
                
                return (
                  <Draggable 
                    key={question.id} 
                    draggableId={question.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
                          snapshot.isDragging 
                            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 shadow-lg' 
                            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        }`}
                      >
                        {/* Drag Handle */}
                        <div {...provided.dragHandleProps} className="flex flex-col items-center space-y-1 pt-1">
                          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Q{index + 1}</span>
                        </div>
                        
                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-blue-600 dark:text-blue-400">{getQuestionTypeLabel(question.type)}</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">•</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">{question.category}</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">•</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">{question.difficulty}</span>
                            <button
                              type="button"
                              onClick={() => toggleQuestionExpand(question.id)}
                              className="ml-auto text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          <div 
                            className={`text-sm text-gray-900 dark:text-white ${isExpanded ? '' : 'line-clamp-2'}`}
                            dangerouslySetInnerHTML={{ __html: question.question }}
                          />
                          
                          {isExpanded && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {question.explanation && (
                                <div className="mt-1">
                                  <span className="font-medium">Explanation:</span> {question.explanation}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-1">
                          <button
                            type="button"
                            onClick={() => onMoveQuestion(question.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onMoveQuestion(question.id, 'down')}
                            disabled={index === selectedQuestions.length - 1}
                            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveQuestion(question.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            title="Remove question"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              
              {selectedQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No questions added yet</p>
                  <p className="text-xs">Click on questions above or create new ones to get started</p>
                  <p className="text-xs mt-2 text-blue-600 dark:text-blue-400">💡 Tip: Drag and drop questions to reorder them</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SelectedQuestionList;