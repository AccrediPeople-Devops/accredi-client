import React, { useState, SetStateAction, Dispatch } from "react";
import { QuestionItem } from "../../types/questionPaper";
import RichTextEditor from "../RichTextEditor";

interface QuestionInputProps {
  questions: QuestionItem[];
  setQuestions: Dispatch<SetStateAction<QuestionItem[]>>;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  questions,
  setQuestions,
}) => {
  // Create a separate state for each question's new option
  const [newOptions, setNewOptions] = useState<Record<number, string>>({});

  const addQuestion = () => {
    const newQuestion: QuestionItem = {
      question: "",
      options: [],
      answer: "", // Will be string for single choice, array for multiple choice
      multipleChoiceQuestions: false, // Default to single choice
      answerDescription: "",
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    
    // Also clean up the new options state
    setNewOptions(prev => {
      const updated = {...prev};
      delete updated[index];
      return updated;
    });
  };

  const updateQuestion = (
    index: number,
    field: keyof QuestionItem,
    value: any
  ) => {
    setQuestions(prev => {
      const updatedQuestions = [...prev];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return updatedQuestions;
    });
  };

  // Handle answer selection for both single and multiple choice
  const handleAnswerChange = (questionIndex: number, option: string, isChecked: boolean) => {
    const question = questions[questionIndex];
    const isMultipleChoice = question.multipleChoiceQuestions;

    if (isMultipleChoice) {
      // Handle multiple choice (checkbox)
      const currentAnswers = Array.isArray(question.answer) ? question.answer : [];
      
      if (isChecked) {
        // Add option to answers
        const newAnswers = [...currentAnswers, option];
        updateQuestion(questionIndex, "answer", newAnswers);
      } else {
        // Remove option from answers
        const newAnswers = currentAnswers.filter(ans => ans !== option);
        updateQuestion(questionIndex, "answer", newAnswers);
      }
    } else {
      // Handle single choice (radio)
      updateQuestion(questionIndex, "answer", option);
    }
  };

  // Toggle between single and multiple choice
  const toggleMultipleChoice = (questionIndex: number) => {
    const question = questions[questionIndex];
    const newMultipleChoice = !question.multipleChoiceQuestions;
    
    // Reset answer when switching modes
    const newAnswer = newMultipleChoice ? [] : "";
    
    updateQuestion(questionIndex, "multipleChoiceQuestions", newMultipleChoice);
    updateQuestion(questionIndex, "answer", newAnswer);
  };

  // Update the option input for a specific question
  const handleOptionInputChange = (questionIndex: number, value: string) => {
    setNewOptions(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  // Add an option to a question
  const addOption = (questionIndex: number) => {
    const optionText = newOptions[questionIndex]?.trim();
    
    // If no input or empty, do nothing
    if (!optionText) return;
    
    // Check if this option already exists
    if (questions[questionIndex].options.includes(optionText)) {
      alert("This option already exists");
      return;
    }
    
    // Add the option to the question
    setQuestions(prev => {
      const updatedQuestions = [...prev];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [...updatedQuestions[questionIndex].options, optionText]
      };
      return updatedQuestions;
    });
    
    // Clear the input for this question
    setNewOptions(prev => ({
      ...prev,
      [questionIndex]: ""
    }));
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, questionIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOption(questionIndex);
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prev => {
      const updatedQuestions = [...prev];
      const removedOption = prev[questionIndex].options[optionIndex];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      
      // If the removed option was the answer, reset the answer
      const currentQuestion = updatedQuestions[questionIndex];
      if (currentQuestion.multipleChoiceQuestions) {
        // For multiple choice, remove from array
        const currentAnswers = Array.isArray(currentQuestion.answer) ? currentQuestion.answer : [];
        currentQuestion.answer = currentAnswers.filter(ans => ans !== removedOption);
      } else {
        // For single choice, reset to empty string
        if (currentQuestion.answer === removedOption) {
          currentQuestion.answer = "";
        }
      }
      
      return updatedQuestions;
    });
  };

  // Check if an option is selected (for both single and multiple choice)
  const isOptionSelected = (questionIndex: number, option: string) => {
    const question = questions[questionIndex];
    if (question.multipleChoiceQuestions) {
      return Array.isArray(question.answer) && question.answer.includes(option);
    } else {
      return question.answer === option;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[var(--foreground)]">
          Questions
        </h2>
        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-6 bg-[var(--input-bg)] rounded-[var(--radius-lg)] border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)]">
            No questions added yet. Click the button above to add a question.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, questionIndex) => (
            <div 
              key={questionIndex} 
              className="bg-[var(--input-bg)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-[var(--foreground)]">
                  Question {questionIndex + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-500 hover:text-red-600 p-1"
                  title="Remove question"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Question text */}
                <div>
                  <label 
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                  >
                    Question Text *
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => 
                      updateQuestion(questionIndex, "question", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="Enter question text"
                    required
                  />
                </div>

                {/* Multiple Choice Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`multiple-choice-${questionIndex}`}
                    checked={question.multipleChoiceQuestions || false}
                    onChange={() => toggleMultipleChoice(questionIndex)}
                    className="text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <label 
                    htmlFor={`multiple-choice-${questionIndex}`}
                    className="text-sm font-medium text-[var(--foreground-muted)]"
                  >
                    Allow multiple answers
                  </label>
                </div>

                {/* Question Type Indicator */}
                <div className="text-xs text-[var(--foreground-muted)]">
                  {question.multipleChoiceQuestions ? 
                    "Multiple Choice (Checkboxes)" : 
                    "Single Choice (Radio Buttons)"
                  }
                </div>

                {/* Options */}
                <div>
                  <label 
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                  >
                    Options *
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex} 
                        className="flex items-center"
                      >
                        <div className="flex-1 flex items-center space-x-2">
                          {question.multipleChoiceQuestions ? (
                            // Checkbox for multiple choice
                            <input
                              type="checkbox"
                              id={`q${questionIndex}-option${optionIndex}`}
                              checked={isOptionSelected(questionIndex, option)}
                              onChange={(e) => 
                                handleAnswerChange(questionIndex, option, e.target.checked)
                              }
                              className="text-[var(--primary)] focus:ring-[var(--primary)]"
                            />
                          ) : (
                            // Radio button for single choice
                            <input
                              type="radio"
                              id={`q${questionIndex}-option${optionIndex}`}
                              name={`q${questionIndex}-answer`}
                              checked={isOptionSelected(questionIndex, option)}
                              onChange={() => 
                                handleAnswerChange(questionIndex, option, true)
                              }
                              className="text-[var(--primary)] focus:ring-[var(--primary)]"
                            />
                          )}
                          <label 
                            htmlFor={`q${questionIndex}-option${optionIndex}`}
                            className="flex-1 px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)]"
                          >
                            {option}
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                          className="ml-2 text-red-500 hover:text-red-600 p-1"
                          title="Remove option"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add option input */}
                  <div className="flex mt-2">
                    <input
                      type="text"
                      value={newOptions[questionIndex] || ""}
                      onChange={(e) => handleOptionInputChange(questionIndex, e.target.value)}
                      onKeyDown={(e) => handleOptionKeyDown(e, questionIndex)}
                      className="flex-1 px-4 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-l-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      placeholder="Add an option"
                    />
                    <button
                      type="button"
                      onClick={() => addOption(questionIndex)}
                      className="px-4 py-2 bg-[var(--primary)] text-white rounded-r-[var(--radius-md)] hover:bg-[var(--primary)]/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Answer description */}
                <div>
                  <label 
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                  >
                    Answer Description
                  </label>
                  <RichTextEditor
                    value={question.answerDescription}
                    onChange={(value) => 
                      updateQuestion(questionIndex, "answerDescription", value)
                    }
                    placeholder="Explain why this is the correct answer"
                    minHeight="120px"
                    id={`answer-desc-${questionIndex}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionInput; 