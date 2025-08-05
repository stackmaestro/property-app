import React from 'react';

interface TagListProps {
  tags: string[];
  onRemoveTag: (index: number) => void;
  label?: string;
  className?: string;
  showLabel?: boolean;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  onRemoveTag,
  label = "Added items",
  className = '',
  showLabel = true
}) => {
  if (tags.length === 0) return null;

  return (
    <div className={className}>
      {showLabel && (
        <div className="text-sm text-gray-600 mb-3">
          {label}:
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="ml-1 w-0 h-4 rounded-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center text-xs leading-none transition-colors duration-200"
              title={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagList;