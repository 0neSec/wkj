import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article, articleService } from '../../../services/Artikel';

interface ArticleListProps {
  isHomePage?: boolean;
}

export default function ArticleList({ isHomePage = false }: ArticleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await articleService.getArticles();
        setArticles(fetchedArticles);
        
        // Extract unique categories from articles
        const uniqueCategories = ['All', ...Array.from(new Set(fetchedArticles.map(
          article => article.article_category.name
        )))];
        
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error fetching articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article =>
    (selectedCategory === 'All' || article.article_category.name === selectedCategory) &&
    article.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayArticles = isHomePage ? filteredArticles.slice(0, 3) : filteredArticles;

  if (isLoading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Artikel Kesehatan Jamu
      </h2>

      {!isHomePage && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Cari artikel..."
                className="w-full p-2 pl-10 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={20} 
              />
            </div>
            <select
              className="p-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayArticles.map((article) => (
          <div 
            key={article.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <img 
              className="h-48 w-full object-cover" 
              src={article.image_url} 
              alt={article.name} 
            />
            <div className="p-6">
              <div className="uppercase tracking-wide text-xs text-indigo-500 font-semibold">
                {article.article_category.name}
              </div>
              <a 
                href="#" 
                className="block mt-2 text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-300"
              >
                {article.name}
              </a>
              <p className="mt-3 text-gray-500 text-sm">
                {article.description.length > 150 
                  ? `${article.description.substring(0, 150)}...` 
                  : article.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="flex items-center text-sm text-gray-500">
                    <MessageCircle size={16} className="mr-1" />
                    {/* You might want to add comments count to your Article interface */}
                    0
                  </span>
                </div>
                <Link 
                  to={`/artikel/${article.id}`} 
                  className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 flex items-center"
                >
                  Selengkapnya <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}