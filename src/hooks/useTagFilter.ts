
import { useState, useMemo } from 'react';
import { Skill } from '../lib/skills';

export function useTagFilter(skills: Skill[]) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredSkills = useMemo(() => {
    if (selectedTags.length === 0) {
      return skills;
    }
    return skills.filter((skill) =>
      selectedTags.every((tag) => skill.tags.includes(tag))
    );
  }, [skills, selectedTags]);

  return { selectedTags, toggleTag, filteredSkills };
}
