"use client";

import React from "react";
import { PathwayItem } from "@/lib/db";
import { Cloud, Heart, User, Sparkles } from "lucide-react";

interface PostCardProps {
  post: PathwayItem;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [likes, setLikes] = React.useState(12);
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

        {/* Cloudinary Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-medium text-cyan-300">
          <Cloud className="w-3 h-3 text-cyan-400" />
          <span>Cloudinary CDN</span>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isLiked
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              : "bg-slate-950/70 text-slate-300 hover:text-white border border-slate-700/60"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {post.title}
          </h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px]">
              {post.authorName ? post.authorName[0].toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="font-medium text-slate-300 truncate max-w-[120px]">
              {post.authorName}
            </span>
          </div>

          <div className="flex items-center gap-1 text-rose-400/90 font-semibold">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{likes} appreciation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
