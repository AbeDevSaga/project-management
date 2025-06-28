import React, { useState } from "react";
import { TUser, TProject } from "@/app/constants/type";

interface EvaluationFormProps {
  project: TProject;
  users: TUser[];
  evaluator: TUser;
  onSubmitEvaluation: (evaluationData: any) => void;
  onClose: () => void;
}

type EvaluationField =
  | "presentation"
  | "knowledgeDomain"
  | "knowledgeMethodology"
  | "questionConfidence"
  | "contentClarity"
  | "problemStatement"
  | "objectivesSignificance"
  | "projectMethodology"
  | "useCaseDiagram"
  | "sequenceActivityDiagram"
  | "classDiagram"
  | "persistenceDiagram"
  | "comments";

type Evaluation = {
  presentation: number;
  knowledgeDomain: number;
  knowledgeMethodology: number;
  questionConfidence: number;
  contentClarity: number;
  problemStatement: number;
  objectivesSignificance: number;
  projectMethodology: number;
  useCaseDiagram: number;
  sequenceActivityDiagram: number;
  classDiagram: number;
  persistenceDiagram: number;
  comments: string;
};

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  project,
  users,
  evaluator,
  onSubmitEvaluation,
  onClose,
}) => {
  const students = users.filter((user) => user.role === "student");
  const [evaluation, setEvaluation] = useState<Evaluation>({
    presentation: 0,
    knowledgeDomain: 0,
    knowledgeMethodology: 0,
    questionConfidence: 0,
    contentClarity: 0,
    problemStatement: 0,
    objectivesSignificance: 0,
    projectMethodology: 0,
    useCaseDiagram: 0,
    sequenceActivityDiagram: 0,
    classDiagram: 0,
    persistenceDiagram: 0,
    comments: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvaluation((prev) => ({
      ...prev,
      [name]: name === "comments" ? value : Math.min(Number(value), 100),
    }));
  };

  const validateForm = () => {
    // Check if all required fields are filled
    const requiredFields: EvaluationField[] = [
      "presentation",
      "knowledgeDomain",
      "knowledgeMethodology",
      "questionConfidence",
      "contentClarity",
      "problemStatement",
      "objectivesSignificance",
      "projectMethodology",
      "useCaseDiagram",
      "sequenceActivityDiagram",
      "classDiagram",
      "persistenceDiagram",
    ];

    for (const field of requiredFields) {
      if (evaluation[field as keyof Evaluation] === undefined || evaluation[field as keyof Evaluation] === null) {
        return `Please fill in all evaluation criteria`;
      }
    }

    if (students.length === 0) {
      return "No students found for this project";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const totalMarks =
        evaluation.presentation +
        evaluation.knowledgeDomain +
        evaluation.knowledgeMethodology +
        evaluation.questionConfidence +
        evaluation.contentClarity +
        evaluation.problemStatement +
        evaluation.objectivesSignificance +
        evaluation.projectMethodology +
        evaluation.useCaseDiagram +
        evaluation.sequenceActivityDiagram +
        evaluation.classDiagram +
        evaluation.persistenceDiagram;

      const evaluationData = {
        projectId: project._id,
        evaluatorId: evaluator._id,
        form: {
          presentation: evaluation.presentation,
          knowledgeDomain: evaluation.knowledgeDomain,
          knowledgeMethodology: evaluation.knowledgeMethodology,
          questionConfidence: evaluation.questionConfidence,
          contentClarity: evaluation.contentClarity,
          problemStatement: evaluation.problemStatement,
          objectivesSignificance: evaluation.objectivesSignificance,
          projectMethodology: evaluation.projectMethodology,
          useCaseDiagram: evaluation.useCaseDiagram,
          sequenceActivityDiagram: evaluation.sequenceActivityDiagram,
          classDiagram: evaluation.classDiagram,
          persistenceDiagram: evaluation.persistenceDiagram,
        },
        totalMarks,
        comments: evaluation.comments,
        date: new Date().toISOString(),
      };

      onSubmitEvaluation(evaluationData);
      onClose();
    } catch (error) {
      setError("Failed to submit evaluation. Please try again.");
      console.error("Evaluation submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            disabled={isSubmitting}
            onClick={onClose}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-primary text-xl font-semibold mb-4 md:mb-0">
              Student Final Project Evaluation Form
            </h2>
            <div className="text-sm text-gray-600">
              <p>Evaluator: {evaluator.username}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={project.title}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">NO</th>
                  <th className="p-2 border text-left">Evaluation Criteria</th>
                  <th className="p-2 border text-center">Weight</th>
                  <th className="p-2 border text-center">Point Given</th>
                </tr>
              </thead>
              <tbody>
                {/* Presentation */}
                <tr>
                  <td className="p-2 border">1</td>
                  <td className="p-2 border">
                    Overall Presentation:
                    <p className="text-xs text-gray-500">
                      Physical Appearance, clarity of voice projection, good
                      articulation, good eye contact, style, and language are
                      appropriate to discipline, thoughts and ideas flow
                      logically.
                    </p>
                  </td>
                  <td className="p-2 border text-center">6%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="presentation"
                      value={evaluation.presentation}
                      onChange={handleChange}
                      min="0"
                      max="6"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 border text-right font-medium">
                    Total Mark
                  </td>
                  <td className="p-2 border text-center font-medium">
                    {evaluation.presentation}
                  </td>
                </tr>

                {/* Knowledge */}
                <tr>
                  <td className="p-2 border">2</td>
                  <td className="p-2 border">
                    Knowledge about the domain areas of the project
                  </td>
                  <td className="p-2 border text-center">6%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="knowledgeDomain"
                      value={evaluation.knowledgeDomain}
                      onChange={handleChange}
                      min="0"
                      max="6"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">
                    Knowledge related to the Methodology Utilized
                  </td>
                  <td className="p-2 border text-center">6%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="knowledgeMethodology"
                      value={evaluation.knowledgeMethodology}
                      onChange={handleChange}
                      min="0"
                      max="6"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">
                    Answers questions raised with confidence
                  </td>
                  <td className="p-2 border text-center">7%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="questionConfidence"
                      value={evaluation.questionConfidence}
                      onChange={handleChange}
                      min="0"
                      max="7"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 border text-right font-medium">
                    Total Marks = 19%
                  </td>
                  <td className="p-2 border text-center font-medium">
                    {evaluation.knowledgeDomain +
                      evaluation.knowledgeMethodology +
                      evaluation.questionConfidence}
                  </td>
                </tr>

                {/* Content Clarity */}
                <tr>
                  <td className="p-2 border">3</td>
                  <td className="p-2 border">
                    Clarity and coherence of the content/ slide effectiveness
                  </td>
                  <td className="p-2 border text-center">3%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="contentClarity"
                      value={evaluation.contentClarity}
                      onChange={handleChange}
                      min="0"
                      max="3"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 border text-right font-medium">
                    Total Marks = 3%
                  </td>
                  <td className="p-2 border text-center font-medium">
                    {evaluation.contentClarity}
                  </td>
                </tr>

                {/* Problem Statement */}
                <tr>
                  <td className="p-2 border">4</td>
                  <td className="p-2 border">Statement of the problem</td>
                  <td className="p-2 border text-center">5%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="problemStatement"
                      value={evaluation.problemStatement}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">Objectives and Significance</td>
                  <td className="p-2 border text-center">5%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="objectivesSignificance"
                      value={evaluation.objectivesSignificance}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">Project Methodology</td>
                  <td className="p-2 border text-center">4%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="projectMethodology"
                      value={evaluation.projectMethodology}
                      onChange={handleChange}
                      min="0"
                      max="4"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 border text-right font-medium">
                    Total Marks = 14%
                  </td>
                  <td className="p-2 border text-center font-medium">
                    {evaluation.problemStatement +
                      evaluation.objectivesSignificance +
                      evaluation.projectMethodology}
                  </td>
                </tr>

                {/* Diagrams */}
                <tr>
                  <td className="p-2 border">5</td>
                  <td className="p-2 border">
                    System use case diagram and Description of use Case
                  </td>
                  <td className="p-2 border text-center">5%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="useCaseDiagram"
                      value={evaluation.useCaseDiagram}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">Sequence and Activity Diagram</td>
                  <td className="p-2 border text-center">5%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="sequenceActivityDiagram"
                      value={evaluation.sequenceActivityDiagram}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">Class Diagrams</td>
                  <td className="p-2 border text-center">4%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="classDiagram"
                      value={evaluation.classDiagram}
                      onChange={handleChange}
                      min="0"
                      max="4"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">
                    Persistence diagram/ Model Designing for ML
                  </td>
                  <td className="p-2 border text-center">4%</td>
                  <td className="p-2 border text-center">
                    <input
                      type="number"
                      name="persistenceDiagram"
                      value={evaluation.persistenceDiagram}
                      onChange={handleChange}
                      min="0"
                      max="4"
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 border text-right font-medium">
                    Total Marks = 18%
                  </td>
                  <td className="p-2 border text-center font-medium">
                    {evaluation.useCaseDiagram +
                      evaluation.sequenceActivityDiagram +
                      evaluation.classDiagram +
                      evaluation.persistenceDiagram}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Students Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">Student Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">The Total Result Earned</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">{student.username}</td>
                    <td className="p-2 border text-center">
                      {student.email || "N/A"}
                    </td>
                    <td className="p-2 border text-center">
                      {(
                        evaluation.presentation +
                        evaluation.knowledgeDomain +
                        evaluation.knowledgeMethodology +
                        evaluation.questionConfidence +
                        evaluation.contentClarity +
                        evaluation.problemStatement +
                        evaluation.objectivesSignificance +
                        evaluation.projectMethodology +
                        evaluation.useCaseDiagram +
                        evaluation.sequenceActivityDiagram +
                        evaluation.classDiagram +
                        evaluation.persistenceDiagram
                      ).toFixed(2)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Comments, Suggestions, and Recommendations
            </label>
            <textarea
              name="comments"
              value={evaluation.comments}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md h-24"
              placeholder="Enter your comments here..."
            />
          </div>

          {/* Signature */}
          <div className="mt-6 flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <p className="font-medium">
                Name of the Examiner: {evaluator.username}
              </p>
              <div className="mt-8">
                <p className="border-t-2 border-black w-48">Signature</p>
              </div>
            </div>
            <div>
              <p className="font-medium">
                Total Marks:
                <span className="ml-2">
                  {(
                    evaluation.presentation +
                    evaluation.knowledgeDomain +
                    evaluation.knowledgeMethodology +
                    evaluation.questionConfidence +
                    evaluation.contentClarity +
                    evaluation.problemStatement +
                    evaluation.objectivesSignificance +
                    evaluation.projectMethodology +
                    evaluation.useCaseDiagram +
                    evaluation.sequenceActivityDiagram +
                    evaluation.classDiagram +
                    evaluation.persistenceDiagram
                  ).toFixed(2)}
                  /60%
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Evaluation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationForm;
