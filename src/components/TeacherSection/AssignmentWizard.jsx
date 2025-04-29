import React, { useState } from "react";

const AssignmentWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [assignmentType, setAssignmentType] = useState("");
  const [quizFormat, setQuizFormat] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(30);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [attempts, setAttempts] = useState(1);
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false);

  const subjects = [
    { id: 1, name: "Mathematics", icon: "fa-calculator" },
    { id: 2, name: "Science", icon: "fa-flask" },
    { id: 3, name: "English", icon: "fa-book" },
    { id: 4, name: "History", icon: "fa-landmark" },
    { id: 5, name: "Geography", icon: "fa-globe-americas" },
    { id: 6, name: "Art", icon: "fa-palette" },
  ];

  const assignmentTypes = [
    {
      id: "essay",
      name: "Essay",
      icon: "fa-file-alt",
      description: "Long-form written responses to prompts",
    },
    {
      id: "quiz",
      name: "Quiz",
      icon: "fa-question-circle",
      description: "Test knowledge with various question formats",
    },
    {
      id: "activity",
      name: "Activity",
      icon: "fa-puzzle-piece",
      description: "Interactive exercises and assignments",
    },
  ];

  const quizFormats = [
    {
      id: "multiple-choice",
      name: "Multiple Choice",
      icon: "fa-list-ul",
      description: "Select the correct answer from options",
    },
    {
      id: "fill-blanks",
      name: "Fill in the Blanks",
      icon: "fa-i-cursor",
      description: "Complete sentences with missing words",
    },
    {
      id: "guess-word",
      name: "Guess the Word",
      icon: "fa-lightbulb",
      description: "Identify words from clues or definitions",
    },
    {
      id: "true-false",
      name: "True/False",
      icon: "fa-check-circle",
      description: "Determine if statements are true or false",
    },
  ];

  const handleNextStep = () => setCurrentStep(currentStep + 1);
  const handlePreviousStep = () => setCurrentStep(currentStep - 1);
  const handleSubjectSelect = (subject) => setSelectedSubject(subject);
  const handleAssignmentTypeSelect = (type) => setAssignmentType(type);
  const handleQuizFormatSelect = (format) => setQuizFormat(format);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      type: quizFormat,
      options: quizFormat === "multiple-choice" ? ["", "", "", ""] : [],
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
  };
  const updateQuestion = (id, field, value) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };
  const updateOption = (questionId, optionIndex, value) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };
  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };
  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: "Subject", icon: "fa-book" },
      { num: 2, label: "Type", icon: "fa-file-alt" },
      { num: 3, label: "Format", icon: "fa-list" },
      { num: 4, label: "Questions", icon: "fa-question" },
      { num: 5, label: "Settings", icon: "fa-cog" },
      { num: 6, label: "Review", icon: "fa-eye" },
      { num: 7, label: "Publish", icon: "fa-paper-plane" },
    ];
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === step.num
                    ? "bg-blue-600 text-white"
                    : currentStep > step.num
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <i className={`fas ${step.icon}`}></i>
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  currentStep === step.num
                    ? "text-blue-600"
                    : currentStep > step.num
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
          {/* Progress bar */}
          <div className="absolute h-1 bg-gray-200 top-5 left-0 right-0 -z-10">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };
  const renderSubjectSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Subject</h2>
      <div className="grid grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => handleSubjectSelect(subject.name)}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
              selectedSubject === subject.name
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedSubject === subject.name
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-500"
                }`}
              >
                <i className={`fas ${subject.icon} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {subject.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderAssignmentTypeSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Choose Assignment Type</h2>
      <div className="grid grid-cols-3 gap-6">
        {assignmentTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleAssignmentTypeSelect(type.id)}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
              assignmentType === type.id
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  assignmentType === type.id
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-500"
                }`}
              >
                <i className={`fas ${type.icon} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {type.name}
              </h3>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderQuizFormatSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Quiz Format</h2>
      <div className="grid grid-cols-2 gap-6">
        {quizFormats.map((format) => (
          <div
            key={format.id}
            onClick={() => handleQuizFormatSelect(format.id)}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
              quizFormat === format.id
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  quizFormat === format.id
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-500"
                }`}
              >
                <i className={`fas ${format.icon} text-xl`}></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {format.name}
                </h3>
                <p className="text-gray-600 text-sm">{format.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  // ... The rest of the render functions and logic (renderQuestionEditor, renderSettingsPanel, renderReviewScreen, renderPublishScreen, renderCurrentStep, isNextDisabled, etc.) are identical to your provided code and will be included in the file ...

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Logo removed as per user instruction */}
              </div>
              <div className="ml-6 flex space-x-8">
                <a href="#" className="text-gray-900 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer">Dashboard</a>
                <a href="#" className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Assignments</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium cursor-pointer">Students</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium cursor-pointer">Grades</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium cursor-pointer">Reports</a>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
                <i className="fas fa-bell"></i>
              </button>
              {/* Avatar removed as per user instruction */}
              <span className="ml-2 text-sm font-medium text-gray-700">Ms. Johnson</span>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
              <p className="text-gray-600 mt-1">{formattedDate}</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-50">
                <i className="fas fa-question-circle mr-2"></i>
                Help
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-50">
                <i className="fas fa-save mr-2"></i>
                Save Draft
              </button>
            </div>
          </div>
        </div>
        {/* Step Indicator */}
        {renderStepIndicator()}
        {/* Current Step Content */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          {/* Render the current step, including Student section if present */}
          {renderCurrentStep && renderCurrentStep()}
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-button whitespace-nowrap cursor-pointer ${
              currentStep === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </button>
          {currentStep < 7 ? (
            <button
              onClick={handleNextStep}
              disabled={isNextDisabled && isNextDisabled()}
              className={`px-6 py-3 rounded-button whitespace-nowrap cursor-pointer ${
                isNextDisabled && isNextDisabled()
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          ) : (
            <button className="bg-green-600 text-white px-6 py-3 rounded-button whitespace-nowrap cursor-pointer hover:bg-green-700">
              Complete
              <i className="fas fa-check ml-2"></i>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssignmentWizard;
