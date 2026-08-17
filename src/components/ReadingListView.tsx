import {
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Flame,
  Plus,
  Sliders,
  Sparkles,
  Star,
  Target,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ReadingListItem, ReadingStatus } from '../types';
import { BookCover } from './BookCover';

export const ReadingListView: React.FC = () => {
  const { readingList, updateReadingProgress, removeFromReadingList, setSelectedBook, setActiveTab, showToast } =
    useStore();

  const [activeShelf, setActiveShelf] = useState<ReadingStatus>('CURRENTLY_READING');
  const [editingItem, setEditingItem] = useState<ReadingListItem | null>(null);
  const [editPage, setEditPage] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  const annualGoal = 20;
  const completedBooks = readingList.filter((r) => r.status === 'COMPLETED');
  const currentBooks = readingList.filter((r) => r.status === 'CURRENTLY_READING');
  const wantToReadBooks = readingList.filter((r) => r.status === 'WANT_TO_READ');
  const totalPagesRead = readingList.reduce((sum, item) => sum + (item.status === 'COMPLETED' ? item.book.pageCount : item.currentPage), 0);

  const goalProgress = Math.min(100, Math.round((completedBooks.length / annualGoal) * 100));

  const filteredItems = readingList.filter((item) => item.status === activeShelf);

  const handleOpenEdit = (item: ReadingListItem) => {
    setEditingItem(item);
    setEditPage(item.currentPage);
    setEditNotes(item.notes || '');
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateReadingProgress(editingItem.bookId, Number(editPage), undefined, editNotes);
    setEditingItem(null);
  };

  return (
    <div id="reading-list-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Annual Reading Goal Widget */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
        {/* Background graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                2026 Reading Challenge
              </span>
              <span className="text-stone-400 text-xs">Personal Knowledge Tracker</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Cultivate Wisdom, <span className="text-amber-400 font-serif">Page by Page</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              Track your daily reading milestones, log personal takeaways, and complete your technical & literary reading goals.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Completed</span>
                <p className="text-lg font-black text-amber-400">
                  {completedBooks.length} <span className="text-xs text-stone-400 font-normal">/ {annualGoal} books</span>
                </p>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Active Shelf</span>
                <p className="text-lg font-black text-white">{currentBooks.length} books</p>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Pages</span>
                <p className="text-lg font-black text-emerald-400">{totalPagesRead.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Goal Progress Ring / Bar */}
          <div className="lg:col-span-5 bg-stone-800/60 p-6 rounded-2xl border border-stone-700 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-200 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                Annual Goal: {annualGoal} Books
              </span>
              <span className="font-bold text-amber-400">{goalProgress}% Completed</span>
            </div>

            <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${goalProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-stone-400 italic">
              {completedBooks.length >= annualGoal
                ? '🏆 Congratulations! You achieved your annual reading objective!'
                : `Read ${annualGoal - completedBooks.length} more titles to conquer your 2026 goal.`}
            </p>
          </div>
        </div>
      </div>

      {/* Shelf Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          {(
            [
              { id: 'CURRENTLY_READING', label: 'Currently Reading', count: currentBooks.length },
              { id: 'WANT_TO_READ', label: 'Want to Read', count: wantToReadBooks.length },
              { id: 'COMPLETED', label: 'Completed', count: completedBooks.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveShelf(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeShelf === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeShelf === tab.id ? 'bg-amber-400 text-stone-950' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('catalog')}
          className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book to Shelf</span>
        </button>
      </div>

      {/* Shelf Content */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-stone-400 mx-auto shadow-xs">
            <BookMarked className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No books in this shelf</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Browse our catalog and choose "Add to Reading Shelf" to track your progress.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            Explore Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const percent = Math.min(100, Math.round((item.currentPage / item.book.pageCount) * 100));
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all"
              >
                <div className="flex gap-4">
                  <div
                    onClick={() => setSelectedBook(item.book)}
                    className="w-20 h-28 rounded-xl overflow-hidden shadow-xs cursor-pointer shrink-0"
                  >
                    <BookCover book={item.book} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-amber-700">{item.book.categoryName}</span>
                    <h4
                      onClick={() => setSelectedBook(item.book)}
                      className="text-xs font-bold text-stone-900 line-clamp-2 hover:text-amber-800 cursor-pointer"
                    >
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">by {item.book.authorName}</p>

                    {/* Progress details for active reads */}
                    {item.status === 'CURRENTLY_READING' && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                          <span>
                            Page {item.currentPage} of {item.book.pageCount}
                          </span>
                          <span className="text-amber-800 font-bold">{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {item.status === 'COMPLETED' && (
                      <div className="mt-2 flex items-center gap-1 text-emerald-700 text-xs font-bold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed · {item.book.pageCount} pages read</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Notes */}
                {item.notes && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-stone-700 italic">
                    "{item.notes}"
                  </div>
                )}

                {/* Shelf Item Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Update Progress & Notes</span>
                  </button>

                  <button
                    onClick={() => removeFromReadingList(item.bookId)}
                    className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                    title="Remove from reading shelf"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Progress Modal */}
      {editingItem && (
        <div
          id="edit-progress-modal-backdrop"
          onClick={() => setEditingItem(null)}
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            id="edit-progress-modal-container"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-md p-6 space-y-5"
          >
            <h3 className="text-sm font-bold text-stone-900">Update Reading Progress</h3>
            <p className="text-xs text-stone-500">{editingItem.book.title}</p>

            <form onSubmit={handleSaveProgress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current Page (Total: {editingItem.book.pageCount} pages)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={editingItem.book.pageCount}
                    value={editPage}
                    onChange={(e) => setEditPage(Number(e.target.value))}
                    className="flex-1 accent-amber-600"
                  />
                  <input
                    type="number"
                    min={0}
                    max={editingItem.book.pageCount}
                    value={editPage}
                    onChange={(e) => setEditPage(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-xs rounded-lg border border-stone-300 text-center font-bold"
                  />
                </div>
                <span className="text-[11px] text-stone-400 block mt-1">
                  {Math.round((editPage / editingItem.book.pageCount) * 100)}% through the book
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Personal Notes / Quotes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Key concepts learned, favorite quote, or reflection..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
