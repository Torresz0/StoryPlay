import { Handle, Position } from "reactflow";

const BLOCK_TYPE_ICONS = {
  narrative: "📖",
  chat: "💬",
  timed: "⏱",
  ending: "🏁",
};

export default function StoryNode({ data, selected }) {
  const title = data?.title || "Untitled Block";
  const content = data?.content || "";
  const blockType = data?.blockType || "narrative";
  const choiceCount = (data?.choices || []).length;
  const icon = BLOCK_TYPE_ICONS[blockType] || "📄";

  const headerClass = `node-card-header ${
    blockType === "chat"
      ? "chat"
      : blockType === "timed"
      ? "timed"
      : blockType === "ending"
      ? "ending"
      : ""
  }`;

  return (
    <div className={`node-card ${selected ? "selected" : ""}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="story-handle"
      />

      <div className={headerClass}>
        <span style={{ marginRight: 8 }}>{icon}</span>
        <span>{title}</span>
      </div>

      <div className="node-card-body">
        <div className="node-card-content">
          {content.length > 90 ? `${content.slice(0, 90)}…` : content}
        </div>

        <div className="node-card-meta">
          <span>{blockType}</span>
          <span>
            {choiceCount} choice{choiceCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="story-handle"
      />
    </div>
  );
}