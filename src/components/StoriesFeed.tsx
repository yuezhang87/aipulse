"use client";

import { useState, useMemo } from "react";
import { categories } from "@/lib/mock-stories";
import { Story } from "@/types/story";
import StoryCard from "@/components/StoryCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";

export default function StoriesFeed({ stories }: { stories: Story[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [spicyOnly, setSpicyOnly] = useState(false);

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.summary.toLowerCase().includes(search.toLowerCase()) ||
        s.source.toLowerCase().includes(search.toLowerCase());
      const matchSpicy = !spicyOnly || s.spicy === true;
      return matchCat && matchSearch && matchSpicy;
    });
  }, [activeCategory, search, spicyOnly]);

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
          spicyOnly={spicyOnly}
          onSpicyToggle={() => setSpicyOnly((v) => !v)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--foreground)] opacity-40">
          <p className="text-lg font-medium">No stories found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      )}

      {/* Featured grid */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map((story) => (
            <StoryCard key={story.id} story={story} featured />
          ))}
        </div>
      )}

      {/* Rest list */}
      {rest.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl px-4 py-2">
          {rest.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
