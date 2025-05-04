import React from "react";
import { CurriculumContent } from "../../types/curriculum";
import RichTextEditor from "../RichTextEditor";

interface CurriculumItemInputProps {
  items: CurriculumContent[];
  setItems: React.Dispatch<React.SetStateAction<CurriculumContent[]>>;
}

const CurriculumItemInput: React.FC<CurriculumItemInputProps> = ({
  items,
  setItems,
}) => {
  const addItem = () => {
    setItems([...items, { title: "", description: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof CurriculumContent, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setItems(updatedItems);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    ) {
      return;
    }

    const newItems = [...items];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Curriculum Items</h3>
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1 rounded-lg bg-[#5B2C6F] text-white text-sm hover:bg-[#5B2C6F]/90 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-4 bg-[#1A1A1A] rounded-lg text-center">
          <p className="text-white/70">No curriculum items yet. Add your first item!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-[#1A1A1A] rounded-lg border border-[#5B2C6F]/20"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[#D7BDE2] font-medium">Item {index + 1}</h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className={`p-1 rounded-lg ${
                      index === 0
                        ? "text-white/30 cursor-not-allowed"
                        : "text-white/70 hover:bg-[#5B2C6F]/20 hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className={`p-1 rounded-lg ${
                      index === items.length - 1
                        ? "text-white/30 cursor-not-allowed"
                        : "text-white/70 hover:bg-[#5B2C6F]/20 hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 rounded-lg text-red-400 hover:bg-red-500/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    placeholder="Enter title"
                    className="w-full px-3 py-2 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B2C6F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Description
                  </label>
                  <RichTextEditor
                    value={item.description}
                    onChange={(value) => updateItem(index, "description", value)}
                    placeholder="Enter description"
                    minHeight="150px"
                    id={`description-${index}`}
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

export default CurriculumItemInput; 