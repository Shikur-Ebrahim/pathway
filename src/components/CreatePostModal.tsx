"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { addPathwayPost } from "@/lib/db";
import { X, UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCustomImageUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile && !customImageUrl) {
      setError("Please select an image file to upload to Cloudinary or provide an image URL.");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = customImageUrl;
      let cloudPublicId = "";

      if (selectedFile) {
        // Upload file via Cloudinary helper
        const result = await uploadToCloudinary(selectedFile);
        finalImageUrl = result.url;
        cloudPublicId = result.publicId;
      }

      // Save post metadata to Firestore
      await addPathwayPost({
        title,
        description,
        imageUrl: finalImageUrl,
        cloudinaryPublicId: cloudPublicId,
        authorName: user?.displayName || user?.email?.split("@")[0] || "Pathway Creator",
        authorEmail: user?.email || "anonymous@pathway.dev",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setCustomImageUrl("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to upload image or save metadata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Cloudinary + Firestore</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Create New Post</h2>
          <p className="text-sm text-slate-400">
            Upload images directly to Cloudinary and store metadata in Firestore
          </p>
        </div>

        {!isCloudinaryConfigured && (
          <div className="mb-5 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Cloudinary Integration Active</span>
              Your upload will be transformed and stored seamlessly. For production, add your Cloudinary preset in <code className="bg-cyan-950 px-1 py-0.5 rounded text-cyan-200">.env.local</code>.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sunset over Cyber City"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell the story behind this image..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Cloudinary Image Picker / Drag & Drop */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Image for Cloudinary Upload
            </label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 text-center transition-colors bg-slate-950/50">
              {previewUrl ? (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500 text-white opacity-90 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 border border-indigo-500/20">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    Click or Drag Image File Here
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    JPEG, PNG, WEBP, GIF up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Uploading to Cloudinary...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Upload & Publish to Firestore</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
