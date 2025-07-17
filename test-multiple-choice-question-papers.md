# Multiple Choice Question Papers Implementation

## Overview
Implemented support for multiple choice/multiple answers functionality in question papers, allowing users to create questions that can have either single answers (radio buttons) or multiple answers (checkboxes).

## Updated Schema

### New Question Structure
```json
{
  "courseId": "6855bf28c95dc6472717e818",
  "title": "Question Paper Set 1 (MCQ) 10 Questions",
  "content": [
    {
      "question": "What is the capital of France?",
      "options": [
        "Paris",
        "London",
        "Rome",
        "Madrid"
      ],
      "answer": [
        "Paris"
      ],
      "multipleChoiceQuestions": true,
      "answerDescription": "Paris is the capital of France"
    }
  ]
}
```

### Key Changes
- **`answer`**: Now supports both `string` (single choice) and `string[]` (multiple choice)
- **`multipleChoiceQuestions`**: Boolean flag to indicate if multiple answers are allowed
- **Backward Compatibility**: Existing single-choice questions continue to work

## Implementation Details

### 1. **Updated Types** (`app/types/questionPaper.ts`)
```typescript
export interface QuestionItem {
  question: string;
  options: string[];
  answer: string | string[]; // Can be single string or array of strings
  multipleChoiceQuestions?: boolean; // Flag for multiple choice
  answerDescription: string;
}
```

### 2. **Enhanced QuestionInput Component** (`app/components/question/QuestionInput.tsx`)

#### New Features:
- **Toggle Switch**: Checkbox to enable/disable multiple choice for each question
- **Dynamic Input Types**: Radio buttons for single choice, checkboxes for multiple choice
- **Smart Answer Handling**: Automatically manages answer format based on question type
- **Visual Indicators**: Shows question type (Single Choice vs Multiple Choice)

#### Key Functions:
```typescript
// Handle answer selection for both types
const handleAnswerChange = (questionIndex: number, option: string, isChecked: boolean) => {
  const question = questions[questionIndex];
  const isMultipleChoice = question.multipleChoiceQuestions;

  if (isMultipleChoice) {
    // Handle multiple choice (checkbox)
    const currentAnswers = Array.isArray(question.answer) ? question.answer : [];
    if (isChecked) {
      const newAnswers = [...currentAnswers, option];
      updateQuestion(questionIndex, "answer", newAnswers);
    } else {
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
  const newAnswer = newMultipleChoice ? [] : "";
  
  updateQuestion(questionIndex, "multipleChoiceQuestions", newMultipleChoice);
  updateQuestion(questionIndex, "answer", newAnswer);
};
```

### 3. **Enhanced Validation** (Add & Edit Pages)

#### Validation Logic:
```typescript
// Validate answer based on question type
if (question.multipleChoiceQuestions) {
  // For multiple choice questions
  if (!Array.isArray(question.answer) || question.answer.length === 0) {
    throw new Error(`Question ${i + 1} must have at least one selected answer (multiple choice)`);
  }
  // Ensure all selected answers exist in options
  for (const selectedAnswer of question.answer) {
    if (!question.options.includes(selectedAnswer)) {
      throw new Error(`Question ${i + 1} has an invalid selected answer`);
    }
  }
} else {
  // For single choice questions
  if (!question.answer || (typeof question.answer === 'string' && question.answer === "")) {
    throw new Error(`Question ${i + 1} must have a selected answer (single choice)`);
  }
  if (typeof question.answer === 'string' && !question.options.includes(question.answer)) {
    throw new Error(`Question ${i + 1} has an invalid selected answer`);
  }
}
```

## User Interface Features

### 1. **Question Type Toggle**
- Checkbox labeled "Allow multiple answers"
- Visual indicator showing current question type
- Automatic answer format switching

### 2. **Dynamic Input Controls**
- **Single Choice**: Radio buttons (only one selection allowed)
- **Multiple Choice**: Checkboxes (multiple selections allowed)

### 3. **Visual Feedback**
- Question type indicator: "Single Choice (Radio Buttons)" or "Multiple Choice (Checkboxes)"
- Selected answers are visually highlighted
- Clear distinction between question types

## Testing Checklist

### ✅ **Single Choice Questions**
- [ ] Radio buttons appear for single choice questions
- [ ] Only one option can be selected at a time
- [ ] Answer is stored as string
- [ ] Validation works correctly
- [ ] Form submission works

### ✅ **Multiple Choice Questions**
- [ ] Checkboxes appear for multiple choice questions
- [ ] Multiple options can be selected
- [ ] Answers are stored as array
- [ ] Validation requires at least one answer
- [ ] Form submission works

### ✅ **Question Type Switching**
- [ ] Toggle between single and multiple choice works
- [ ] Answer format changes automatically
- [ ] No data loss when switching types
- [ ] Visual indicators update correctly

### ✅ **Validation**
- [ ] Single choice requires exactly one answer
- [ ] Multiple choice requires at least one answer
- [ ] Invalid answers are rejected
- [ ] Error messages are clear and specific

### ✅ **Backward Compatibility**
- [ ] Existing single-choice questions work
- [ ] No breaking changes to existing functionality
- [ ] Database migration not required

### ✅ **Form Submission**
- [ ] Add question paper works with new schema
- [ ] Edit question paper works with new schema
- [ ] Data is properly formatted for backend
- [ ] No TypeScript errors

## Files Modified
1. `app/types/questionPaper.ts` - Updated types for multiple choice support
2. `app/components/question/QuestionInput.tsx` - Enhanced component with multiple choice functionality
3. `app/(dashboard)/dashboard/question-papers/add/page.tsx` - Updated validation
4. `app/(dashboard)/dashboard/question-papers/edit/[id]/page.tsx` - Updated validation

## Usage Instructions

### Creating a Multiple Choice Question:
1. Go to Question Papers → Add Question Paper
2. Add a new question
3. Check "Allow multiple answers" checkbox
4. Add options using the "Add" button
5. Select multiple answers using checkboxes
6. Add answer description
7. Submit the form

### Creating a Single Choice Question:
1. Add a new question
2. Leave "Allow multiple answers" unchecked
3. Add options
4. Select one answer using radio button
5. Add answer description
6. Submit the form

## Notes
- The implementation maintains full backward compatibility
- Existing question papers continue to work without modification
- The new schema supports both single and multiple choice questions
- Validation ensures data integrity for both question types
- UI provides clear visual feedback for question types 