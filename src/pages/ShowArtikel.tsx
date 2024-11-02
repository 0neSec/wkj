import React, { useState, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Eye, MessageCircle, Calendar, User, Share2 } from "lucide-react";
import Navbar from "../component/includes/navbar";
import Footer from "../component/includes/footer";

// Types for components
interface SkeletonProps {
  className?: string;
}

interface AlertProps {
  children: ReactNode;
  className?: string;
}

// Simple Skeleton component
const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Simple Alert component
const Alert: React.FC<AlertProps> = ({ children, className = "" }) => (
  <div
    className={`p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 ${className}`}
  >
    {children}
  </div>
);

// Interface for article data
interface Article {
  title: string;
  image: string;
  category: string;
  author: string;
  date: string;
  views: string;
  comments: number;
  content: string;
  authorBio: string;
  tags: string[];
}

const ShowArticle: React.FC = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Mock article data - replace with actual data fetching
  const article: Article = {
    title: "Manfaat Luar Biasa Daun Kelor untuk Kesehatan",
    image: "/assets/images/Daun Kelor.webp",
    category: "Tanaman Herbal",
    author: "Dr. Herbal",
    date: "24 Oktober 2024",
    views: "2.1K",
    comments: 15,
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, animi rerum quo natus voluptas quidem laboriosam libero accusamus placeat, 
    voluptatibus, ullam dolorum minima at harum expedita maxime quam vitae molestiae eligendi quis optio amet eum voluptates odit.`,
    authorBio:
      "Seorang ahli dalam bidang tanaman herbal dengan pengalaman lebih dari 10 tahun.",
    tags: ["Herbal", "Kesehatan", "Daun Kelor", "Obat Tradisional"],
  };

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  if (error) {
    return (
      <Alert className="max-w-4xl mx-auto mt-8">
        Failed to load article. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="">
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 py-8 mt-10">
        {/* Article Header */}
        <header className="mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <div className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                  {article.category}
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  onClick={handleShare}
                  aria-label="Share article"
                >
                  <Share2 size={20} />
                  {showShareTooltip && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                      URL Copied!
                    </span>
                  )}
                </button>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={18} aria-hidden="true" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} aria-hidden="true" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} aria-hidden="true" />
                  <span>{article.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>{article.comments} comments</span>
                </div>
              </div>
            </>
          )}
        </header>

        {/* Featured Image */}
        {isLoading ? (
          <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
        ) : (
          <div className="mb-8 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-11/12 mb-4" />
              <Skeleton className="h-6 w-10/12 mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
            </>
          ) : (
            <div className="mb-6 text-lg leading-relaxed text-gray-700">
              {article.content}
            </div>
          )}

          {/* Article Tags */}
          {!isLoading && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {!isLoading && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full bg-gray-300"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-lg font-semibold">{article.author}</h3>
                  <p className="text-gray-600">{article.authorBio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ShowArticle;
