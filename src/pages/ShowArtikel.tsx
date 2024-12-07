import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Eye, MessageCircle, Calendar, User, Share2 } from "lucide-react";

import Navbar from "../component/includes/navbar";
import Footer from "../component/includes/footer";
import { Article, articleService } from "../services/Artikel";

// Skeleton component for loading states
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Article content formatter component
const ArticleFormatter = ({ content }: { content: string }) => {
  // Split content into lines
  const lines = content.split('\n');
  
  // Process lines into paragraphs and lists
  const elements: JSX.Element[] = [];
  let currentList: JSX.Element[] = [];
  let inList = false;
  
  const finishList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={elements.length} className="list-disc ml-6 mb-4">
          {currentList}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      finishList();
      return;
    }
    
    // Check if line starts with number or dash
    const listMatch = trimmedLine.match(/^(\d+\.|-)(.+)/);
    
    if (listMatch) {
      // Handle list items
      const [, , content] = listMatch;
      inList = true;
      
      currentList.push(
        <li key={index} className="mb-2">
          {content.trim()}
        </li>
      );
    } else {
      // Handle paragraphs
      finishList();
      elements.push(
        <p key={index} className="mb-4 text-gray-700">
          {trimmedLine}
        </p>
      );
    }
  });
  
  // Finish any remaining list
  finishList();
  
  return <div className="prose prose-lg max-w-none">{elements}</div>;
};

const ShowArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Article ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const articleData = await articleService.getArticleById(parseInt(id));
        if (articleData) {
          setArticle(articleData);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Failed to load article");
        console.error("Error fetching article:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.name || "",
          text: article?.description || "",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
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
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <div className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                  {article?.article_category.name}
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
                {article?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={18} aria-hidden="true" />
                  <span>
                    {new Date(article?.created_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </header>

        {/* Featured Image */}
        {isLoading ? (
          <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
        ) : (
          article?.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={`${process.env.REACT_APP_API_URL}${article.image_url}`}
                alt={article.name}
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          )
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
            <ArticleFormatter content={article?.description || ""} />
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default ShowArticle;