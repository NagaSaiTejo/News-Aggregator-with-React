import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ArticleItem from './ArticleItem';

const VirtualizedList = ({ articles }) => {
  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Estimated height of each article-card
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: '800px',
        width: '100%',
        overflow: 'auto',
      }}
      data-testid="article-list"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const article = articles[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                padding: '0 20px',
                boxSizing: 'border-box'
              }}
            >
              <ArticleItem article={article} index={virtualItem.index} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedList;
