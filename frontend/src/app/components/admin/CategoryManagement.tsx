import { ArrowLeft, Plus, Edit, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import { Modal } from "../Modal";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  complaintCount: number;
}

interface CategoryManagementProps {
  onNavigate: (view: string) => void;
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id" | "complaintCount">) => void;
  onEditCategory: (id: string, category: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryManagement({ onNavigate, categories, onAddCategory, onEditCategory, onDeleteCategory }: CategoryManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#1e3a8a",
  });

  const handleAdd = () => {
    if (!formData.name) {
      alert("Category name is required");
      return;
    }
    onAddCategory(formData);
    setIsAddModalOpen(false);
    setFormData({ name: "", description: "", color: "#1e3a8a" });
  };

  const handleEdit = () => {
    if (!selectedCategory) return;
    onEditCategory(selectedCategory.id, formData);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", description: "", color: "#1e3a8a" });
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setIsEditModalOpen(true);
  };

  const colorOptions = [
    { value: "#1e3a8a", label: "Blue" },
    { value: "#06b6d4", label: "Cyan" },
    { value: "#ec4899", label: "Pink" },
    { value: "#f97316", label: "Orange" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Yellow" },
    { value: "#8b5cf6", label: "Purple" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-muted-foreground">
            Organize complaints with custom categories
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group rounded-2xl bg-card border border-border p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-xl shadow-lg"
                style={{ backgroundColor: category.color }}
              >
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-2 rounded-lg text-[#1e3a8a] hover:bg-[#1e3a8a]/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete category "${category.name}"?`)) {
                      onDeleteCategory(category.id);
                    }
                  }}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-medium text-foreground mb-2">{category.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {category.description || "No description"}
            </p>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Complaints</span>
                <span className="px-3 py-1 rounded-full bg-muted font-medium">
                  {category.complaintCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Category">
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAdd}
          submitLabel="Add Category"
          colorOptions={colorOptions}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Category">
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEdit}
          submitLabel="Save Changes"
          colorOptions={colorOptions}
        />
      </Modal>
    </div>
  );
}

function CategoryForm({ formData, setFormData, onSubmit, submitLabel, colorOptions }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div>
        <label className="block mb-2 text-foreground">Category Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Infrastructure, Academics, Hostel"
          required
          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label className="block mb-2 text-foreground">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this category"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block mb-2 text-foreground">Color *</label>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((option: any) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: option.value })}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                formData.color === option.value
                  ? "border-white shadow-lg scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: option.value }}
            >
              {formData.color === option.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        {submitLabel}
      </button>
    </form>
  );
}
