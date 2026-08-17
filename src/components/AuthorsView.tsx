import { BookOpen, Globe, Sparkles, User, Users } from 'lucide-react';
import React from 'react';
import { useStore } from '../context/StoreContext';

export const AuthorsView: React.FC = () => {
  const { authors, books, setSelectedAuthorId, setActiveTab } = useStore();

  const handleSelectAuthor = (authorId: number) => {
    setSelectedAuthorId(authorId);
    setActiveTab('catalog');
  };

  return (
    <div id="authors-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-amber-800 bg-amber-50 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Literary & Technical Luminaries
        </span>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">
          Featured <span className="text-amber-800 font-serif">Authors & Thinkers</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Explore celebrated minds shaping software engineering paradigms, behavioral economics, science fiction, and world history.
        </p>
      </div>

      {/* Authors Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => {
          const authorBooks = books.filter((b) => b.authorId === author.id);
          return (
            <div
              key={author.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <img
                  src={author.photoUrl}
                  alt={author.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md border border-stone-200 group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {author.nationality} · Born {author.birthYear}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    <BookOpen className="w-3 h-3 text-amber-700" />
                    <span>{authorBooks.length} titles in catalog</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{author.biography}</p>

              {/* Notable works */}
              {author.notableWorks && (
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Notable Works</span>
                  <div className="flex flex-wrap gap-1">
                    {author.notableWorks.map((work) => (
                      <span
                        key={work}
                        className="bg-stone-50 text-stone-700 text-[11px] px-2 py-0.5 rounded-lg border border-stone-200"
                      >
                        {work}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleSelectAuthor(author.id)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
              >
                Browse Books by {author.name.split(' ')[0]} &rarr;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
