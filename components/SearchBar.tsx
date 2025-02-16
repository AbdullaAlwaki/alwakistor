"use client"; // تحديد أن هذا المكون هو Client Component

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void; // دالة للبحث
  suggestions: { id: any; name: any; image: any }[]; // قائمة الاقتراحات
  placeholder?: string; // نص العنصر النائب (اختياري)
}

export default function SearchBar({ onSearch, suggestions, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState(''); // حالة البحث

  return (
    <div className="relative">
      {/* شريط البحث */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || 'ابحث عن منتج...'}
        className="w-full p-2 border border-gray-300 rounded"
      />

      {/* زر البحث */}
      <button
        onClick={() => onSearch(query)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded"
      >
        بحث
      </button>

      {/* عرض الاقتراحات */}
      {query && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => {
            const altText = typeof suggestion.name === 'string' ? suggestion.name : 'Product Image';
            const imageUrl = typeof suggestion.image === 'string' ? suggestion.image : '/default-product-image.jpg';

            return (
              <li
                key={suggestion.id}
                onClick={() => {
                  setQuery(suggestion.name);
                  onSearch(suggestion.name);
                }}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img src={imageUrl} alt={altText} className="w-8 h-8 object-cover rounded mr-2" />
                <span>{suggestion.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}