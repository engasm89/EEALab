function segmentBold(text: string, keyBase: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyBase}-${i}`} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      <span key={`${keyBase}-${i}`}>{part}</span>
    ),
  );
}

export function LessonMarkdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\n+/);
  return (
    <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
          return (
            <ul key={bi} className="list-inside list-disc space-y-1 text-sm">
              {lines.map((line, li) => (
                <li key={li}>{segmentBold(line.replace(/^[-*]\s+/, ""), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} className="text-sm leading-relaxed">
            {segmentBold(block, `p-${bi}`)}
          </p>
        );
      })}
    </div>
  );
}
