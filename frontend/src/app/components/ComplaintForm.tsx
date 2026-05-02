import { Send, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ComplaintFormProps {
  onSubmit: (complaint: { title: string; description: string; category: string }) => void;
  onNavigate: (view: string) => void;
}

export function ComplaintForm({ onSubmit, onNavigate }: ComplaintFormProps) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !title || !description) {
      alert("Please fill in all fields");
      return;
    }

    onSubmit({ title, description, category });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCategory("");
      setTitle("");
      setDescription("");
      onNavigate('dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-2xl bg-card/50 backdrop-blur-md border border-border p-12 shadow-xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">
            Complaint Submitted Successfully!
          </h2>
          <p className="text-muted-foreground">
            Your complaint has been received and will be reviewed soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="rounded-2xl bg-card/50 backdrop-blur-md border border-border p-8 shadow-xl">
        <h2 className="mb-6 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
          Submit a New Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Select a category</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Academics">Academics</option>
              <option value="Facilities">Facilities</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              required
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block mb-2 text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your complaint"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="group w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-[#1e3a8a]/30 hover:shadow-xl hover:shadow-[#1e3a8a]/40 transition-all hover:scale-105"
          >
            Submit Complaint
            <Send className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
